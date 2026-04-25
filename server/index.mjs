// Bentor dashboard API — runs on the Mac mini, exposed via Tailscale Funnel.
// Plain HTTP on PORT (default 8443); Funnel terminates TLS at the edge.

import http from 'node:http';
import { timingSafeEqual } from 'node:crypto';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config();

const { buildShape } = await import('./portfolio.mjs');

const PORT = Number(process.env.PORT || 8443);
const TOKEN = process.env.API_TOKEN;
if (!TOKEN) {
  console.error('FATAL: API_TOKEN env var is required.');
  process.exit(1);
}

const TOKEN_BUF = Buffer.from(`Bearer ${TOKEN}`);
function bearerOk(headerValue) {
  if (!headerValue) return false;
  const got = Buffer.from(headerValue);
  if (got.length !== TOKEN_BUF.length) return false;
  return timingSafeEqual(got, TOKEN_BUF);
}

const RATE_WINDOW_MS = 60_000;
const RATE_MAX = 60;
const rateBuckets = new Map();
function rateLimited(ip) {
  const now = Date.now();
  const cutoff = now - RATE_WINDOW_MS;
  const hits = (rateBuckets.get(ip) || []).filter((t) => t > cutoff);
  if (hits.length >= RATE_MAX) {
    rateBuckets.set(ip, hits);
    return true;
  }
  hits.push(now);
  rateBuckets.set(ip, hits);
  if (rateBuckets.size > 1000) {
    for (const [k, v] of rateBuckets) {
      const filtered = v.filter((t) => t > cutoff);
      if (filtered.length === 0) rateBuckets.delete(k);
      else rateBuckets.set(k, filtered);
    }
  }
  return false;
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.socket.remoteAddress || 'unknown';

  if (rateLimited(ip)) {
    res.writeHead(429, { 'content-type': 'application/json', 'retry-after': '60' });
    return res.end(JSON.stringify({ error: 'rate_limited' }));
  }

  if (!bearerOk(req.headers.authorization)) {
    res.writeHead(401, { 'content-type': 'application/json' });
    return res.end(JSON.stringify({ error: 'unauthorized' }));
  }

  if (url.pathname === '/health') {
    res.writeHead(200, { 'content-type': 'application/json' });
    return res.end(JSON.stringify({ ok: true, ts: Date.now() }));
  }

  if (url.pathname === '/portfolio' && req.method === 'GET') {
    try {
      const data = await buildShape();
      res.writeHead(200, {
        'content-type': 'application/json',
        'cache-control': 'public, max-age=30',
      });
      return res.end(JSON.stringify(data));
    } catch (err) {
      console.error('portfolio error:', err);
      res.writeHead(500, { 'content-type': 'application/json' });
      return res.end(JSON.stringify({ error: 'internal', message: err.message }));
    }
  }

  res.writeHead(404, { 'content-type': 'application/json' });
  res.end(JSON.stringify({ error: 'not_found' }));
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`bentor api listening on 127.0.0.1:${PORT}`);
});
