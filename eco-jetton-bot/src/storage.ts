import Database from 'better-sqlite3';

const dbPath = process.env.DATABASE_PATH || './data/eco.db';
const db = new Database(dbPath);

export function ensureUserExists(from: { id: number; username?: string | null }) {
  const userId = from.id;
  const username = from.username ?? null;
  const now = Date.now();
  const row = db.prepare('SELECT id FROM users WHERE id = ?').get(userId);
  if (!row) {
    db.prepare('INSERT INTO users (id, username, joined_at) VALUES (?, ?, ?)').run(userId, username, now);
    db.prepare('INSERT INTO balances (user_id, eco_points) VALUES (?, 0)').run(userId);
  } else if (username) {
    db.prepare('UPDATE users SET username = ? WHERE id = ?').run(username, userId);
  }
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

