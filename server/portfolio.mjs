// Domain layer: queries Postgres and builds the legacy frontend payload shape.
// Imported by server/index.mjs (HTTP) and scripts/snapshot.mjs (cron). The
// caller is responsible for loading dotenv before importing this module.

import pg from 'pg';

export const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://bentor:bentor_local_dev_only@localhost:5432/bentor',
  max: 5,
});

export const round2 = (n) => Math.round(n * 100) / 100;

const fmtESDate = (iso) => {
  if (!iso) return '';
  const s = typeof iso === 'string' ? iso.slice(0, 10) : new Date(iso).toISOString().slice(0, 10);
  const [y, m, d] = s.split('-');
  return `${d}/${m}/${y}`;
};

export const CATEGORY_COLORS = {
  etf_fund: '#3b82f6', monetary: '#06b6d4', crypto: '#f59e0b',
  fixed_income: '#10b981', loan: '#8b5cf6', pe: '#ec4899',
  vc: '#f43f5e', real_estate: '#14b8a6',
};
export const CATEGORY_LABELS = {
  etf_fund: 'ETFs + Fondos', monetary: 'Fondos Monetarios',
  crypto: 'Criptomonedas', fixed_income: 'Renta Fija',
  loan: 'Préstamos', pe: 'PE', vc: 'VC Startups',
  real_estate: 'Real Estate',
};

export function computeRECalc(p) {
  const rentBrutoMes = p.income.rent;
  const rentEsperadaMes = rentBrutoMes * (1 - p.income.vacancyPct / 100);
  const mgmt = rentBrutoMes * (p.expenses.mgmtPct / 100);
  const maint = rentBrutoMes * (p.expenses.maintenancePct / 100);
  const opexMonth = p.expenses.community + p.expenses.ibiYear / 12 +
    p.expenses.insuranceYear / 12 + mgmt + maint;
  const mortgageMonth = p.financing.cash ? 0 : p.financing.monthlyPayment || 0;
  const incomeMonth = rentEsperadaMes;
  const cashflowMonth = incomeMonth - opexMonth - mortgageMonth;
  const cashflowYear = cashflowMonth * 12;
  const acqTotal = p.purchase.price + p.purchase.fees;
  const equityInvested = p.financing.cash ? acqTotal : p.financing.equity + p.purchase.fees;
  const yieldGross = (rentBrutoMes * 12 / p.purchase.price) * 100;
  const yieldNet = ((incomeMonth - opexMonth) * 12 / acqTotal) * 100;
  const cashOnCash = equityInvested > 0 ? (cashflowYear / equityInvested) * 100 : 0;
  const appreciation = p.purchase.currentValue > 0
    ? ((p.purchase.currentValue - p.purchase.price) / p.purchase.price) * 100 : 0;
  const ltv = p.purchase.currentValue > 0 && !p.financing.cash
    ? (p.financing.loan / p.purchase.currentValue) * 100 : 0;
  return {
    incomeMonth, opexMonth, mortgageMonth, cashflowMonth, cashflowYear,
    acqTotal, equityInvested, yieldGross, yieldNet, cashOnCash,
    appreciation, ltv,
  };
}

// Quotes within this many days are considered "fresh" enough to drive the
// current value of a position. Beyond that we fall back to the latest
// valuation (or invested) — avoids stale prices silently dominating the UI.
const QUOTE_FRESHNESS_DAYS = 7;

export async function buildShape() {
  const [a, t, v, s, q] = await Promise.all([
    pool.query("select * from assets where status = 'active'"),
    pool.query("select asset_id, type, date::text, amount, metadata from transactions"),
    pool.query("select asset_id, date::text, value from valuations"),
    pool.query("select asset_id, payment_no, scheduled_principal, scheduled_interest, paid_principal, paid_interest, status from loan_schedules"),
    pool.query(
      `select distinct on (asset_id) asset_id, date::text, price, source
       from quotes
       where date >= current_date - $1::int
       order by asset_id, date desc`,
      [QUOTE_FRESHNESS_DAYS],
    ),
  ]);

  const assets = a.rows;
  const transactions = t.rows;
  const valuations = v.rows;
  const schedules = s.rows;
  const quotes = q.rows;

  const txByAsset = new Map();
  for (const tx of transactions) {
    if (!txByAsset.has(tx.asset_id)) txByAsset.set(tx.asset_id, []);
    txByAsset.get(tx.asset_id).push(tx);
  }
  const valByAsset = new Map();
  for (const val of valuations) {
    const cur = valByAsset.get(val.asset_id);
    if (!cur || cur.date < val.date) valByAsset.set(val.asset_id, val);
  }
  const schedByAsset = new Map();
  for (const sc of schedules) {
    if (!schedByAsset.has(sc.asset_id)) schedByAsset.set(sc.asset_id, []);
    schedByAsset.get(sc.asset_id).push(sc);
  }

  const quoteByAsset = new Map();
  for (const qr of quotes) quoteByAsset.set(qr.asset_id, qr);

  const investedOf = (id) => (txByAsset.get(id) || [])
    .filter((x) => x.type === 'contribution' || x.type === 'buy')
    .filter((x) => !(x.metadata && x.metadata.kind === 'mortgage'))
    .reduce((sum, x) => sum + Number(x.amount), 0);

  // Liquid positions (currently crypto only) prefer a fresh market quote over
  // the stored valuation. ETF/monetary use 'manual' quote_source today so
  // they keep going through valuations.
  const unitsFor = (ast) => {
    const m = ast.metadata || {};
    if (ast.category === 'crypto') return Number(m.amount) || 0;
    if (ast.category === 'etf_fund') return Number(m.shares) || 0;
    if (ast.category === 'monetary') return Number(m.units) || 0;
    return 0;
  };
  const currentOf = (ast, fallback) => {
    const qr = quoteByAsset.get(ast.id);
    if (qr && ast.quote_source && ast.quote_source !== 'manual') {
      const units = unitsFor(ast);
      if (units > 0) return units * Number(qr.price);
    }
    const val = valByAsset.get(ast.id);
    return val ? Number(val.value) : fallback;
  };

  const etfsFunds = [], monetaryFunds = [], crypto = [], rentaFija = [];
  const loans = [], privateEquity = [], vcStartups = [], reProps = [];

  for (const ast of assets) {
    const meta = ast.metadata || {};
    const invested = investedOf(ast.id);
    const current = currentOf(ast, invested);
    const returnPct = invested ? round2(((current / invested) - 1) * 100) : 0;

    if (ast.category === 'etf_fund') {
      etfsFunds.push({
        name: ast.name, ticker: ast.ticker || '',
        invested: round2(invested), current: round2(current),
        returnPct, shares: meta.shares ?? 1,
        type: ast.subcategory || 'Fondo',
        status: ast.status === 'active' ? 'Activo' : ast.status,
        dateEntry: meta.dateEntry || '',
      });
    } else if (ast.category === 'monetary') {
      monetaryFunds.push({
        name: ast.name, ticker: ast.ticker || '',
        invested: round2(invested), current: round2(current),
        returnPct, units: meta.units, pricePerUnit: meta.pricePerUnit,
        currentPricePerUnit: meta.units ? round2(current / meta.units) : null,
        status: 'Hold',
      });
    } else if (ast.category === 'crypto') {
      crypto.push({
        name: ast.name, ticker: ast.ticker,
        amount: meta.amount, avgPrice: meta.avgPrice,
        currentPrice: meta.amount ? round2(current / meta.amount) : null,
        invested: round2(invested), current: round2(current),
      });
    } else if (ast.category === 'fixed_income') {
      rentaFija.push({
        name: ast.name, product: ast.subcategory || 'Cuenta Remunerada',
        capital: round2(invested), tae: meta.tae,
        startDate: meta.startDate ? fmtESDate(meta.startDate) : '',
        months: meta.months,
        interestAccrued: round2(current - invested),
        currentValue: round2(current),
        status: ast.status === 'active' ? 'Activo' : ast.status,
      });
    } else if (ast.category === 'loan') {
      const sch = (schedByAsset.get(ast.id) || []).sort((x, y) => x.payment_no - y.payment_no);
      const paid = sch.filter((x) => x.status === 'paid');
      const pending = sch.filter((x) => x.status !== 'paid');
      const capitalCobrado = paid.reduce((sum, x) => sum + Number(x.paid_principal), 0);
      const interestEarned = paid.reduce((sum, x) => sum + Number(x.paid_interest), 0);
      const interesTotal = sch.reduce((sum, x) => sum + Number(x.scheduled_interest), 0);
      loans.push({
        id: loans.length + 1,
        platform: meta.platform || ast.subcategory || '',
        project: ast.name,
        capital: round2(invested),
        interestRate: meta.interest_rate,
        tir: meta.tir ?? meta.interest_rate,
        term: meta.term_months,
        startDate: meta.start_date ? fmtESDate(meta.start_date) : '',
        endDate: meta.end_date ? fmtESDate(meta.end_date) : '',
        status: ast.status === 'active' ? 'Activo' : ast.status,
        cuotasPagadas: paid.length,
        cuotasRestantes: pending.length,
        capitalCobrado: round2(capitalCobrado),
        interesTotal: round2(interesTotal),
        capitalPending: round2(invested - capitalCobrado),
        interestEarned: round2(interestEarned),
      });
    } else if (ast.category === 'pe') {
      privateEquity.push({
        name: ast.name,
        participation: meta.participation_pct,
        companyValuation: meta.company_valuation,
        invested: round2(invested),
        currentValue: round2(current),
        multiple: invested ? round2(current / invested) : 0,
      });
    } else if (ast.category === 'vc') {
      vcStartups.push({
        name: ast.name,
        invested: round2(invested),
        currentValue: round2(current),
        multiple: invested ? round2(current / invested) : 0,
        status: 'Hold',
      });
    } else if (ast.category === 'real_estate') {
      const prop = {
        id: ast.id, name: ast.name, type: ast.subcategory, city: meta.city,
        purchase: meta.purchase, financing: meta.financing,
        income: meta.income, expenses: meta.expenses,
      };
      prop.calc = computeRECalc(prop);
      reProps.push(prop);
    }
  }

  const buckets = [
    ['etf_fund', etfsFunds],
    ['monetary', monetaryFunds],
    ['crypto', crypto],
    ['fixed_income', rentaFija.map((r) => ({ invested: r.capital, current: r.currentValue }))],
    ['loan', loans.map((l) => ({ invested: l.capital, current: l.capital }))],
    ['pe', privateEquity],
    ['vc', vcStartups],
    ['real_estate', reProps.map((r) => ({
      invested: r.purchase.price + r.purchase.fees,
      current: r.purchase.currentValue,
    }))],
  ];
  const categoryAllocation = buckets.map(([cat, items]) => {
    const invested = items.reduce((sum, i) => sum + (Number(i.invested) || 0), 0);
    const value = items.reduce((sum, i) => sum + (Number(i.current ?? i.currentValue) || 0), 0);
    return {
      key: cat,
      name: CATEGORY_LABELS[cat], value: round2(value),
      color: CATEGORY_COLORS[cat], invested: round2(invested),
      return: invested ? round2(((value / invested) - 1) * 100) : 0,
    };
  });

  const totalInvested = categoryAllocation.reduce((sum, c) => sum + c.invested, 0);
  const totalValue = categoryAllocation.reduce((sum, c) => sum + c.value, 0);

  const earliest = transactions.map((x) => x.date).filter(Boolean).sort()[0] || '2024-01-01';
  const years = (Date.now() - new Date(earliest).getTime()) / (365.25 * 24 * 3600 * 1000);
  const annualizedReturnPct = totalInvested && years > 0
    ? round2((Math.pow(totalValue / totalInvested, 1 / years) - 1) * 100) : 0;

  const reSummary = (() => {
    const totalEquity = reProps.reduce((sum, r) => sum + r.calc.equityInvested, 0);
    const totalLoansSum = reProps.reduce((sum, r) => sum + (r.financing?.cash ? 0 : r.financing.loan), 0);
    const totalReValue = reProps.reduce((sum, r) => sum + r.purchase.currentValue, 0);
    const rentMonth = reProps.reduce((sum, r) => sum + r.income.rent, 0);
    const cashflowMonth = reProps.reduce((sum, r) => sum + r.calc.cashflowMonth, 0);
    const avgYieldNet = reProps.length ? reProps.reduce((sum, r) => sum + r.calc.yieldNet, 0) / reProps.length : 0;
    const avgCoC = reProps.length ? reProps.reduce((sum, r) => sum + r.calc.cashOnCash, 0) / reProps.length : 0;
    const ltv = (totalLoansSum + totalEquity) > 0 ? (totalLoansSum / (totalLoansSum + totalEquity)) * 100 : 0;
    return {
      properties: reProps.length, totalValue: totalReValue,
      totalEquity, totalLoans: totalLoansSum, rentMonth, cashflowMonth,
      avgYieldNet, avgCoC, ltv,
    };
  })();

  const { computeCashflow, computeEvolutionFromDB, computeAlerts, computeReturns } = await import('./compute.mjs');
  const cashflow = computeCashflow({ loans, rentaFija });
  const evolution = await computeEvolutionFromDB();
  const alerts = computeAlerts({ loans });

  const partialShape = {
    etfsFunds, monetaryFunds, crypto, rentaFija, loans, privateEquity, vcStartups,
    realEstate: { properties: reProps, summary: reSummary },
  };
  const returns = await computeReturns(partialShape);
  const categoryAllocationWithXirr = categoryAllocation.map((c) => ({
    ...c,
    xirrPct: returns.categoryXirrPct[c.key] ?? null,
    holdYears: returns.categoryHoldYears[c.key] ?? null,
  }));

  return {
    portfolioSummary: {
      totalValue: round2(totalValue),
      totalInvested: round2(totalInvested),
      totalReturn: round2(totalValue - totalInvested),
      totalReturnPct: totalInvested ? round2(((totalValue / totalInvested) - 1) * 100) : 0,
      annualizedReturnPct,
      xirrPct: returns.portfolioXirrPct,
      holdYears: returns.portfolioHoldYears,
      netLiquidation: returns.netLiquidation,
      inceptionDate: earliest,
      lastUpdated: new Date().toISOString().slice(0, 10),
    },
    categoryAllocation: categoryAllocationWithXirr,
    etfsFunds, monetaryFunds, crypto, rentaFija, loans, privateEquity, vcStartups,
    realEstate: { properties: reProps, summary: reSummary },
    cashflow,
    evolution,
    alerts,
    loansSummary: {
      totalCapital: round2(loans.reduce((sum, l) => sum + l.capital, 0)),
      totalInterestEarned: round2(loans.reduce((sum, l) => sum + l.interestEarned, 0)),
      totalPending: round2(loans.reduce((sum, l) => sum + l.capitalPending, 0)),
      activeCount: loans.filter((l) => l.status === 'Activo').length,
      completedCount: loans.filter((l) => l.status !== 'Activo').length,
      avgTir: loans.length ? (loans.reduce((sum, l) => sum + (l.tir || 0), 0) / loans.length).toFixed(1) : '0',
    },
    peSummary: {
      totalInvested: round2(privateEquity.reduce((sum, p) => sum + p.invested, 0)),
      totalCurrentValue: round2(privateEquity.reduce((sum, p) => sum + p.currentValue, 0)),
      totalMultiple: round2(
        privateEquity.reduce((sum, p) => sum + p.invested, 0)
          ? privateEquity.reduce((sum, p) => sum + p.currentValue, 0) /
              privateEquity.reduce((sum, p) => sum + p.invested, 0)
          : 0
      ),
    },
    vcSummary: {
      totalInvested: round2(vcStartups.reduce((sum, v) => sum + v.invested, 0)),
      totalCurrentValue: round2(vcStartups.reduce((sum, v) => sum + v.currentValue, 0)),
    },
    realEstateSummary: reSummary,
    stocks: [],
    vcPe: privateEquity.map((p) => ({
      name: p.name, invested: p.invested, valuation: p.currentValue,
      status: 'Activo', vintage: 2024,
    })),
    vcPeFunds: vcStartups.map((v) => ({
      name: v.name, committed: v.invested, called: v.invested,
      nav: v.currentValue, dpi: 0, tvpi: v.multiple, vintage: 2024,
    })),
  };
}
