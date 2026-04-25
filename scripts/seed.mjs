// Seed local Postgres from src/data/portfolio.js
// Connection: DATABASE_URL or default postgres://bentor@localhost/bentor

import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config({ path: '.env.local' });
dotenv.config();
import * as p from '../src/data/portfolio.js';

const { Client } = pg;
const conn = process.env.DATABASE_URL || 'postgres://bentor:bentor_local_dev_only@localhost:5432/bentor';
const client = new Client({ connectionString: conn });
await client.connect();

const today = new Date().toISOString().slice(0, 10);
const round2 = (n) => Math.round(n * 100) / 100;
const parseDate = (s) => {
  if (!s || !s.includes('/')) return null;
  const [d, m, y] = s.split('/');
  return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
};
const addMonths = (iso, n) => {
  const d = new Date(iso + 'T00:00:00Z');
  d.setUTCMonth(d.getUTCMonth() + n);
  return d.toISOString().slice(0, 10);
};
function frenchSchedule(capital, annualRatePct, months) {
  const r = annualRatePct / 100 / 12;
  const cuota = r === 0 ? capital / months : capital * (r / (1 - Math.pow(1 + r, -months)));
  let balance = capital;
  const rows = [];
  for (let i = 1; i <= months; i++) {
    const interest = balance * r;
    const principal = cuota - interest;
    balance -= principal;
    rows.push({ payment_no: i, principal: round2(principal), interest: round2(interest) });
  }
  return rows;
}

async function q(sql, params) {
  const r = await client.query(sql, params);
  return r;
}

async function tx(fn) {
  await q('begin');
  try { await fn(); await q('commit'); }
  catch (e) { await q('rollback'); throw e; }
}

await tx(async () => {
  console.log('Wiping data...');
  await q('truncate table loan_schedules, re_cashflows, quotes, valuations, transactions, portfolio_snapshots, assets restart identity cascade');

  // ---- assets ----
  const insertAsset = async (a) => {
    const r = await q(
      `insert into assets (category, subcategory, name, ticker, quote_source, quote_symbol, currency, status, metadata)
       values ($1,$2,$3,$4,$5,$6,$7,$8,$9) returning id`,
      [a.category, a.subcategory ?? null, a.name, a.ticker ?? null,
       a.quote_source ?? null, a.quote_symbol ?? null,
       a.currency ?? 'EUR', a.status ?? 'active', a.metadata ?? {}]
    );
    return r.rows[0].id;
  };

  const txs = [];
  const vals = [];
  const scheds = [];

  // ETFs + Fondos
  for (const f of p.etfsFunds) {
    const id = await insertAsset({
      category: 'etf_fund', subcategory: f.type || 'Fondo',
      name: f.name, ticker: f.ticker || null, quote_source: 'manual',
      metadata: { shares: f.shares, dateEntry: f.dateEntry },
    });
    const date = parseDate(f.dateEntry) || today;
    txs.push({ asset_id: id, type: 'buy', date,
      units: f.shares, unit_price: f.shares ? f.invested / f.shares : null,
      amount: round2(f.invested) });
    vals.push({ asset_id: id, date: today, value: round2(f.current), source: 'self' });
  }

  // Monetary
  for (const m of p.monetaryFunds) {
    const id = await insertAsset({
      category: 'monetary',
      subcategory: m.ticker === 'XAUEUR' ? 'Oro Físico' : 'Fondo Monetario',
      name: m.name, ticker: m.ticker || null,
      quote_source: m.ticker === 'XAUEUR' ? 'metals' : 'manual',
      quote_symbol: m.ticker === 'XAUEUR' ? 'XAU' : null,
      metadata: { units: m.units, pricePerUnit: m.pricePerUnit },
    });
    txs.push({ asset_id: id, type: 'buy', date: today,
      units: m.units || null, unit_price: m.pricePerUnit || null,
      amount: round2(m.invested) });
    vals.push({ asset_id: id, date: today, value: round2(m.current), source: 'self' });
  }

  // Crypto
  for (const c of p.crypto) {
    const id = await insertAsset({
      category: 'crypto', name: c.name, ticker: c.ticker,
      quote_source: 'coingecko',
      quote_symbol: c.ticker.toLowerCase() === 'btc' ? 'bitcoin' : c.ticker.toLowerCase(),
      metadata: { amount: c.amount, avgPrice: c.avgPrice },
    });
    txs.push({ asset_id: id, type: 'buy', date: today,
      units: c.amount, unit_price: c.avgPrice, amount: round2(c.invested) });
    vals.push({ asset_id: id, date: today, value: round2(c.current), source: 'self' });
  }

  // Renta Fija
  for (const r of p.rentaFija) {
    const id = await insertAsset({
      category: 'fixed_income', subcategory: r.product, name: r.name,
      quote_source: 'manual',
      metadata: { tae: r.tae, startDate: parseDate(r.startDate), months: r.months },
    });
    const date = parseDate(r.startDate) || today;
    txs.push({ asset_id: id, type: 'contribution', date, amount: round2(r.capital) });
    vals.push({ asset_id: id, date: today, value: round2(r.currentValue), source: 'self' });
  }

  // Loans
  for (const l of p.loans) {
    const id = await insertAsset({
      category: 'loan', subcategory: l.platform, name: l.project,
      quote_source: 'manual',
      status: l.status === 'Activo' ? 'active' : 'closed',
      metadata: {
        platform: l.platform, term_months: l.term,
        interest_rate: l.interestRate, tir: l.tir,
        start_date: parseDate(l.startDate), end_date: parseDate(l.endDate),
        cuotasPagadas: l.cuotasPagadas, cuotasRestantes: l.cuotasRestantes,
      },
    });
    const start = parseDate(l.startDate);
    if (!start) continue;
    txs.push({ asset_id: id, type: 'contribution', date: start, amount: round2(l.capital) });

    const sched = frenchSchedule(l.capital, l.interestRate, l.term);
    for (const s of sched) {
      const due = addMonths(start, s.payment_no - 1);
      const paid = s.payment_no <= l.cuotasPagadas;
      scheds.push({
        asset_id: id, payment_no: s.payment_no, due_date: due,
        scheduled_principal: s.principal, scheduled_interest: s.interest,
        paid_principal: paid ? s.principal : 0,
        paid_interest: paid ? s.interest : 0,
        paid_date: paid ? due : null,
        status: paid ? 'paid' : 'pending',
      });
      if (paid) {
        txs.push({ asset_id: id, type: 'interest_payment', date: due,
          amount: s.interest, metadata: { payment_no: s.payment_no } });
        txs.push({ asset_id: id, type: 'principal_payment', date: due,
          amount: s.principal, metadata: { payment_no: s.payment_no } });
      }
    }
  }

  // PE
  for (const pe of p.privateEquity) {
    const id = await insertAsset({
      category: 'pe', name: pe.name, quote_source: 'manual',
      metadata: { participation_pct: pe.participation, company_valuation: pe.companyValuation },
    });
    txs.push({ asset_id: id, type: 'contribution', date: '2024-01-01', amount: round2(pe.invested) });
    vals.push({ asset_id: id, date: today, value: round2(pe.currentValue), source: 'company_report' });
  }

  // VC
  for (const v of p.vcStartups) {
    const id = await insertAsset({
      category: 'vc', name: v.name, quote_source: 'manual', metadata: {},
    });
    txs.push({ asset_id: id, type: 'contribution', date: '2024-01-01', amount: round2(v.invested) });
    vals.push({ asset_id: id, date: today, value: round2(v.currentValue), source: 'self' });
  }

  // Real Estate
  for (const re of p.realEstate.properties) {
    const id = await insertAsset({
      category: 'real_estate', subcategory: re.type, name: re.name,
      quote_source: 'manual',
      metadata: {
        city: re.city, purchase: re.purchase, financing: re.financing,
        income: re.income, expenses: re.expenses,
      },
    });
    const date = parseDate(re.purchase.date) || today;
    const equityIn = re.financing.cash
      ? re.purchase.price + re.purchase.fees
      : re.financing.equity + re.purchase.fees;
    txs.push({ asset_id: id, type: 'contribution', date, amount: round2(equityIn),
      notes: 'equity + fees at purchase' });
    if (!re.financing.cash) {
      txs.push({ asset_id: id, type: 'contribution', date, amount: round2(re.financing.loan),
        notes: 'mortgage drawdown', metadata: { kind: 'mortgage' } });
    }
    txs.push({ asset_id: id, type: 'fee', date, amount: round2(re.purchase.fees),
      notes: 'acquisition fees' });
    vals.push({ asset_id: id, date: today, value: round2(re.purchase.currentValue), source: 'self' });
  }

  console.log(`Inserting ${txs.length} transactions...`);
  for (const t of txs) {
    await q(
      `insert into transactions (asset_id, type, date, units, unit_price, amount, currency, fx_rate, notes, metadata)
       values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
      [t.asset_id, t.type, t.date, t.units ?? null, t.unit_price ?? null,
       t.amount, t.currency ?? 'EUR', t.fx_rate ?? null, t.notes ?? null, t.metadata ?? {}]
    );
  }

  console.log(`Inserting ${vals.length} valuations...`);
  for (const v of vals) {
    await q(
      `insert into valuations (asset_id, date, value, source, notes) values ($1,$2,$3,$4,$5)`,
      [v.asset_id, v.date, v.value, v.source ?? null, v.notes ?? null]
    );
  }

  console.log(`Inserting ${scheds.length} loan_schedules...`);
  for (const s of scheds) {
    await q(
      `insert into loan_schedules (asset_id, payment_no, due_date, scheduled_principal, scheduled_interest, paid_principal, paid_interest, paid_date, status)
       values ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
      [s.asset_id, s.payment_no, s.due_date, s.scheduled_principal, s.scheduled_interest,
       s.paid_principal, s.paid_interest, s.paid_date, s.status]
    );
  }
});

await client.end();
console.log('Done.');
