import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export async function POST(request: Request) {
  try {
    const { key, contentType } = await request.json();
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
    const command = new PutObjectCommand({ Bucket: bucket, Key: key, ContentType: contentType });
    const url = await getSignedUrl(s3, command, { expiresIn: 60 * 5 });
    return new Response(JSON.stringify({ ok: true, url }), { status: 200, headers: { 'content-type': 'application/json' } });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: String(e) }), { status: 500 });
  }
}

