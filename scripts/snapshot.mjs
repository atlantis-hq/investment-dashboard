// Daily portfolio snapshot. Idempotent: re-running on the same date overwrites
// the row (PK = date), which is what we want — the snapshot reflects the most
// recent compute of that day.

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config();

const { buildShape, pool } = await import('../server/portfolio.mjs');

const data = await buildShape();
const today = new Date().toISOString().slice(0, 10);

const byCategory = Object.fromEntries(
  data.categoryAllocation.map((c) => [
    c.key,
    {
      name: c.name,
      invested: c.invested,
      value: c.value,
      return_pct: c.return,
    },
  ]),
);

const { totalInvested, totalValue } = data.portfolioSummary;

await pool.query(
  `insert into portfolio_snapshots (date, total_invested, total_value, by_category, computed_at)
   values ($1, $2, $3, $4, now())
   on conflict (date) do update set
     total_invested = excluded.total_invested,
     total_value    = excluded.total_value,
     by_category    = excluded.by_category,
     computed_at    = excluded.computed_at`,
  [today, totalInvested, totalValue, byCategory],
);

console.log(
  `${new Date().toISOString()} snapshot ${today} totalValue=${totalValue} totalInvested=${totalInvested}`,
);

await pool.end();
