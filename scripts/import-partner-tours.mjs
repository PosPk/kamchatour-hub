import fs from 'node:fs';
import path from 'node:path';
import { Client } from 'pg';

function getDbUrlEnv() {
  const url = process.env.DATABASE_URL;
  if (url && url.startsWith('postgres')) return url;
  const host = process.env.PGHOST;
  const user = process.env.PGUSER;
  const password = process.env.PGPASSWORD;
  const database = process.env.PGDATABASE || 'postgres';
  const port = process.env.PGPORT || '5432';
  if (!host || !user || !password) throw new Error('Missing DB env: provide DATABASE_URL or PGHOST/PGUSER/PGPASSWORD');
  return `postgresql://${encodeURIComponent(user)}:${encodeURIComponent(password)}@${host}:${port}/${database}`;
}

async function main() {
  const file = path.resolve(process.cwd(), 'public', 'partner-tours.json');
  const raw = fs.readFileSync(file, 'utf8');
  const tours = JSON.parse(raw);
  if (!Array.isArray(tours) || tours.length === 0) {
    console.log('No tours to import.');
    return;
  }

  const client = new Client({ connectionString: getDbUrlEnv(), ssl: { rejectUnauthorized: false } });
  await client.connect();
  try {
    await client.query('BEGIN');
    // Upsert operators first
    const operatorIds = Array.from(new Set(tours.map(t => t.operator_id).filter(Boolean)));
    for (const opId of operatorIds) {
      await client.query(
        `insert into public.operators (id, name, verified)
         values ($1, $2, false)
         on conflict (id) do update set name = excluded.name`,
        [opId, opId.replace(/^partner_/,'').replace(/_/g,' ').trim() || opId]
      );
    }
    // Upsert tours
    for (const t of tours) {
      await client.query(
        `insert into public.tours (
            id, operator_id, title, title_i18n, region, activity, price_from, duration_days, rating, description, description_i18n
         ) values (
            $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11
         ) on conflict (id) do update set
            operator_id=excluded.operator_id,
            title=excluded.title,
            title_i18n=excluded.title_i18n,
            region=excluded.region,
            activity=excluded.activity,
            price_from=excluded.price_from,
            duration_days=excluded.duration_days,
            rating=excluded.rating,
            description=excluded.description,
            description_i18n=excluded.description_i18n,
            updated_at=now()
        `,
        [
          t.id,
          t.operator_id || null,
          t.title || null,
          t.title_i18n ? JSON.stringify(t.title_i18n) : null,
          t.region || null,
          t.activity || null,
          t.price_from ?? null,
          t.duration_days ?? null,
          t.rating ?? null,
          t.description || null,
          t.description_i18n ? JSON.stringify(t.description_i18n) : null,
        ]
      );
    }
    await client.query('COMMIT');
    console.log(`Imported/updated ${tours.length} tours and ${operatorIds.length} operators.`);
  } catch (e) {
    await client.query('ROLLBACK');
    console.error('Import failed:', e?.message || e);
    process.exitCode = 1;
  } finally {
    await client.end();
  }
}

main().catch((e)=>{ console.error(e); process.exitCode = 1; });

