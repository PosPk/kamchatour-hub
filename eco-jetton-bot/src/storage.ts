import Database from 'better-sqlite3';

const dbPath = process.env.DATABASE_PATH || './data/eco.db';
const db = new Database(dbPath);

export function ensureUserExists(from: { id: number; username?: string | null }): { created: boolean } {
  const userId = from.id;
  const username = from.username ?? null;
  const now = Date.now();
  const row = db.prepare('SELECT id FROM users WHERE id = ?').get(userId);
  if (!row) {
    db.prepare('INSERT INTO users (id, username, joined_at) VALUES (?, ?, ?)').run(userId, username, now);
    db.prepare('INSERT INTO balances (user_id, eco_points) VALUES (?, 0)').run(userId);
    return { created: true };
  } else if (username) {
    db.prepare('UPDATE users SET username = ? WHERE id = ?').run(username, userId);
  }
  return { created: false };
}

export function addEcoPoints(userId: number, amount: number) {
  db.prepare('INSERT OR IGNORE INTO balances (user_id, eco_points) VALUES (?, 0)').run(userId);
  db.prepare('UPDATE balances SET eco_points = eco_points + ? WHERE user_id = ?').run(amount, userId);
}

export function getBalance(userId: number): number {
  const row = db.prepare('SELECT eco_points FROM balances WHERE user_id = ?').get(userId) as { eco_points: number } | undefined;
  return row?.eco_points ?? 0;
}

export function deductBalance(userId: number, amount: number): boolean {
  const row = db.prepare('SELECT eco_points FROM balances WHERE user_id = ?').get(userId) as { eco_points: number } | undefined;
  if (!row || row.eco_points < amount) return false;
  db.prepare('UPDATE balances SET eco_points = eco_points - ? WHERE user_id = ?').run(amount, userId);
  return true;
}

export function listTop(limit: number): Array<{ user_id: number; username?: string | null; eco_points: number }> {
  const rows = db.prepare(
    'SELECT balances.user_id as user_id, users.username as username, balances.eco_points as eco_points FROM balances LEFT JOIN users ON users.id = balances.user_id ORDER BY eco_points DESC LIMIT ?'
  ).all(limit) as Array<{ user_id: number; username?: string | null; eco_points: number }>;
  return rows;
}

export function insertClaim(userId: number, amount: number): number {
  const now = Date.now();
  const info = db.prepare('INSERT INTO claims (user_id, amount, created_at, status) VALUES (?, ?, ?, ?)').run(userId, amount, now, 'pending');
  // better-sqlite3 provides lastInsertRowid as bigint-compatible
  return Number(info.lastInsertRowid);
}

export function completeClaim(claimId: number, txHash: string) {
  db.prepare('UPDATE claims SET status = ?, tx_hash = ? WHERE id = ?').run('done', txHash, claimId);
}

export function failClaim(claimId: number) {
  db.prepare('UPDATE claims SET status = ? WHERE id = ?').run('failed', claimId);
}

export function awardJoinBonus(userId: number, points: number) {
  if (points <= 0) return;
  db.prepare('UPDATE balances SET eco_points = eco_points + ? WHERE user_id = ?').run(points, userId);
}

export function addReferral(referrerId: number, referredId: number): boolean {
  if (referrerId === referredId) return false;
  const now = Date.now();
  try {
    db.prepare('INSERT INTO referrals (referrer_id, referred_id, created_at) VALUES (?, ?, ?)').run(referrerId, referredId, now);
    return true;
  } catch {
    return false;
  }
}

export function rewardReferral(referrerId: number, points: number) {
  if (points <= 0) return;
  db.prepare('UPDATE balances SET eco_points = eco_points + ? WHERE user_id = ?').run(points, referrerId);
}

export function getUserCount(): number {
  const row = db.prepare('SELECT COUNT(1) as c FROM users').get() as { c: number };
  return row.c;
}

export function getClaimsStats(): { pending: number; done: number; failed: number } {
  const rows = db.prepare('SELECT status, COUNT(1) as c FROM claims GROUP BY status').all() as Array<{ status: string; c: number }>;
  const map: Record<string, number> = {};
  for (const r of rows) map[r.status] = r.c;
  return { pending: map['pending'] ?? 0, done: map['done'] ?? 0, failed: map['failed'] ?? 0 };
}

export function setUserWallet(userId: number, wallet: string) {
  db.prepare('UPDATE users SET wallet_address = ? WHERE id = ?').run(wallet, userId);
}

export function getUserWallet(userId: number): string | null {
  const row = db.prepare('SELECT wallet_address FROM users WHERE id = ?').get(userId) as { wallet_address: string | null } | undefined;
  return row?.wallet_address ?? null;
}

export function listTasks(): Array<{ id: string; title: string; points: number }> {
  return db.prepare('SELECT id, title, points FROM tasks ORDER BY points DESC').all() as Array<{ id: string; title: string; points: number }>;
}

export function upsertTask(id: string, title: string, points: number) {
  db.prepare('INSERT INTO tasks (id, title, points) VALUES (?, ?, ?) ON CONFLICT(id) DO UPDATE SET title = excluded.title, points = excluded.points').run(id, title, points);
}

export function completeTask(userId: number, taskId: string): boolean {
  const task = db.prepare('SELECT id, points FROM tasks WHERE id = ?').get(taskId) as { id: string; points: number } | undefined;
  if (!task) return false;
  const exists = db.prepare('SELECT 1 FROM user_tasks WHERE user_id = ? AND task_id = ?').get(userId, taskId);
  if (exists) return false;
  const now = Date.now();
  const tx = db.transaction(() => {
    db.prepare('INSERT INTO user_tasks (user_id, task_id, completed_at) VALUES (?, ?, ?)').run(userId, taskId, now);
    db.prepare('UPDATE balances SET eco_points = eco_points + ? WHERE user_id = ?').run(task.points, userId);
  });
  tx();
  return true;
}

