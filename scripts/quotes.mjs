// Daily quote fetcher. Reads assets where quote_source is set, calls the
// matching public API and upserts into the quotes table (PK = asset_id+date).
// Sources without credentials are skipped (logged), not fatal — the rest run.

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config();

const { pool } = await import('../server/portfolio.mjs');

const today = new Date().toISOString().slice(0, 10);

async function fetchJSON(url, init) {
  const res = await fetch(url, init);
  if (!res.ok) throw new Error(`${url} → ${res.status}`);
  return res.json();
}

async function fetchCoinGecko(assets) {
  const ids = [...new Set(assets.map((a) => a.quote_symbol).filter(Boolean))];
  if (!ids.length) return new Map();
  const data = await fetchJSON(
    `https://api.coingecko.com/api/v3/simple/price?ids=${ids.join(',')}&vs_currencies=eur`,
  );
  const out = new Map();
  for (const a of assets) {
    const p = data[a.quote_symbol]?.eur;
    if (p != null) out.set(a.id, p);
  }
  return out;
}

async function fetchMetals(assets) {
  const key = process.env.METALS_API_KEY;
  if (!key) {
    console.log('skip metals: METALS_API_KEY not set');
    return new Map();
  }
  const symbols = [...new Set(assets.map((a) => a.quote_symbol).filter(Boolean))];
  if (!symbols.length) return new Map();
  const data = await fetchJSON(
    `https://api.metals.dev/v1/latest?api_key=${key}&currency=EUR&unit=g&metal=${symbols.join(',')}`,
  );
  const prices = data.metals || {};
  const out = new Map();
  for (const a of assets) {
    const p = prices[a.quote_symbol];
    if (p != null) out.set(a.id, p);
  }
  return out;
}

async function fetchYahoo(assets) {
  const out = new Map();
  for (const a of assets) {
    const sym = a.quote_symbol || a.ticker;
    if (!sym) continue;
    try {
      const data = await fetchJSON(
        `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(sym)}?interval=1d&range=1d`,
        { headers: { 'user-agent': 'Mozilla/5.0 bentor-dashboard' } },
      );
      const price = data.chart?.result?.[0]?.meta?.regularMarketPrice;
      if (price != null) out.set(a.id, price);
    } catch (err) {
      console.error(`yahoo ${sym}:`, err.message);
    }
  }
  return out;
}

const FETCHERS = { coingecko: fetchCoinGecko, metals: fetchMetals, yahoo: fetchYahoo };

const { rows: assets } = await pool.query(
  "select id, name, ticker, quote_source, quote_symbol from assets where status='active' and quote_source in ('yahoo','coingecko','metals')",
);

if (!assets.length) {
  console.log('no quotable assets');
  await pool.end();
  process.exit(0);
}

const bySource = assets.reduce((m, a) => {
  if (!m[a.quote_source]) m[a.quote_source] = [];
  m[a.quote_source].push(a);
  return m;
}, {});

let written = 0;
let failed = 0;
for (const [source, group] of Object.entries(bySource)) {
  const fetcher = FETCHERS[source];
  if (!fetcher) continue;
  try {
    const prices = await fetcher(group);
    for (const a of group) {
      const price = prices.get(a.id);
      if (price == null) {
        console.error(`miss ${source} ${a.name} (${a.quote_symbol || a.ticker})`);
        failed += 1;
        continue;
      }
      await pool.query(
        `insert into quotes (asset_id, date, price, source, fetched_at)
         values ($1, $2, $3, $4, now())
         on conflict (asset_id, date) do update set
           price = excluded.price,
           source = excluded.source,
           fetched_at = excluded.fetched_at`,
        [a.id, today, price, source],
      );
      written += 1;
      console.log(`ok ${source} ${a.name} = ${price}`);
    }
  } catch (err) {
    console.error(`source ${source} failed:`, err.message);
    failed += group.length;
  }
}

console.log(`${new Date().toISOString()} quotes done written=${written} failed=${failed}`);
await pool.end();
process.exit(failed > 0 && written === 0 ? 1 : 0);
