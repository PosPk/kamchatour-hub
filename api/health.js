module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    res.status(405).json({ ok: false });
    return;
  }
  res.status(200).json({ ok: true, ts: new Date().toISOString() });
};

