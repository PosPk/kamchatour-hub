type LogLevel = 'info' | 'warn' | 'error';

const AXIOM_TOKEN = process.env.AXIOM_TOKEN as string | undefined;
const AXIOM_DATASET = process.env.AXIOM_DATASET as string | undefined;

export async function serverLog(event: string, fields?: Record<string, unknown>, level: LogLevel = 'info') {
  try {
    const record = {
      _time: new Date().toISOString(),
      level,
      event,
      ...fields,
    } as Record<string, unknown>;

    if (AXIOM_TOKEN && AXIOM_DATASET) {
      await fetch(`https://api.axiom.co/v1/datasets/${AXIOM_DATASET}/ingest`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${AXIOM_TOKEN}`,
        },
        body: JSON.stringify([record]),
      });
      return;
    }
    // Fallback to console
    const msg = `[log] ${event}`;
    if (level === 'error') console.error(msg, fields || {});
    else if (level === 'warn') console.warn(msg, fields || {});
    else console.log(msg, fields || {});
  } catch (e) {
    try { console.warn('[log-failed]', (e as any)?.message); } catch {}
  }
}

