module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    res.status(405).json({ ok: false });
    return;
  }
  res.status(200).json({
    ok: true,
    node: process.version,
    hasSupabase: Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY),
    hasTelegram: Boolean(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_WEBHOOK_SECRET),
  });
};

