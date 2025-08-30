import { createServiceClient, supabase as publicClient } from './supabase';

type NftAttributes = Record<string, string | number | boolean>;

export interface MintRequest {
	userId?: string;
	title: string;
	description?: string;
	fileName: string;
	fileType: string;
	fileDataBase64: string; // base64-encoded image
	attributes?: NftAttributes;
}

export interface MintResult {
	success: boolean;
	itemId?: string;
	imageUrl?: string;
	error?: string;
}

const BUCKET = 'nft-media';

export async function ensureBucket(): Promise<void> {
	const svc = createServiceClient();
	if (!svc) throw new Error('Service client not configured');
	const { data: list } = await svc.storage.listBuckets();
	const has = (list || []).some(b => b.name === BUCKET);
	if (!has) {
		await svc.storage.createBucket(BUCKET, { public: true });
	}
}

export async function mintNftOffchain(req: MintRequest): Promise<MintResult> {
	const svc = createServiceClient();
	if (!svc) return { success: false, error: 'Service client not configured' };

	await ensureBucket();

	const fileBuffer = Buffer.from(req.fileDataBase64, 'base64');
	const objectPath = `${Date.now()}_${req.fileName}`;

	const upload = await svc.storage.from(BUCKET).upload(objectPath, fileBuffer, {
		contentType: req.fileType,
		upsert: false,
	});
	if (upload.error) return { success: false, error: upload.error.message };

	const { data: pub } = svc.storage.from(BUCKET).getPublicUrl(objectPath);
	const imageUrl = pub?.publicUrl;

	const insert = await svc
		.from('nft_items')
		.insert({
			user_id: req.userId ?? null,
			title: req.title,
			description: req.description ?? null,
			image_path: objectPath,
			image_url: imageUrl ?? null,
			attributes: req.attributes ?? null,
		})
		.select('id')
		.single();
	if (insert.error) return { success: false, error: insert.error.message };

	return { success: true, itemId: insert.data.id as string, imageUrl };
}

