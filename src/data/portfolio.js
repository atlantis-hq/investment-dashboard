// Portfolio data - from Asier's Google Sheets (real data)
// Last updated: 2026-02-20

export const portfolioSummary = {
  totalValue: 1032528,
  totalInvested: 1024334,
  totalReturn: 8194,
  totalReturnPct: 0.80,
  lastUpdated: '2026-02-20',
};

export const categoryAllocation = [
  { name: 'ETFs + Fondos', value: 176012, color: '#3b82f6', invested: 128454, return: 37.02 },
  { name: 'Fondos Monetarios', value: 68674, color: '#06b6d4', invested: 70000, return: -1.90 },
  { name: 'Criptomonedas', value: 57089, color: '#f59e0b', invested: 78000, return: -26.81 },
  { name: 'Renta Fija', value: 70132, color: '#10b981', invested: 70000, return: 0.19 },
  { name: 'Préstamos', value: 289294, color: '#8b5cf6', invested: 237880, return: 21.61 },
  { name: 'PE', value: 290000, color: '#ec4899', invested: 290000, return: 0 },
  { name: 'VC Startups', value: 150000, color: '#f43f5e', invested: 150000, return: 0 },
];

export const etfsFunds = [
  {
    name: 'Gestivalue Cap (Andbank)',
    ticker: 'Gestivalue Cap',
    invested: 128454.36,
    current: 176011.73,
    returnPct: 37.02,
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
    current: 68673.71,
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
    currentPrice: 57089.42,
    invested: 78000,
    current: 57089.42,
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
    interestAccrued: 132.42,
    currentValue: 70132.42,
    status: 'Activo',
  },
];

export const loans = [
  { id: 1, platform: 'Habitalia', project: 'Habitalia #1', capital: 8894, interestRate: 12.0, tir: 12.0, term: 24, startDate: '20/12/2024', endDate: '20/11/2026', status: 'Activo', cuotasPagadas: 14, cuotasRestantes: 10, capitalCobrado: 5188.17, interesTotal: 2134.44, capitalPending: 3705.83, interestEarned: 1245.09 },
  { id: 2, platform: 'Habitalia', project: 'Habitalia #2', capital: 8984, interestRate: 13.0, tir: 13.0, term: 24, startDate: '20/01/2025', endDate: '20/12/2026', status: 'Activo', cuotasPagadas: 13, cuotasRestantes: 11, capitalCobrado: 4866.33, interesTotal: 2335.85, capitalPending: 4117.67, interestEarned: 1265.25 },
  { id: 3, platform: 'Habitalia', project: 'Habitalia #3', capital: 7282.50, interestRate: 13.33, tir: 13.33, term: 18, startDate: '20/11/2024', endDate: '20/04/2026', status: 'Activo', cuotasPagadas: 15, cuotasRestantes: 3, capitalCobrado: 6068.75, interesTotal: 1456.50, capitalPending: 1213.75, interestEarned: 1213.75 },
  { id: 4, platform: 'Habitalia', project: 'Habitalia #4', capital: 7765, interestRate: 13.0, tir: 13.0, term: 24, startDate: '20/12/2024', endDate: '20/11/2026', status: 'Activo', cuotasPagadas: 14, cuotasRestantes: 10, capitalCobrado: 4529.58, interesTotal: 2018.80, capitalPending: 3235.42, interestEarned: 1177.63 },
  { id: 5, platform: 'Habitalia', project: 'Habitalia #5', capital: 12694, interestRate: 12.5, tir: 12.5, term: 24, startDate: '20/12/2024', endDate: '20/11/2026', status: 'Activo', cuotasPagadas: 14, cuotasRestantes: 10, capitalCobrado: 7404.83, interesTotal: 3173.45, capitalPending: 5289.17, interestEarned: 1851.18 },
  { id: 6, platform: 'Habitalia', project: 'Habitalia #6', capital: 7131, interestRate: 13.33, tir: 13.33, term: 18, startDate: '20/12/2024', endDate: '20/05/2026', status: 'Activo', cuotasPagadas: 14, cuotasRestantes: 4, capitalCobrado: 5546.33, interesTotal: 1426.20, capitalPending: 1584.67, interestEarned: 1109.27 },
  { id: 7, platform: 'Habitalia', project: 'Habitalia #7', capital: 4750, interestRate: 13.33, tir: 13.33, term: 18, startDate: '20/01/2025', endDate: '20/06/2026', status: 'Activo', cuotasPagadas: 13, cuotasRestantes: 5, capitalCobrado: 3430.56, interesTotal: 949.90, capitalPending: 1319.44, interestEarned: 686.04 },
  { id: 8, platform: 'Habitalia', project: 'Habitalia #8', capital: 6834, interestRate: 12.0, tir: 12.0, term: 24, startDate: '20/02/2025', endDate: '20/01/2027', status: 'Activo', cuotasPagadas: 12, cuotasRestantes: 12, capitalCobrado: 3417, interesTotal: 1640.16, capitalPending: 3417, interestEarned: 820.08 },
  { id: 9, platform: 'Habitalia', project: 'Habitalia #9', capital: 5673, interestRate: 13.33, tir: 13.33, term: 18, startDate: '20/01/2025', endDate: '20/06/2026', status: 'Activo', cuotasPagadas: 13, cuotasRestantes: 5, capitalCobrado: 4097.17, interesTotal: 1134.60, capitalPending: 1575.83, interestEarned: 819.43 },
  { id: 10, platform: 'Habitalia', project: 'Habitalia #10', capital: 10857, interestRate: 12.0, tir: 12.0, term: 24, startDate: '20/02/2025', endDate: '20/01/2027', status: 'Activo', cuotasPagadas: 12, cuotasRestantes: 12, capitalCobrado: 5428.50, interesTotal: 2605.68, capitalPending: 5428.50, interestEarned: 1302.84 },
  { id: 11, platform: 'Habitalia', project: 'Habitalia #11', capital: 7844, interestRate: 12.0, tir: 12.0, term: 24, startDate: '20/03/2025', endDate: '20/02/2027', status: 'Activo', cuotasPagadas: 11, cuotasRestantes: 13, capitalCobrado: 3595.17, interesTotal: 1882.56, capitalPending: 4248.83, interestEarned: 862.84 },
  { id: 12, platform: 'Habitalia', project: 'Habitalia #12', capital: 7347, interestRate: 12.0, tir: 12.0, term: 24, startDate: '20/03/2025', endDate: '20/02/2027', status: 'Activo', cuotasPagadas: 11, cuotasRestantes: 13, capitalCobrado: 3367.38, interesTotal: 1763.28, capitalPending: 3979.62, interestEarned: 808.17 },
  { id: 13, platform: 'Habitalia', project: 'Habitalia #13', capital: 15103, interestRate: 12.0, tir: 12.0, term: 24, startDate: '20/03/2025', endDate: '20/02/2027', status: 'Activo', cuotasPagadas: 11, cuotasRestantes: 13, capitalCobrado: 6922.21, interesTotal: 3624.72, capitalPending: 8180.79, interestEarned: 1661.33 },
  { id: 14, platform: 'Habitalia', project: 'Habitalia #14', capital: 7672, interestRate: 13.33, tir: 13.33, term: 18, startDate: '20/03/2025', endDate: '20/08/2026', status: 'Activo', cuotasPagadas: 11, cuotasRestantes: 7, capitalCobrado: 4688.44, interesTotal: 1534.40, capitalPending: 2983.56, interestEarned: 937.69 },
  { id: 15, platform: 'Habitalia', project: 'Habitalia #15', capital: 10959.50, interestRate: 12.0, tir: 12.0, term: 24, startDate: '20/04/2025', endDate: '20/03/2027', status: 'Activo', cuotasPagadas: 10, cuotasRestantes: 14, capitalCobrado: 4566.46, interesTotal: 2630.28, capitalPending: 6393.04, interestEarned: 1095.95 },
  { id: 16, platform: 'Habitalia', project: 'Habitalia #16', capital: 9925, interestRate: 12.0, tir: 12.0, term: 24, startDate: '20/04/2025', endDate: '20/03/2027', status: 'Activo', cuotasPagadas: 10, cuotasRestantes: 14, capitalCobrado: 4135.42, interesTotal: 2382, capitalPending: 5789.58, interestEarned: 992.50 },
  { id: 17, platform: 'Habitalia', project: 'Habitalia #17', capital: 9213, interestRate: 12.0, tir: 12.0, term: 24, startDate: '20/05/2025', endDate: '20/04/2027', status: 'Activo', cuotasPagadas: 9, cuotasRestantes: 15, capitalCobrado: 3454.87, interesTotal: 2211.12, capitalPending: 5758.12, interestEarned: 829.17 },
  { id: 18, platform: 'Habitalia', project: 'Habitalia #18', capital: 11353, interestRate: 10.0, tir: 10.0, term: 24, startDate: '20/08/2025', endDate: '20/07/2027', status: 'Activo', cuotasPagadas: 6, cuotasRestantes: 18, capitalCobrado: 2838.25, interesTotal: 2270.60, capitalPending: 8514.75, interestEarned: 567.65 },
  { id: 19, platform: 'Habitalia', project: 'Habitalia #19', capital: 13599, interestRate: 10.0, tir: 10.0, term: 24, startDate: '20/08/2025', endDate: '20/07/2027', status: 'Activo', cuotasPagadas: 6, cuotasRestantes: 18, capitalCobrado: 3399.75, interesTotal: 2719.80, capitalPending: 10199.25, interestEarned: 679.95 },
  { id: 20, platform: 'Habitalia', project: 'Habitalia #20', capital: 19000, interestRate: 9.0, tir: 9.0, term: 24, startDate: '20/11/2025', endDate: '20/10/2027', status: 'Activo', cuotasPagadas: 1, cuotasRestantes: 23, capitalCobrado: 791.67, interesTotal: 3420, capitalPending: 18208.33, interestEarned: 142.50 },
  { id: 21, platform: 'Habitalia', project: 'Habitalia #21', capital: 45000, interestRate: 9.0, tir: 9.0, term: 24, startDate: '20/05/2025', endDate: '20/04/2027', status: 'Activo', cuotasPagadas: 7, cuotasRestantes: 17, capitalCobrado: 13125, interesTotal: 8100, capitalPending: 31875, interestEarned: 2362.50 },
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
