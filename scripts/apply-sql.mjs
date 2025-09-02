import fs from 'node:fs';
import path from 'node:path';
import { Client } from 'pg';
import dns from 'node:dns/promises';

async function maybeResolveIPv4(hostname) {
  if (!hostname) return hostname;
  if (!process.env.FORCE_IPV4) return hostname;
  try {
    const addrs = await dns.resolve4(hostname);
    if (addrs && addrs.length) return addrs[0];
  } catch {}
  return hostname;
}

async function getConnection() {
  const url = process.env.DATABASE_URL;
  const host = process.env.PGHOST;
  const user = process.env.PGUSER;
  const password = process.env.PGPASSWORD;
  const database = process.env.PGDATABASE || 'postgres';
  const port = process.env.PGPORT ? Number(process.env.PGPORT) : 5432;

  if (url) {
    try {
      const u = new URL(url);
      const h = await maybeResolveIPv4(u.hostname);
      return new Client({
        host: h,
        port: Number(u.port || 5432),
        user: decodeURIComponent(u.username),
        password: decodeURIComponent(u.password),
        database: u.pathname ? u.pathname.slice(1) : database,
        ssl: { rejectUnauthorized: false },
      });
    } catch {
      return new Client({ connectionString: url, ssl: { rejectUnauthorized: false } });
    }
  }
  if (!host || !user || !password) {
    throw new Error('Database connection env is missing. Provide DATABASE_URL or PGHOST/PGUSER/PGPASSWORD');
  }
  const resolvedHost = await maybeResolveIPv4(host);
  return new Client({ host: resolvedHost, user, password, database, port, ssl: { rejectUnauthorized: false } });
}

const filesInOrder = [
  'schema.sql',
  'rls.sql',
  'audit.sql',
  'payments.sql',
  'rate_limit.sql',
  'commissions.sql',
  'announcements.sql',
  'booking.sql',
  'onchain.sql',
];

function readSql(file) {
  const full = path.resolve(process.cwd(), 'supabase', file);
  return fs.readFileSync(full, 'utf8');
}

async function main() {
  const client = await getConnection();
  await client.connect();
  try {
    await client.query('BEGIN');
    for (const f of filesInOrder) {
      const sql = readSql(f);
      process.stdout.write(`\n-- Applying ${f} ...\n`);
      await client.query(sql);
      process.stdout.write(`-- OK ${f}\n`);
    }
    await client.query('COMMIT');
    process.stdout.write('\nAll SQL applied successfully.\n');
  } catch (e) {
    await client.query('ROLLBACK');
    console.error('SQL apply failed:', e?.message || e);
    process.exitCode = 1;
  } finally {
    await client.end();
  }
}

main().catch((e) => { console.error(e); process.exitCode = 1; });

