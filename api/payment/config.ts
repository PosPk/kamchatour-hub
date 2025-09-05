export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    res.status(405).json({ ok: false });
    return;
  }
  const enabled = process.env.CLOUDPAYMENTS_ENABLED === '1' || false;
  const publicId = process.env.CLOUDPAYMENTS_PUBLIC_ID || '';
  const commission = Number(process.env.CLOUDPAYMENTS_COMMISSION || 0);
  const level = (process.env.OP_LEVEL_DEFAULT as 'L1'|'L2'|'L3') || 'L1';
  res.status(200).json({ enabled, publicId, commission, level });
}

