module.exports = async (req, res) => {
  try {
    const { code } = req.query || {};
    if (!code) {
      res.status(400).json({ error: 'missing_code' });
      return;
    }

    const clientId = process.env.YANDEX_CLIENT_ID;
    const clientSecret = process.env.YANDEX_CLIENT_SECRET;
    if (!clientId || !clientSecret) {
      res.status(500).json({ error: 'missing_client_credentials' });
      return;
    }

    const baseUrl = process.env.NEXTAUTH_URL || `https://${req.headers.host}`;
    const redirectUri = `${baseUrl.replace(/\/$/, '')}/api/auth/callback/yandex`;

    const body = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
    });

    const response = await fetch('https://oauth.yandex.ru/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    });

    const json = await response.json();
    res.setHeader('Cache-Control', 'no-store, max-age=0');
    res.status(response.ok ? 200 : 400).json(json);
  } catch (error) {
    res.status(500).json({ error: 'internal_error', message: String(error) });
  }
};

