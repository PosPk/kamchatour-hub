import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const key = String(form.get('key') || '');
    const file = form.get('file') as File | null;
    if (!key || !file) {
      return new Response(JSON.stringify({ ok: false, error: 'missing_key_or_file' }), { status: 400 });
    }

    const bucket = process.env.YC_BUCKET as string;
    const region = process.env.YC_REGION || 'ru-central1';
    const accessKeyId = process.env.AWS_ACCESS_KEY_ID as string;
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY as string;
    if (!bucket || !accessKeyId || !secretAccessKey) {
      return new Response(JSON.stringify({ ok: false, error: 'missing_s3_env' }), { status: 500 });
    }

    const s3 = new S3Client({
      region,
      credentials: { accessKeyId, secretAccessKey },
      endpoint: 'https://storage.yandexcloud.net',
      forcePathStyle: false,
    });

    const arrayBuffer = await file.arrayBuffer();
    const contentType = file.type || 'application/octet-stream';
    await s3.send(new PutObjectCommand({ Bucket: bucket, Key: key, Body: Buffer.from(arrayBuffer), ContentType: contentType }));

    return new Response(JSON.stringify({ ok: true, key }), { status: 200, headers: { 'content-type': 'application/json' } });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: String(e) }), { status: 500 });
  }
}

