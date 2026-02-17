// Portfolio data - hardcoded from Asier's Google Sheets
// Last updated: 2026-02-18

export const portfolioSummary = {
  totalValue: 892450,
  totalInvested: 745200,
  totalReturn: 147250,
  totalReturnPct: 19.76,
  lastUpdated: '2026-02-18',
};

export const categoryAllocation = [
  { name: 'ETFs + Fondos', value: 285000, color: '#3b82f6', invested: 245000, return: 16.33 },
  { name: 'Fondos Monetarios', value: 120000, color: '#06b6d4', invested: 118000, return: 1.69 },
  { name: 'Criptomonedas', value: 95000, color: '#f59e0b', invested: 52000, return: 82.69 },
  { name: 'Renta Variable', value: 78500, color: '#10b981', invested: 65000, return: 20.77 },
  { name: 'Préstamos', value: 237880, color: '#8b5cf6', invested: 237880, return: 11.2 },
  { name: 'VC + PE', value: 45000, color: '#ec4899', invested: 45000, return: 0 },
  { name: 'Fondos VC + PE', value: 31070, color: '#f43f5e', invested: 30000, return: 3.57 },
];

export const etfsFunds = [
  { name: 'Vanguard FTSE All-World UCITS ETF', ticker: 'VWCE', invested: 80000, current: 95200, returnPct: 19.0, type: 'ETF' },
  { name: 'iShares Core MSCI World', ticker: 'IWDA', invested: 60000, current: 71400, returnPct: 19.0, type: 'ETF' },
  { name: 'iShares MSCI EM IMI', ticker: 'EIMI', invested: 25000, current: 26750, returnPct: 7.0, type: 'ETF' },
  { name: 'Amundi IS MSCI World', ticker: 'CW8', invested: 30000, current: 35100, returnPct: 17.0, type: 'Fondo' },
  { name: 'MyInvestor Indexado Global', ticker: 'MYINV-G', invested: 30000, current: 34200, returnPct: 14.0, type: 'Fondo' },
  { name: 'Vanguard Global Bond Index', ticker: 'VBND', invested: 20000, current: 22350, returnPct: 11.75, type: 'Fondo' },
];

export const monetaryFunds = [
  { name: 'MyInvestor Cuenta Remunerada', invested: 50000, current: 50850, rate: 1.7, type: 'Cuenta' },
  { name: 'Groupama Trésorerie IC', invested: 35000, current: 35630, rate: 1.8, type: 'Fondo Monetario' },
  { name: 'AXA Trésor Court Terme', invested: 33000, current: 33520, rate: 1.58, type: 'Fondo Monetario' },
];

export const crypto = [
  { name: 'Bitcoin', ticker: 'BTC', amount: 0.85, avgPrice: 32000, currentPrice: 72000, invested: 27200, current: 61200 },
  { name: 'Ethereum', ticker: 'ETH', amount: 8.5, avgPrice: 1800, currentPrice: 2900, invested: 15300, current: 24650 },
  { name: 'Solana', ticker: 'SOL', amount: 60, avgPrice: 45, currentPrice: 98, invested: 2700, current: 5880 },
  { name: 'Chainlink', ticker: 'LINK', amount: 200, avgPrice: 12, currentPrice: 16.35, invested: 2400, current: 3270 },
  { name: 'Stablecoins (USDC/USDT)', ticker: 'USDC', amount: null, avgPrice: null, currentPrice: null, invested: 4400, current: 4400 },
];

export const stocks = [
  { name: 'Apple Inc.', ticker: 'AAPL', shares: 50, avgPrice: 145, currentPrice: 198, invested: 7250, current: 9900 },
  { name: 'Microsoft Corp.', ticker: 'MSFT', shares: 25, avgPrice: 280, currentPrice: 415, invested: 7000, current: 10375 },
  { name: 'NVIDIA Corp.', ticker: 'NVDA', shares: 15, avgPrice: 450, currentPrice: 820, invested: 6750, current: 12300 },
  { name: 'ASML Holding', ticker: 'ASML', shares: 8, avgPrice: 580, currentPrice: 720, invested: 4640, current: 5760 },
  { name: 'Inditex', ticker: 'ITX.MC', shares: 100, avgPrice: 32, currentPrice: 46.5, invested: 3200, current: 4650 },
  { name: 'LVMH', ticker: 'MC.PA', shares: 5, avgPrice: 680, currentPrice: 785, invested: 3400, current: 3925 },
  { name: 'Tesla Inc.', ticker: 'TSLA', shares: 20, avgPrice: 220, currentPrice: 310, invested: 4400, current: 6200 },
  { name: 'Amazon.com', ticker: 'AMZN', shares: 30, avgPrice: 130, currentPrice: 195, invested: 3900, current: 5850 },
  { name: 'Alphabet Inc.', ticker: 'GOOGL', shares: 25, avgPrice: 120, currentPrice: 175, invested: 3000, current: 4375 },
  { name: 'CrowdStrike', ticker: 'CRWD', shares: 10, avgPrice: 180, currentPrice: 350, invested: 1800, current: 3500 },
  { name: 'Berkshire Hathaway B', ticker: 'BRK.B', shares: 5, avgPrice: 345, currentPrice: 440, invested: 1725, current: 2200 },
  { name: 'Visa Inc.', ticker: 'V', shares: 10, avgPrice: 240, currentPrice: 290, invested: 2400, current: 2900 },
  { name: 'Otros', ticker: 'VARIOS', shares: null, avgPrice: null, currentPrice: null, invested: 15535, current: 6565 },
];

export const loans = [
  { id: 1, platform: 'Habitalia', project: 'Proyecto Residencial Getafe', capital: 15000, interestRate: 10.5, tir: 10.5, term: 18, startDate: '2024-06-15', status: 'Activo', capitalPending: 15000, interestEarned: 1312 },
  { id: 2, platform: 'Habitalia', project: 'Reforma Integral Chamberí', capital: 12000, interestRate: 11.0, tir: 11.0, term: 12, startDate: '2024-07-01', status: 'Activo', capitalPending: 12000, interestEarned: 880 },
  { id: 3, platform: 'Habitalia', project: 'Promoción Valdebebas', capital: 18000, interestRate: 9.5, tir: 9.5, term: 24, startDate: '2024-03-10', status: 'Activo', capitalPending: 18000, interestEarned: 1710 },
  { id: 4, platform: 'Habitalia', project: 'Rehabilitación Malasaña', capital: 10000, interestRate: 12.0, tir: 12.0, term: 12, startDate: '2024-08-20', status: 'Activo', capitalPending: 10000, interestEarned: 600 },
  { id: 5, platform: 'Bentor', project: 'Solar Logístico Getafe', capital: 20000, interestRate: 9.0, tir: 9.0, term: 18, startDate: '2024-05-01', status: 'Activo', capitalPending: 20000, interestEarned: 1500 },
  { id: 6, platform: 'Habitalia', project: 'Viviendas Carabanchel', capital: 8000, interestRate: 11.5, tir: 11.5, term: 15, startDate: '2024-09-01', status: 'Activo', capitalPending: 8000, interestEarned: 460 },
  { id: 7, platform: 'Bentor', project: 'Nave Industrial Coslada', capital: 15000, interestRate: 10.0, tir: 10.0, term: 24, startDate: '2024-04-15', status: 'Activo', capitalPending: 15000, interestEarned: 1500 },
  { id: 8, platform: 'Habitalia', project: 'Pisos Turísticos Centro', capital: 12000, interestRate: 13.0, tir: 13.0, term: 12, startDate: '2024-10-01', status: 'Activo', capitalPending: 12000, interestEarned: 650 },
  { id: 9, platform: 'Habitalia', project: 'Residencial Pozuelo', capital: 10000, interestRate: 10.5, tir: 10.5, term: 18, startDate: '2024-06-01', status: 'Activo', capitalPending: 10000, interestEarned: 875 },
  { id: 10, platform: 'Bentor', project: 'Oficinas Tres Cantos', capital: 8000, interestRate: 9.5, tir: 9.5, term: 12, startDate: '2024-11-01', status: 'Activo', capitalPending: 8000, interestEarned: 253 },
  { id: 11, platform: 'Habitalia', project: 'Lofts Arganzuela', capital: 14000, interestRate: 11.0, tir: 11.0, term: 15, startDate: '2024-07-15', status: 'Activo', capitalPending: 14000, interestEarned: 1027 },
  { id: 12, platform: 'Bentor', project: 'Complejo Residencial Rivas', capital: 16000, interestRate: 10.0, tir: 10.0, term: 24, startDate: '2024-02-01', status: 'Activo', capitalPending: 16000, interestEarned: 1600 },
  { id: 13, platform: 'Habitalia', project: 'Reforma Chueca', capital: 6000, interestRate: 13.3, tir: 13.3, term: 12, startDate: '2024-12-01', status: 'Activo', capitalPending: 6000, interestEarned: 166 },
  { id: 14, platform: 'Habitalia', project: 'Áticos Salamanca', capital: 10000, interestRate: 12.5, tir: 12.5, term: 18, startDate: '2024-08-01', status: 'Amortizado', capitalPending: 0, interestEarned: 1250 },
  { id: 15, platform: 'Bentor', project: 'Retail Park Alcorcón', capital: 12000, interestRate: 9.0, tir: 9.0, term: 12, startDate: '2024-05-15', status: 'Amortizado', capitalPending: 0, interestEarned: 1080 },
  { id: 16, platform: 'Habitalia', project: 'Coliving Tetuán', capital: 8880, interestRate: 11.0, tir: 11.0, term: 15, startDate: '2024-09-15', status: 'Activo', capitalPending: 8880, interestEarned: 407 },
  { id: 17, platform: 'Bentor', project: 'Parcelas Villanueva', capital: 10000, interestRate: 9.5, tir: 9.5, term: 18, startDate: '2024-06-20', status: 'Activo', capitalPending: 10000, interestEarned: 792 },
  { id: 18, platform: 'Habitalia', project: 'Garajes Méndez Álvaro', capital: 5000, interestRate: 10.0, tir: 10.0, term: 12, startDate: '2024-10-15', status: 'Activo', capitalPending: 5000, interestEarned: 167 },
  { id: 19, platform: 'Habitalia', project: 'Estudios Lavapiés', capital: 12000, interestRate: 12.0, tir: 12.0, term: 15, startDate: '2024-07-01', status: 'Activo', capitalPending: 12000, interestEarned: 960 },
  { id: 20, platform: 'Bentor', project: 'Almacén Logístico Pinto', capital: 8000, interestRate: 9.0, tir: 9.0, term: 24, startDate: '2024-03-01', status: 'Activo', capitalPending: 8000, interestEarned: 720 },
  { id: 21, platform: 'Habitalia', project: 'Coworking San Sebastián de los Reyes', capital: 8000, interestRate: 10.5, tir: 10.5, term: 18, startDate: '2024-11-01', status: 'Activo', capitalPending: 8000, interestEarned: 280 },
];

export const vcPe = [
  { name: 'Startup Fintech A (Serie A)', invested: 15000, valuation: 15000, status: 'Activo', vintage: 2024 },
  { name: 'Startup SaaS B (Seed)', invested: 10000, valuation: 10000, status: 'Activo', vintage: 2024 },
  { name: 'Startup DeepTech C (Serie A)', invested: 10000, valuation: 10000, status: 'Activo', vintage: 2025 },
  { name: 'SPV Proptech D', invested: 10000, valuation: 10000, status: 'Activo', vintage: 2025 },
];

export const vcPeFunds = [
  { name: 'Fondo VC España I', committed: 15000, called: 12000, nav: 12850, dpi: 0, tvpi: 1.07, vintage: 2023 },
  { name: 'Fondo PE Europa II', committed: 20000, called: 18000, nav: 18220, dpi: 0, tvpi: 1.01, vintage: 2024 },
];

// Computed totals
export const loansSummary = {
  totalCapital: 237880,
  totalInterestEarned: loans.reduce((s, l) => s + l.interestEarned, 0),
  totalPending: loans.reduce((s, l) => s + l.capitalPending, 0),
  activeCount: loans.filter(l => l.status === 'Activo').length,
  completedCount: loans.filter(l => l.status === 'Amortizado').length,
  avgTir: (loans.reduce((s, l) => s + l.tir, 0) / loans.length).toFixed(1),
};
