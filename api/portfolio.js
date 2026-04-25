// Vercel serverless: thin proxy to the Mac mini API exposed via Tailscale Funnel.
// The bearer token lives only in Vercel's env vars (server-side), never in
// client JS. Returns 503 if env vars are missing — frontend falls back to
// portfolio.js bundled with the build.

const API_URL = process.env.MAC_MINI_API_URL;
const API_TOKEN = process.env.API_TOKEN;

export default async function handler(req, res) {
  if (!API_URL || !API_TOKEN) {
    return res.status(503).json({
      error: 'api_not_configured',
      message: 'MAC_MINI_API_URL or API_TOKEN missing — frontend will fall back.',
    });
  }
  try {
    const upstream = await fetch(`${API_URL}/portfolio`, {
      headers: { authorization: `Bearer ${API_TOKEN}`, accept: 'application/json' },
    });
    const body = await upstream.text();
    res.setHeader('content-type', 'application/json');
    res.setHeader('cache-control', 's-maxage=30, stale-while-revalidate=120');
    return res.status(upstream.status).send(body);
  } catch (err) {
    console.error('proxy error:', err);
    return res.status(502).json({ error: 'upstream_unreachable', message: err.message });
  }
}
