const map: Record<string, string> = {
  'вулканы': 'https://img.icons8.com/ios-filled/50/mountain.png',
  'рыбалка': 'https://img.icons8.com/ios-filled/50/fishing.png',
  'киты': 'https://img.icons8.com/ios-filled/50/whale.png',
  'хайкинг': 'https://img.icons8.com/ios-filled/50/trekking.png',
};

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    res.status(405).json({ ok: false, error: 'Method Not Allowed' });
    return;
  }
  const q = String(req.query?.q || '').toLowerCase();
  const url = map[q];
  res.status(200).json({ icon: url ? { preview: url } : undefined });
}

