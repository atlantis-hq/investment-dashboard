// Portfolio data - from Asier's Google Sheets (real data)
// Last updated: 2026-04-07

// Annualized return: ((totalValue/totalInvested)^(1/years))-1
// Portfolio inception ~Jan 2024, so ~2.25 years to Apr 2026
const _inceptionDate = new Date(2024, 0, 1);
const _years = (new Date() - _inceptionDate) / (365.25 * 24 * 60 * 60 * 1000);
const _annualizedReturn = (Math.pow(1074534 / 1024334, 1 / _years) - 1) * 100;

export const portfolioSummary = {
  totalValue: 2539334,
  totalInvested: 2489334,
  totalReturn: 50000,
  totalReturnPct: 2.01,
  annualizedReturnPct: Math.round(_annualizedReturn * 100) / 100,
  inceptionDate: '2024-01-01',
  lastUpdated: '2026-04-07',
};

export const categoryAllocation = [
  { name: 'ETFs + Fondos', value: 175782, color: '#3b82f6', invested: 128454, return: 36.84 },
  { name: 'Fondos Monetarios', value: 64361, color: '#06b6d4', invested: 70000, return: -8.06 },
  { name: 'Criptomonedas', value: 59617, color: '#f59e0b', invested: 78000, return: -23.57 },
  { name: 'Renta Fija', value: 70331, color: '#10b981', invested: 70000, return: 0.47 },
  { name: 'Préstamos', value: 264443, color: '#8b5cf6', invested: 237880, return: 11.17 },
  { name: 'PE', value: 290000, color: '#ec4899', invested: 290000, return: 0 },
  { name: 'VC Startups', value: 150000, color: '#f43f5e', invested: 150000, return: 0 },
  { name: 'Real Estate', value: 1465000, color: '#14b8a6', invested: 1465000, return: 0 },
];

export const etfsFunds = [
  {
    name: 'Gestivalue Cap (Andbank)',
    ticker: 'Gestivalue Cap',
    invested: 128454.36,
    current: 175781.91,
    returnPct: 36.84,
    shares: 1,
    type: 'Fondo',
    status: 'Activo',
    dateEntry: '01/01/2024',
  },
];

export const monetaryFunds = [
  {
    name: 'Oro Físico (100g)',
    ticker: 'XAUEUR',
    invested: 70000,
    current: 64360.92,
    returnPct: -8.06,
    units: 5,
    pricePerUnit: 14000,
    currentPricePerUnit: 12872.18,
    status: 'Hold',
  },
];

export const crypto = [
  {
    name: 'Bitcoin',
    ticker: 'BTC',
    amount: 1.04,
    avgPrice: 75000,
    currentPrice: 59616.74,
    invested: 78000,
    current: 59616.74,
  },
];

export const rentaFija = [
  {
    name: 'Revolut Renta Fija',
    product: 'Cuenta Remunerada',
    capital: 70000,
    tae: 2.27,
    startDate: '20/01/2026',
    months: 2,
    interestAccrued: 330.86,
    currentValue: 70330.86,
    status: 'Activo',
  },
];

export const loans = [
  { id: 1, platform: 'Habitalia', project: 'Habitalia #1', capital: 8894, interestRate: 12.0, tir: 12.0, term: 23, startDate: '20/12/2024', endDate: '20/11/2026', status: 'Activo', cuotasPagadas: 15, cuotasRestantes: 8, capitalCobrado: 5567.14, interesTotal: 1106.12, capitalPending: 3326.86, interestEarned: 954.68 },
  { id: 2, platform: 'Habitalia', project: 'Habitalia #2', capital: 8984, interestRate: 13.0, tir: 13.0, term: 23, startDate: '20/01/2025', endDate: '20/12/2026', status: 'Activo', cuotasPagadas: 14, cuotasRestantes: 9, capitalCobrado: 5201.31, interesTotal: 1214.02, capitalPending: 3782.69, interestEarned: 1006.18 },
  { id: 3, platform: 'Habitalia', project: 'Habitalia #3', capital: 7282.5, interestRate: 13.33, tir: 13.33, term: 17, startDate: '20/11/2024', endDate: '20/04/2026', status: 'Activo', cuotasPagadas: 16, cuotasRestantes: 1, capitalCobrado: 6815.21, interesTotal: 749.70, capitalPending: 467.29, interestEarned: 744.50 },
  { id: 4, platform: 'Habitalia', project: 'Habitalia #4', capital: 7765, interestRate: 13.0, tir: 13.0, term: 23, startDate: '20/12/2024', endDate: '20/11/2026', status: 'Activo', cuotasPagadas: 15, cuotasRestantes: 8, capitalCobrado: 4843.39, interesTotal: 1049.24, capitalPending: 2921.61, interestEarned: 905.03 },
  { id: 5, platform: 'Habitalia', project: 'Habitalia #5', capital: 12694, interestRate: 12.5, tir: 12.5, term: 23, startDate: '20/12/2024', endDate: '20/11/2026', status: 'Activo', cuotasPagadas: 15, cuotasRestantes: 8, capitalCobrado: 7931.77, interesTotal: 1646.96, capitalPending: 4762.23, interestEarned: 1421.03 },
  { id: 6, platform: 'Habitalia', project: 'Habitalia #6', capital: 7131, interestRate: 13.33, tir: 13.33, term: 17, startDate: '20/12/2024', endDate: '20/05/2026', status: 'Activo', cuotasPagadas: 15, cuotasRestantes: 2, capitalCobrado: 6220.89, interesTotal: 734.10, capitalPending: 910.11, interestEarned: 718.90 },
  { id: 7, platform: 'Habitalia', project: 'Habitalia #7', capital: 4750, interestRate: 13.33, tir: 13.33, term: 17, startDate: '20/01/2025', endDate: '20/06/2026', status: 'Activo', cuotasPagadas: 14, cuotasRestantes: 3, capitalCobrado: 3845.65, interesTotal: 488.94, capitalPending: 904.35, interestEarned: 468.77 },
  { id: 8, platform: 'Habitalia', project: 'Habitalia #8', capital: 6834, interestRate: 12.0, tir: 12.0, term: 23, startDate: '20/02/2025', endDate: '20/01/2027', status: 'Activo', cuotasPagadas: 13, cuotasRestantes: 10, capitalCobrado: 3669.77, interesTotal: 849.97, capitalPending: 3164.23, interestEarned: 673.34 },
  { id: 9, platform: 'Habitalia', project: 'Habitalia #9', capital: 5673, interestRate: 13.33, tir: 13.33, term: 17, startDate: '20/01/2025', endDate: '20/06/2026', status: 'Activo', cuotasPagadas: 14, cuotasRestantes: 3, capitalCobrado: 4592.91, interesTotal: 584.01, capitalPending: 1080.09, interestEarned: 559.92 },
  { id: 10, platform: 'Habitalia', project: 'Habitalia #10', capital: 10857, interestRate: 12.0, tir: 12.0, term: 23, startDate: '20/02/2025', endDate: '20/01/2027', status: 'Activo', cuotasPagadas: 13, cuotasRestantes: 10, capitalCobrado: 5830.07, interesTotal: 1350.33, capitalPending: 5026.93, interestEarned: 1069.73 },
  { id: 11, platform: 'Habitalia', project: 'Habitalia #11', capital: 7844, interestRate: 12.0, tir: 12.0, term: 23, startDate: '20/03/2025', endDate: '20/02/2027', status: 'Activo', cuotasPagadas: 12, cuotasRestantes: 11, capitalCobrado: 3868.42, interesTotal: 975.59, capitalPending: 3975.58, interestEarned: 733.10 },
  { id: 12, platform: 'Habitalia', project: 'Habitalia #12', capital: 7347, interestRate: 12.0, tir: 12.0, term: 23, startDate: '20/03/2025', endDate: '20/02/2027', status: 'Activo', cuotasPagadas: 12, cuotasRestantes: 11, capitalCobrado: 3623.32, interesTotal: 913.78, capitalPending: 3723.68, interestEarned: 686.65 },
  { id: 13, platform: 'Habitalia', project: 'Habitalia #13', capital: 15103, interestRate: 12.0, tir: 12.0, term: 23, startDate: '20/03/2025', endDate: '20/02/2027', status: 'Activo', cuotasPagadas: 12, cuotasRestantes: 11, capitalCobrado: 7448.34, interesTotal: 1878.43, capitalPending: 7654.66, interestEarned: 1411.53 },
  { id: 14, platform: 'Habitalia', project: 'Habitalia #14', capital: 7672, interestRate: 13.33, tir: 13.33, term: 17, startDate: '20/03/2025', endDate: '20/08/2026', status: 'Activo', cuotasPagadas: 12, cuotasRestantes: 5, capitalCobrado: 5264.09, interesTotal: 789.79, capitalPending: 2407.91, interestEarned: 708.94 },
  { id: 15, platform: 'Habitalia', project: 'Habitalia #15', capital: 10959.5, interestRate: 12.0, tir: 12.0, term: 23, startDate: '20/04/2025', endDate: '20/03/2027', status: 'Activo', cuotasPagadas: 11, cuotasRestantes: 12, capitalCobrado: 4929.43, interesTotal: 1363.08, capitalPending: 6030.07, interestEarned: 963.98 },
  { id: 16, platform: 'Habitalia', project: 'Habitalia #16', capital: 9925, interestRate: 12.0, tir: 12.0, term: 23, startDate: '20/04/2025', endDate: '20/03/2027', status: 'Activo', cuotasPagadas: 11, cuotasRestantes: 12, capitalCobrado: 4464.13, interesTotal: 1234.42, capitalPending: 5460.87, interestEarned: 872.98 },
  { id: 17, platform: 'Habitalia', project: 'Habitalia #17', capital: 9213, interestRate: 12.0, tir: 12.0, term: 23, startDate: '20/05/2025', endDate: '20/04/2027', status: 'Activo', cuotasPagadas: 10, cuotasRestantes: 13, capitalCobrado: 3748.14, interesTotal: 1145.86, capitalPending: 5464.86, interestEarned: 755.71 },
  { id: 18, platform: 'Habitalia', project: 'Habitalia #18', capital: 11353, interestRate: 10.0, tir: 10.0, term: 23, startDate: '20/08/2025', endDate: '20/07/2027', status: 'Activo', cuotasPagadas: 7, cuotasRestantes: 16, capitalCobrado: 3228.86, interesTotal: 1169.82, capitalPending: 8124.14, interestEarned: 582.43 },
  { id: 19, platform: 'Habitalia', project: 'Habitalia #19', capital: 13599, interestRate: 10.0, tir: 10.0, term: 23, startDate: '20/08/2025', endDate: '20/07/2027', status: 'Activo', cuotasPagadas: 7, cuotasRestantes: 16, capitalCobrado: 3867.64, interesTotal: 1401.26, capitalPending: 9731.36, interestEarned: 697.65 },
  { id: 20, platform: 'Habitalia', project: 'Habitalia #20', capital: 19000, interestRate: 9.0, tir: 9.0, term: 23, startDate: '20/11/2025', endDate: '20/10/2027', status: 'Activo', cuotasPagadas: 4, cuotasRestantes: 19, capitalCobrado: 3074.25, interesTotal: 1756.83, capitalPending: 15925.75, interestEarned: 535.63 },
  { id: 21, platform: 'Habitalia', project: 'Habitalia #21', capital: 45000, interestRate: 9.0, tir: 9.0, term: 23, startDate: '20/05/2025', endDate: '20/04/2027', status: 'Activo', cuotasPagadas: 10, cuotasRestantes: 13, capitalCobrado: 18619.09, interesTotal: 4160.90, capitalPending: 26380.91, interestEarned: 2755.21 },
];

export const privateEquity = [
  {
    name: 'Rebel Tickets',
    participation: 3.38,
    companyValuation: 2000000,
    invested: 75000,
    currentValue: 67600,
    multiple: 0.90,
  },
  {
    name: 'Habitalia',
    participation: 35,
    companyValuation: 2000000,
    invested: 180000,
    currentValue: 700000,
    multiple: 3.89,
  },
  {
    name: 'FutureChat',
    participation: 10,
    companyValuation: 500000,
    invested: 35000,
    currentValue: 50000,
    multiple: 1.43,
  },
];

export const vcStartups = [
  {
    name: 'Coben Ventures',
    invested: 50000,
    currentValue: 50000,
    multiple: 1.0,
    status: 'Hold',
  },
  {
    name: 'Enzo Ventures',
    invested: 100000,
    currentValue: 150000,
    multiple: 1.5,
    status: 'Hold',
  },
];

// Legacy exports for backward compat
export const stocks = [];
export const vcPe = privateEquity.map(p => ({
  name: p.name,
  invested: p.invested,
  valuation: p.currentValue,
  status: 'Activo',
  vintage: 2024,
}));
export const vcPeFunds = vcStartups.map(v => ({
  name: v.name,
  committed: v.invested,
  called: v.invested,
  nav: v.currentValue,
  dpi: 0,
  tvpi: v.multiple,
  vintage: 2024,
}));


// --- Real Estate (datos ficticios — reemplazar con reales) ---
// Nested shape (matches Claude Design v2 bundle):
//   purchase:  { price, fees, date, currentValue }
//   financing: { cash, equity, loan, tin, years, monthlyPayment }
//   income:    { rent, vacancyPct }              // vacancyPct en %, ej. 4 = 4%
//   expenses:  { community, ibiYear, insuranceYear, mgmtPct, maintenancePct }
//                                                 // mgmtPct / maintenancePct sobre renta bruta
const _properties = [
  {
    id: 'piso-gijon',
    name: 'Piso Gijón',
    type: 'Residencial',
    city: 'Gijón',
    purchase: { price: 95000, fees: 9500, date: '15/06/2024', currentValue: 102000 },
    financing: { cash: false, equity: 47500, loan: 47500, tin: 3.5, years: 25, monthlyPayment: 237.88 },
    income: { rent: 550, vacancyPct: 4 },
    expenses: { community: 40, ibiYear: 250, insuranceYear: 180, mgmtPct: 0, maintenancePct: 5 },
  },
  {
    id: 'piso-vitoria',
    name: 'Piso Vitoria',
    type: 'Residencial',
    city: 'Vitoria',
    purchase: { price: 170000, fees: 17000, date: '10/03/2025', currentValue: 178000 },
    financing: { cash: false, equity: 68000, loan: 102000, tin: 3.2, years: 30, monthlyPayment: 441.05 },
    income: { rent: 850, vacancyPct: 4 },
    expenses: { community: 80, ibiYear: 400, insuranceYear: 220, mgmtPct: 0, maintenancePct: 5 },
  },
  {
    id: 'pabellon-industrial',
    name: 'Pabellón Industrial',
    type: 'Industrial',
    city: 'Álava',
    purchase: { price: 1200000, fees: 120000, date: '01/10/2024', currentValue: 1250000 },
    financing: { cash: false, equity: 360000, loan: 840000, tin: 4.2, years: 20, monthlyPayment: 5176.29 },
    income: { rent: 8500, vacancyPct: 2 },
    expenses: { community: 200, ibiYear: 2000, insuranceYear: 400, mgmtPct: 0, maintenancePct: 5 },
  },
];

// Compute per-property metrics (calc block).
function _calc(p) {
  const rentBrutoMes = p.income.rent;
  const rentEsperadaMes = rentBrutoMes * (1 - p.income.vacancyPct / 100);

  const mgmt = rentBrutoMes * (p.expenses.mgmtPct / 100);
  const maint = rentBrutoMes * (p.expenses.maintenancePct / 100);
  const opexMonth =
    p.expenses.community +
    p.expenses.ibiYear / 12 +
    p.expenses.insuranceYear / 12 +
    mgmt +
    maint;

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
    ? ((p.purchase.currentValue - p.purchase.price) / p.purchase.price) * 100
    : 0;

  const ltv = p.purchase.currentValue > 0 && !p.financing.cash
    ? (p.financing.loan / p.purchase.currentValue) * 100
    : 0;

  return {
    incomeMonth, opexMonth, mortgageMonth, cashflowMonth, cashflowYear,
    acqTotal, equityInvested,
    yieldGross, yieldNet, cashOnCash,
    appreciation, ltv,
  };
}

const _propsWithCalc = _properties.map(p => ({ ...p, calc: _calc(p) }));

const _totalEquity = _propsWithCalc.reduce((s, p) => s + p.calc.equityInvested, 0);
const _totalLoans = _propsWithCalc.reduce((s, p) => s + (p.financing.cash ? 0 : p.financing.loan), 0);
const _totalValue = _propsWithCalc.reduce((s, p) => s + p.purchase.currentValue, 0);
const _rentMonth = _propsWithCalc.reduce((s, p) => s + p.income.rent, 0);
const _cashflowMonth = _propsWithCalc.reduce((s, p) => s + p.calc.cashflowMonth, 0);
const _avgYieldNet = _propsWithCalc.length > 0
  ? _propsWithCalc.reduce((s, p) => s + p.calc.yieldNet, 0) / _propsWithCalc.length
  : 0;
const _avgCoC = _propsWithCalc.length > 0
  ? _propsWithCalc.reduce((s, p) => s + p.calc.cashOnCash, 0) / _propsWithCalc.length
  : 0;
const _ltv = (_totalLoans + _totalEquity) > 0
  ? (_totalLoans / (_totalLoans + _totalEquity)) * 100
  : 0;

export const realEstate = {
  properties: _propsWithCalc,
  summary: {
    properties: _propsWithCalc.length,
    totalValue: _totalValue,
    totalEquity: _totalEquity,
    totalLoans: _totalLoans,
    rentMonth: _rentMonth,
    cashflowMonth: _cashflowMonth,
    avgYieldNet: _avgYieldNet,
    avgCoC: _avgCoC,
    ltv: _ltv,
  },
};

// Legacy flat export + metrics function (kept for backward compat with older callers)
export const realEstateSummary = realEstate.summary;
export function computeRealEstateMetrics(p) { return p.calc || _calc(p); }

// Computed totals
export const loansSummary = {
  totalCapital: loans.reduce((s, l) => s + l.capital, 0),
  totalInterestEarned: loans.reduce((s, l) => s + l.interestEarned, 0),
  totalPending: loans.reduce((s, l) => s + l.capitalPending, 0),
  activeCount: loans.filter(l => l.status === 'Activo').length,
  completedCount: loans.filter(l => l.status !== 'Activo').length,
  avgTir: (loans.reduce((s, l) => s + l.tir, 0) / loans.length).toFixed(1),
};

export const peSummary = {
  totalInvested: privateEquity.reduce((s, p) => s + p.invested, 0),
  totalCurrentValue: privateEquity.reduce((s, p) => s + p.currentValue, 0),
  totalMultiple: 2.82,
};

export const vcSummary = {
  totalInvested: vcStartups.reduce((s, v) => s + v.invested, 0),
  totalCurrentValue: vcStartups.reduce((s, v) => s + v.currentValue, 0),
};

// --- Computed: Cashflow Proyectado (próximos 12 meses) ---
export function computeCashflow() {
  const now = new Date();
  const months = [];
  for (let i = 0; i < 12; i++) {
    const m = new Date(now.getFullYear(), now.getMonth() + i, 1);
    const label = m.toLocaleDateString('es-ES', { month: 'short', year: '2-digit' });
    let income = 0;
    let principal = 0;
    loans.forEach(l => {
      const [ds, ms, ys] = l.startDate.split('/');
      const [de, me, ye] = l.endDate.split('/');
      const start = new Date(ys, ms - 1, ds);
      const end = new Date(ye, me - 1, de);
      // Check if this month falls within the loan period
      const mStart = new Date(m.getFullYear(), m.getMonth(), 20);
      if (mStart >= start && mStart <= end) {
        const r = l.interestRate / 100 / 12;
        const n = l.cuotasPagadas + l.cuotasRestantes;
        const cuota = l.capital * (r / (1 - Math.pow(1 + r, -n)));
        const monthsElapsed = (m.getFullYear() - start.getFullYear()) * 12 + m.getMonth() - start.getMonth();
        // Interest portion for this month
        const outstanding = l.capital * Math.pow(1 + r, monthsElapsed) - cuota * (Math.pow(1 + r, monthsElapsed) - 1) / r;
        const interestPortion = Math.max(0, outstanding * r);
        const principalPortion = cuota - interestPortion;
        income += interestPortion;
        principal += Math.max(0, principalPortion);
      }
    });
    // Renta fija monthly interest
    if (rentaFija.length > 0) {
      income += rentaFija[0].capital * (rentaFija[0].tae / 100) / 12;
    }
    months.push({ month: label, income: Math.round(income), principal: Math.round(principal), total: Math.round(income + principal) });
  }
  return months;
}

// --- Computed: Portfolio Evolution (retroactive from entry dates) ---
export function computeEvolution() {
  // Build monthly snapshots of total invested capital
  const events = [];
  // ETFs
  etfsFunds.forEach(f => {
    const [d, m, y] = f.dateEntry.split('/');
    events.push({ date: new Date(y, m - 1, d), amount: f.invested, type: 'etf' });
  });
  // Loans
  loans.forEach(l => {
    const [d, m, y] = l.startDate.split('/');
    events.push({ date: new Date(y, m - 1, d), amount: l.capital, type: 'loan' });
  });
  // Crypto
  events.push({ date: new Date(2024, 5, 1), amount: crypto[0]?.invested || 0, type: 'crypto' });
  // Renta fija
  if (rentaFija.length > 0) {
    const [d, m, y] = rentaFija[0].startDate.split('/');
    events.push({ date: new Date(y, m - 1, d), amount: rentaFija[0].capital, type: 'rentafija' });
  }
  // PE
  privateEquity.forEach(p => {
    events.push({ date: new Date(2024, 0, 1), amount: p.invested, type: 'pe' });
  });
  // VC
  vcStartups.forEach(v => {
    events.push({ date: new Date(2024, 0, 1), amount: v.invested, type: 'vc' });
  });

  events.sort((a, b) => a.date - b.date);

  // Generate monthly snapshots
  const earliest = events[0]?.date || new Date();
  const now = new Date();
  const points = [];
  let running = 0;
  let eventIdx = 0;

  for (let d = new Date(earliest.getFullYear(), earliest.getMonth(), 1); d <= now; d = new Date(d.getFullYear(), d.getMonth() + 1, 1)) {
    const monthEnd = new Date(d.getFullYear(), d.getMonth() + 1, 0);
    // Add all events up to end of this month
    while (eventIdx < events.length && events[eventIdx].date <= monthEnd) {
      running += events[eventIdx].amount;
      eventIdx++;
    }
    const label = d.toLocaleDateString('es-ES', { month: 'short', year: '2-digit' });
    // Fallback has no historical valuation data — value defaults to invested
    // (i.e. flat unrealized return). The live API ships proper history.
    points.push({ month: label, invested: Math.round(running), value: Math.round(running) });
  }

  return points;
}

// --- Computed: Loan Alerts (vencimientos < 30 y < 60 días) ---
export function computeAlerts() {
  const now = new Date();
  const alerts = [];
  loans.forEach(l => {
    const [d, m, y] = l.endDate.split('/');
    const end = new Date(y, m - 1, d);
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
  });
  alerts.sort((a, b) => a.daysLeft - b.daysLeft);
  return alerts;
}
