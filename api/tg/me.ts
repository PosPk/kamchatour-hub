export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    res.status(405).json({ ok: false });
    return;
  }
  res.status(200).json({ ok: true, user: { name: 'Пользователь', username: '', role: roleState } });
}

// shared role state (naive)
export let roleState: 'traveler'|'operator'|'rental'|'transfer'|'agent' = 'traveler';

