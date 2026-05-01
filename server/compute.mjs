// Server-side derived views: cashflow projection, portfolio evolution, loan
// expiry alerts. Imported by buildShape() so the API ships ready-to-render
// arrays. Frontend keeps an identical fallback in src/data/portfolio.js for
// when the API is unreachable.

import { pool } from './portfolio.mjs';

const parseESDate = (s) => {
  if (!s) return null;
  const [d, m, y] = s.split('/');
  if (!d || !m || !y) return null;
  return new Date(Number(y), Number(m) - 1, Number(d));
};

const monthLabel = (d) =>
  d.toLocaleDateString('es-ES', { month: 'short', year: '2-digit' });

export function computeCashflow({ loans, rentaFija }) {
  const now = new Date();
  const months = [];
  for (let i = 0; i < 12; i++) {
    const m = new Date(now.getFullYear(), now.getMonth() + i, 1);
    let income = 0;
    let principal = 0;
    for (const l of loans) {
      const start = parseESDate(l.startDate);
      const end = parseESDate(l.endDate);
      if (!start || !end) continue;
      const mStart = new Date(m.getFullYear(), m.getMonth(), 20);
      if (mStart < start || mStart > end) continue;
      const r = l.interestRate / 100 / 12;
      const n = l.cuotasPagadas + l.cuotasRestantes;
      if (!n || !r) continue;
      const cuota = l.capital * (r / (1 - Math.pow(1 + r, -n)));
      const monthsElapsed = (m.getFullYear() - start.getFullYear()) * 12 + m.getMonth() - start.getMonth();
      const outstanding = l.capital * Math.pow(1 + r, monthsElapsed) - cuota * (Math.pow(1 + r, monthsElapsed) - 1) / r;
      const interestPortion = Math.max(0, outstanding * r);
      const principalPortion = cuota - interestPortion;
      income += interestPortion;
      principal += Math.max(0, principalPortion);
    }
    if (rentaFija && rentaFija.length > 0) {
      income += rentaFija[0].capital * (rentaFija[0].tae / 100) / 12;
    }
    months.push({
      month: monthLabel(m),
      income: Math.round(income),
      principal: Math.round(principal),
      total: Math.round(income + principal),
    });
  }
  return months;
}

// Reads transactions directly from the DB so evolution reflects the real
// ledger (vs. the fallback that hardcodes 2024-01-01 for PE/VC/crypto).
// Includes mortgage contributions so the line's tail matches the headline
// totalInvested (which uses full acquisition cost for real estate).
export async function computeEvolutionFromDB() {
  const res = await pool.query(`
    select date::text as date, amount
    from transactions
    where type in ('contribution', 'buy')
    order by date asc
  `);
  const events = res.rows.map((r) => ({
    date: new Date(r.date),
    amount: Number(r.amount),
  }));
  if (events.length === 0) return [];

  const earliest = events[0].date;
  const now = new Date();
  const points = [];
  let running = 0;
  let idx = 0;
  for (
    let d = new Date(earliest.getFullYear(), earliest.getMonth(), 1);
    d <= now;
    d = new Date(d.getFullYear(), d.getMonth() + 1, 1)
  ) {
    const monthEnd = new Date(d.getFullYear(), d.getMonth() + 1, 0);
    while (idx < events.length && events[idx].date <= monthEnd) {
      running += events[idx].amount;
      idx++;
    }
    points.push({ month: monthLabel(d), invested: Math.round(running) });
  }
  return points;
}

export function computeAlerts({ loans }) {
  const now = new Date();
  const alerts = [];
  for (const l of loans) {
    const end = parseESDate(l.endDate);
    if (!end) continue;
    const daysLeft = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
    if (daysLeft <= 60 && daysLeft > 0) {
      alerts.push({
        type: daysLeft <= 30 ? 'urgent' : 'warning',
        project: l.project,
        endDate: l.endDate,
        daysLeft,
        capitalPending: l.capitalPending,
      });
    }
  }
  alerts.sort((a, b) => a.daysLeft - b.daysLeft);
  return alerts;
}
