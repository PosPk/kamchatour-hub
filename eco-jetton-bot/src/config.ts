export function getNumberEnv(name: string, def: number): number {
  const v = process.env[name];
  if (!v) return def;
  const n = Number(v);
  return Number.isFinite(n) ? n : def;
}

export const config = {
  referralPoints: getNumberEnv('REFERRAL_POINTS', 10),
  joinBonusPoints: getNumberEnv('JOIN_BONUS_POINTS', 0),
};

