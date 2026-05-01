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

// Money-weighted return (XIRR) — solves for the rate that makes NPV of all
// cashflows zero. Uses Newton-Raphson with bisection fallback. Returns null
// when cashflows don't have at least one negative and one positive flow.
function xirr(flows) {
  if (!flows || flows.length < 2) return null;
  flows = [...flows].sort((a, b) => a.date - b.date);
  const t0 = flows[0].date.getTime();
  const yearMs = 365.25 * 86400 * 1000;
  const dts = flows.map((f) => (f.date.getTime() - t0) / yearMs);
  const amts = flows.map((f) => Number(f.amount));
  if (!amts.some((a) => a > 0) || !amts.some((a) => a < 0)) return null;

  const npv = (rate) => {
    let s = 0;
    for (let i = 0; i < amts.length; i++) s += amts[i] / Math.pow(1 + rate, dts[i]);
    return s;
  };
  const dnpv = (rate) => {
    let s = 0;
    for (let i = 0; i < amts.length; i++) {
      s -= (dts[i] * amts[i]) / Math.pow(1 + rate, dts[i] + 1);
    }
    return s;
  };

  let rate = 0.1;
  for (let i = 0; i < 100; i++) {
    const f = npv(rate);
    const df = dnpv(rate);
    if (!isFinite(f) || !isFinite(df) || Math.abs(df) < 1e-12) break;
    const next = rate - f / df;
    if (!isFinite(next) || next <= -0.999) break;
    if (Math.abs(next - rate) < 1e-9) return next;
    rate = next;
  }

  // Bisection fallback. Lower bound near -1 covers extreme short-horizon
  // losses (e.g. -8% in 6 days annualizes to ~-99.9%).
  let lo = -0.9999;
  let hi = 10;
  let fLo = npv(lo);
  let fHi = npv(hi);
  if (!isFinite(fLo) || !isFinite(fHi) || fLo * fHi > 0) return null;
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2;
    const fMid = npv(mid);
    if (!isFinite(fMid)) return null;
    if (Math.abs(fMid) < 1e-7 || (hi - lo) < 1e-9) return mid;
    if (fLo * fMid < 0) { hi = mid; fHi = fMid; }
    else { lo = mid; fLo = fMid; }
  }
  return (lo + hi) / 2;
}

// Per-asset terminal value: what the investor would net if liquidated today.
// Loans use capitalPending (principal already received is in cashflows).
// Real estate nets out the outstanding mortgage so the return matches the
// cash-out side (which excludes mortgage contributions).
function liquidationByAsset(shape) {
  const map = new Map();
  for (const x of shape.etfsFunds) map.set(x.name, Number(x.current));
  for (const x of shape.monetaryFunds) map.set(x.name, Number(x.current));
  for (const x of shape.crypto) map.set(x.name, Number(x.current));
  for (const x of shape.rentaFija) map.set(x.name, Number(x.currentValue));
  for (const x of shape.loans) map.set(x.project, Number(x.capitalPending));
  for (const x of shape.privateEquity) map.set(x.name, Number(x.currentValue));
  for (const x of shape.vcStartups) map.set(x.name, Number(x.currentValue));
  for (const p of shape.realEstate.properties) {
    const debt = p.financing.cash ? 0 : Number(p.financing.loan);
    map.set(p.name, Number(p.purchase.currentValue) - debt);
  }
  return map;
}

// Pulls all cashflows from the ledger. Excludes mortgage contributions
// (bank money, not investor cash) and 'fee' txs (already inside equity
// contribution amounts in the seed).
async function loadCashflows() {
  const res = await pool.query(`
    select t.date::text as date, t.type, t.amount, t.metadata, a.id as asset_id, a.name, a.category
    from transactions t
    join assets a on a.id = t.asset_id
    order by t.date asc
  `);
  const flows = [];
  for (const r of res.rows) {
    const date = new Date(r.date);
    const amount = Number(r.amount);
    const isMortgage = r.metadata && r.metadata.kind === 'mortgage';
    let signed = 0;
    if ((r.type === 'contribution' || r.type === 'buy') && !isMortgage) signed = -amount;
    else if (r.type === 'interest_payment' || r.type === 'principal_payment') signed = +amount;
    else continue;
    flows.push({ date, amount: signed, assetId: r.asset_id, name: r.name, category: r.category });
  }
  return flows;
}

export async function computeReturns(shape) {
  const flows = await loadCashflows();
  const liq = liquidationByAsset(shape);
  const today = new Date();

  const portfolioFlows = flows.map((f) => ({ date: f.date, amount: f.amount }));
  let portfolioTerminal = 0;
  for (const v of liq.values()) portfolioTerminal += v;
  portfolioFlows.push({ date: today, amount: portfolioTerminal });
  const portfolioXirr = xirr(portfolioFlows);

  const byCategory = new Map();
  for (const f of flows) {
    if (!byCategory.has(f.category)) byCategory.set(f.category, []);
    byCategory.get(f.category).push({ date: f.date, amount: f.amount });
  }
  const terminalByCategory = new Map();
  const addTerm = (cat, name) => {
    const v = liq.get(name) || 0;
    terminalByCategory.set(cat, (terminalByCategory.get(cat) || 0) + v);
  };
  for (const x of shape.etfsFunds) addTerm('etf_fund', x.name);
  for (const x of shape.monetaryFunds) addTerm('monetary', x.name);
  for (const x of shape.crypto) addTerm('crypto', x.name);
  for (const x of shape.rentaFija) addTerm('fixed_income', x.name);
  for (const x of shape.loans) addTerm('loan', x.project);
  for (const x of shape.privateEquity) addTerm('pe', x.name);
  for (const x of shape.vcStartups) addTerm('vc', x.name);
  for (const p of shape.realEstate.properties) addTerm('real_estate', p.name);

  const categoryXirr = {};
  for (const [cat, catFlows] of byCategory) {
    const term = terminalByCategory.get(cat) || 0;
    const allFlows = [...catFlows, { date: today, amount: term }];
    const r = xirr(allFlows);
    categoryXirr[cat] = r == null ? null : Math.round(r * 10000) / 100;
  }

  const today_ms = today.getTime();
  const yearMs = 365.25 * 86400 * 1000;
  const holdYearsByCategory = {};
  for (const [cat, catFlows] of byCategory) {
    const earliest = catFlows.reduce((min, f) => Math.min(min, f.date.getTime()), today_ms);
    holdYearsByCategory[cat] = Math.round(((today_ms - earliest) / yearMs) * 100) / 100;
  }
  const portfolioEarliest = flows.length
    ? flows.reduce((min, f) => Math.min(min, f.date.getTime()), today_ms)
    : today_ms;
  const portfolioHoldYears = Math.round(((today_ms - portfolioEarliest) / yearMs) * 100) / 100;

  return {
    portfolioXirrPct: portfolioXirr == null ? null : Math.round(portfolioXirr * 10000) / 100,
    portfolioHoldYears,
    categoryXirrPct: categoryXirr,
    categoryHoldYears: holdYearsByCategory,
    netLiquidation: Math.round(portfolioTerminal * 100) / 100,
  };
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
