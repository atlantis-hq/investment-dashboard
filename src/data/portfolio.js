// Portfolio data - from Asier's Google Sheets (real data)
// Last updated: 2026-03-02

// Annualized return: ((totalValue/totalInvested)^(1/years))-1
// Portfolio inception ~Jan 2024, so ~2.17 years to Mar 2026
const _inceptionDate = new Date(2024, 0, 1);
const _years = (new Date() - _inceptionDate) / (365.25 * 24 * 60 * 60 * 1000);
const _annualizedReturn = (Math.pow(1078524 / 1024334, 1 / _years) - 1) * 100;

export const portfolioSummary = {
  totalValue: 1078524,
  totalInvested: 1024334,
  totalReturn: 54190,
  totalReturnPct: 5.29,
  annualizedReturnPct: Math.round(_annualizedReturn * 100) / 100,
  inceptionDate: '2024-01-01',
  lastUpdated: '2026-03-02',
};

export const categoryAllocation = [
  { name: 'ETFs + Fondos', value: 175957, color: '#3b82f6', invested: 128454, return: 36.98 },
  { name: 'Fondos Monetarios', value: 71260, color: '#06b6d4', invested: 70000, return: 1.80 },
  { name: 'Criptomonedas', value: 56690, color: '#f59e0b', invested: 78000, return: -27.32 },
  { name: 'Renta Fija', value: 70174, color: '#10b981', invested: 70000, return: 0.25 },
  { name: 'Préstamos', value: 264443, color: '#8b5cf6', invested: 237880, return: 11.17 },
  { name: 'PE', value: 290000, color: '#ec4899', invested: 290000, return: 0 },
  { name: 'VC Startups', value: 150000, color: '#f43f5e', invested: 150000, return: 0 },
];

export const etfsFunds = [
  {
    name: 'Gestivalue Cap (Andbank)',
    ticker: 'Gestivalue Cap',
    invested: 128454.36,
    current: 175956.77,
    returnPct: 36.98,
    shares: 1,
    type: 'Fondo',
    status: 'Activo',
    dateEntry: '01/01/2024',
  },
];

export const monetaryFunds = [
  {
    name: 'Oro Físico (100g x5)',
    ticker: 'XAUEUR',
    invested: 70000,
    current: 71259.54,
    rate: null,
    type: 'Oro Físico',
    status: 'Hold',
    units: 5,
    unitWeight: '100g',
  },
];

export const crypto = [
  {
    name: 'Bitcoin',
    ticker: 'BTC',
    amount: 1.04,
    avgPrice: 75000,
    currentPrice: 54509.68,
    invested: 78000,
    current: 56690.07,
  },
];

export const rentaFija = [
  {
    name: 'Revolut Renta Fija',
    product: 'Cuenta Remunerada',
    capital: 70000,
    tae: 2.27,
    startDate: '20/01/2026',
    months: 1,
    interestAccrued: 174.14,
    currentValue: 70174.14,
    status: 'Activo',
  },
];

export const loans = [
  { id: 1, platform: 'Habitalia', project: 'Habitalia #1', capital: 8894, interestRate: 12.0, tir: 12.0, term: 23, startDate: '20/12/2024', endDate: '20/11/2026', status: 'Activo', cuotasPagadas: 14, cuotasRestantes: 9, capitalCobrado: 5169.59, interesTotal: 1106.12, capitalPending: 3724.41, interestEarned: 917.44 },
  { id: 2, platform: 'Habitalia', project: 'Habitalia #2', capital: 8984, interestRate: 13.0, tir: 13.0, term: 23, startDate: '20/01/2025', endDate: '20/12/2026', status: 'Activo', cuotasPagadas: 13, cuotasRestantes: 10, capitalCobrado: 4803.21, interesTotal: 1214.02, capitalPending: 4180.79, interestEarned: 960.89 },
  { id: 3, platform: 'Habitalia', project: 'Habitalia #3', capital: 7282.50, interestRate: 13.33, tir: 13.33, term: 17, startDate: '20/11/2024', endDate: '20/04/2026', status: 'Activo', cuotasPagadas: 15, cuotasRestantes: 2, capitalCobrado: 6353.06, interesTotal: 749.70, capitalPending: 929.44, interestEarned: 734.18 },
  { id: 4, platform: 'Habitalia', project: 'Habitalia #4', capital: 7765, interestRate: 13.0, tir: 13.0, term: 23, startDate: '20/12/2024', endDate: '20/11/2026', status: 'Activo', cuotasPagadas: 14, cuotasRestantes: 9, capitalCobrado: 4495.58, interesTotal: 1049.24, capitalPending: 3269.42, interestEarned: 869.61 },
  { id: 5, platform: 'Habitalia', project: 'Habitalia #5', capital: 12694, interestRate: 12.5, tir: 12.5, term: 23, startDate: '20/12/2024', endDate: '20/11/2026', status: 'Activo', cuotasPagadas: 14, cuotasRestantes: 9, capitalCobrado: 7363.77, interesTotal: 1646.96, capitalPending: 5330.23, interestEarned: 1365.51 },
  { id: 6, platform: 'Habitalia', project: 'Habitalia #6', capital: 7131, interestRate: 13.33, tir: 13.33, term: 17, startDate: '20/12/2024', endDate: '20/05/2026', status: 'Activo', cuotasPagadas: 14, cuotasRestantes: 3, capitalCobrado: 5773.32, interesTotal: 734.10, capitalPending: 1357.68, interestEarned: 703.82 },
  { id: 7, platform: 'Habitalia', project: 'Habitalia #7', capital: 4750, interestRate: 13.33, tir: 13.33, term: 17, startDate: '20/01/2025', endDate: '20/06/2026', status: 'Activo', cuotasPagadas: 13, cuotasRestantes: 4, capitalCobrado: 3550.80, interesTotal: 488.94, capitalPending: 1199.20, interestEarned: 455.44 },
  { id: 8, platform: 'Habitalia', project: 'Habitalia #8', capital: 6834, interestRate: 12.0, tir: 12.0, term: 23, startDate: '20/02/2025', endDate: '20/01/2027', status: 'Activo', cuotasPagadas: 12, cuotasRestantes: 11, capitalCobrado: 3370.32, interesTotal: 849.97, capitalPending: 3463.68, interestEarned: 638.71 },
  { id: 9, platform: 'Habitalia', project: 'Habitalia #9', capital: 5673, interestRate: 13.33, tir: 13.33, term: 17, startDate: '20/01/2025', endDate: '20/06/2026', status: 'Activo', cuotasPagadas: 13, cuotasRestantes: 4, capitalCobrado: 4240.77, interesTotal: 584.01, capitalPending: 1432.23, interestEarned: 544.00 },
  { id: 10, platform: 'Habitalia', project: 'Habitalia #10', capital: 10857, interestRate: 12.0, tir: 12.0, term: 23, startDate: '20/02/2025', endDate: '20/01/2027', status: 'Activo', cuotasPagadas: 12, cuotasRestantes: 11, capitalCobrado: 5354.34, interesTotal: 1350.33, capitalPending: 5502.66, interestEarned: 1014.70 },
  { id: 11, platform: 'Habitalia', project: 'Habitalia #11', capital: 7844, interestRate: 12.0, tir: 12.0, term: 23, startDate: '20/03/2025', endDate: '20/02/2027', status: 'Activo', cuotasPagadas: 11, cuotasRestantes: 12, capitalCobrado: 3528.12, interesTotal: 975.59, capitalPending: 4315.88, interestEarned: 689.94 },
  { id: 12, platform: 'Habitalia', project: 'Habitalia #12', capital: 7347, interestRate: 12.0, tir: 12.0, term: 23, startDate: '20/03/2025', endDate: '20/02/2027', status: 'Activo', cuotasPagadas: 11, cuotasRestantes: 12, capitalCobrado: 3304.58, interesTotal: 913.78, capitalPending: 4042.42, interestEarned: 646.23 },
  { id: 13, platform: 'Habitalia', project: 'Habitalia #13', capital: 15103, interestRate: 12.0, tir: 12.0, term: 23, startDate: '20/03/2025', endDate: '20/02/2027', status: 'Activo', cuotasPagadas: 11, cuotasRestantes: 12, capitalCobrado: 6793.12, interesTotal: 1878.43, capitalPending: 8309.88, interestEarned: 1328.43 },
  { id: 14, platform: 'Habitalia', project: 'Habitalia #14', capital: 7672, interestRate: 13.33, tir: 13.33, term: 17, startDate: '20/03/2025', endDate: '20/08/2026', status: 'Activo', cuotasPagadas: 11, cuotasRestantes: 6, capitalCobrado: 4798.27, interesTotal: 789.79, capitalPending: 2873.73, interestEarned: 677.01 },
  { id: 15, platform: 'Habitalia', project: 'Habitalia #15', capital: 10959.50, interestRate: 12.0, tir: 12.0, term: 23, startDate: '20/04/2025', endDate: '20/03/2027', status: 'Activo', cuotasPagadas: 10, cuotasRestantes: 13, capitalCobrado: 4458.67, interesTotal: 1363.08, capitalPending: 6500.83, interestEarned: 898.97 },
  { id: 16, platform: 'Habitalia', project: 'Habitalia #16', capital: 9925, interestRate: 12.0, tir: 12.0, term: 23, startDate: '20/04/2025', endDate: '20/03/2027', status: 'Activo', cuotasPagadas: 10, cuotasRestantes: 13, capitalCobrado: 4037.81, interesTotal: 1234.42, capitalPending: 5887.19, interestEarned: 814.11 },
  { id: 17, platform: 'Habitalia', project: 'Habitalia #17', capital: 9213, interestRate: 12.0, tir: 12.0, term: 23, startDate: '20/05/2025', endDate: '20/04/2027', status: 'Activo', cuotasPagadas: 9, cuotasRestantes: 14, capitalCobrado: 3356.32, interesTotal: 1145.86, capitalPending: 5856.68, interestEarned: 697.14 },
  { id: 18, platform: 'Habitalia', project: 'Habitalia #18', capital: 11353, interestRate: 10.0, tir: 10.0, term: 23, startDate: '20/08/2025', endDate: '20/07/2027', status: 'Activo', cuotasPagadas: 6, cuotasRestantes: 17, capitalCobrado: 2756.04, interesTotal: 1169.82, capitalPending: 8596.96, interestEarned: 510.79 },
  { id: 19, platform: 'Habitalia', project: 'Habitalia #19', capital: 13599, interestRate: 10.0, tir: 10.0, term: 23, startDate: '20/08/2025', endDate: '20/07/2027', status: 'Activo', cuotasPagadas: 6, cuotasRestantes: 17, capitalCobrado: 3301.27, interesTotal: 1401.26, capitalPending: 10297.73, interestEarned: 611.84 },
  { id: 20, platform: 'Habitalia', project: 'Habitalia #20', capital: 19000, interestRate: 9.0, tir: 9.0, term: 23, startDate: '20/11/2025', endDate: '20/10/2027', status: 'Activo', cuotasPagadas: 3, cuotasRestantes: 20, capitalCobrado: 2297.05, interesTotal: 1756.83, capitalPending: 16702.95, interestEarned: 410.36 },
  { id: 21, platform: 'Habitalia', project: 'Habitalia #21', capital: 45000, interestRate: 9.0, tir: 9.0, term: 23, startDate: '20/05/2025', endDate: '20/04/2027', status: 'Activo', cuotasPagadas: 9, cuotasRestantes: 14, capitalCobrado: 16693.96, interesTotal: 4160.90, capitalPending: 28306.04, interestEarned: 2542.92 },
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
  // Monetary (gold)
  events.push({ date: new Date(2024, 0, 1), amount: monetaryFunds[0]?.invested || 0, type: 'gold' });
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
    points.push({ month: label, invested: Math.round(running) });
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
