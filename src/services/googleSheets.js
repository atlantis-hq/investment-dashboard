// Google Sheets CSV fetcher - no API key needed for public sheets
const SHEET_ID = '1s68o1ZGiJatFVmMRQV8dKf0DzJ9fyxKcOggfuQha-LI';
const BASE_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=`;

function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') { current += '"'; i++; }
      else inQuotes = !inQuotes;
    } else if (ch === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += ch;
    }
  }
  result.push(current.trim());
  return result;
}

function parseCSV(text) {
  return text.split('\n').filter(l => l.trim()).map(parseCSVLine);
}

function parseEuro(str) {
  if (!str || str.includes('#') || str.includes('NAME') || str.includes('ERROR')) return null;
  // Handle "15.500,00 €" or "15500.00" or "$ 500,00"
  const cleaned = str.replace(/[€$\s]/g, '');
  // European format: 15.500,00 → 15500.00
  if (cleaned.includes(',')) {
    return parseFloat(cleaned.replace(/\./g, '').replace(',', '.'));
  }
  return parseFloat(cleaned);
}

function parsePercent(str) {
  if (!str || str.includes('#') || str.includes('NAME') || str.includes('ERROR')) return null;
  return parseFloat(str.replace('%', '').replace(',', '.'));
}

function parseMultiple(str) {
  if (!str || str.includes('#') || str.includes('NAME') || str.includes('ERROR')) return null;
  return parseFloat(str.replace('x', '').replace(',', '.'));
}

async function fetchSheet(sheetName) {
  const url = BASE_URL + encodeURIComponent(sheetName);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${sheetName}: ${res.status}`);
  return parseCSV(await res.text());
}

export async function fetchResumen() {
  const rows = await fetchSheet('Resumen');
  // Rows 1-7 (after header) contain category data
  const categories = [];
  const colors = {
    'ETFs + Fondos': '#3b82f6',
    'Fondos monetarios': '#06b6d4',
    'Criptomonedas': '#f59e0b',
    'Renta Variable': '#10b981',
    'Préstamos': '#8b5cf6',
    'VC + PE': '#ec4899',
    'Fondos VC + PE': '#f43f5e',
  };

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const name = row[2];
    if (!name || !colors[name]) continue;
    const invested = parseEuro(row[3]);
    const value = parseEuro(row[4]);
    const multiple = parseMultiple(row[5]);
    const cashAllocated = parsePercent(row[6]);
    const cashCorresponding = parseEuro(row[7]);

    categories.push({
      name,
      invested: invested || 0,
      value: value || invested || 0, // fallback to invested if no current value
      color: colors[name],
      multiple: multiple || null,
      cashAllocatedPct: cashAllocated || 0,
      cashCorresponding: cashCorresponding || 0,
      return: invested && value ? Math.round(((value / invested) - 1) * 10000) / 100 : 0,
    });
  }

  const totalInvested = categories.reduce((s, c) => s + c.invested, 0);
  const totalValue = categories.reduce((s, c) => s + c.value, 0);

  return {
    summary: {
      totalValue,
      totalInvested,
      totalReturn: totalValue - totalInvested,
      totalReturnPct: totalInvested ? Math.round(((totalValue / totalInvested) - 1) * 10000) / 100 : 0,
      lastUpdated: new Date().toISOString().split('T')[0],
    },
    categories,
  };
}

export async function fetchETFs() {
  const rows = await fetchSheet('1. ETFs +Fondos');
  const items = [];
  // Skip header row, parse data rows
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const name = row[1];
    if (!name || name === '') continue;
    const ticker = row[2];
    const status = row[3];
    const priceEntry = parseEuro(row[4]);
    const shares = parseFloat(row[5]) || 0;
    const invested = parseEuro(row[6]);
    const dateEntry = row[7];
    const currentPrice = parseEuro(row[8]);
    const currentValue = parseEuro(row[9]);
    const returnPct = parsePercent(row[15]);

    if (!invested && invested !== 0) continue;

    items.push({
      name,
      ticker: ticker || '',
      invested: invested || 0,
      current: currentValue || invested || 0,
      returnPct: returnPct || 0,
      shares,
      type: name.includes('Andbank') || name.includes('MyInvestor') ? 'Fondo' : 'ETF',
      status: status || 'Buy',
      dateEntry: dateEntry || '',
    });
  }
  return items;
}

export async function fetchMonetary() {
  const rows = await fetchSheet('2. Fondos Monetarios');
  // First 3 rows are KPIs: Múltiplo, Valor de la Cartera, Cash disponible
  const multiple = parseMultiple(rows[0]?.[2]);
  const portfolioValue = parseEuro(rows[1]?.[2]);
  const cash = parseEuro(rows[2]?.[2]);

  const items = [];
  // Data rows start at index 4 (after header at index 3)
  for (let i = 4; i < rows.length; i++) {
    const row = rows[i];
    const name = row[1];
    if (!name || name === '') continue;
    const status = row[3];
    const priceEntry = parseEuro(row[4]);
    const shares = parseFloat(row[5]) || 0;
    const invested = parseEuro(row[6]);
    const dateEntry = row[7];
    const rate = parsePercent(row[8]);
    const currentPrice = parseEuro(row[9]);
    const currentValue = parseEuro(row[10]);
    const returnPct = parsePercent(row[16]);

    if (!invested && invested !== 0) continue;

    items.push({
      name,
      invested: invested || 0,
      current: currentValue || invested || 0,
      rate: rate || 0,
      returnPct: returnPct || 0,
      type: 'Fondo Monetario',
      status: status || 'Buy',
    });
  }
  return { items, multiple, portfolioValue, cash };
}

export async function fetchCrypto() {
  const rows = await fetchSheet('3. Criptomonedas');
  const cash = parseEuro(rows[1]?.[2]);
  const items = [];
  for (let i = 3; i < rows.length; i++) {
    const row = rows[i];
    const name = row[1];
    if (!name || name === '') continue;
    const ticker = row[2];
    const status = row[3];
    const priceEntry = parseEuro(row[4]);
    const amount = parseFloat(row[5]) || 0;
    const invested = parseEuro(row[6]);
    const dateEntry = row[7];
    const currentPrice = parseEuro(row[8]);
    const currentValue = parseEuro(row[9]);
    const returnPct = parsePercent(row[15]);

    if (!invested && invested !== 0) continue;

    items.push({
      name,
      ticker: ticker || name,
      amount,
      avgPrice: priceEntry || 0,
      currentPrice: currentPrice || priceEntry || 0,
      invested: invested || 0,
      current: currentValue || invested || 0,
      returnPct: returnPct || 0,
    });
  }
  return { items, cash };
}

export async function fetchStocks() {
  const rows = await fetchSheet('4. Renta Variable');
  const cash = parseEuro(rows[1]?.[2]);
  const items = [];
  for (let i = 3; i < rows.length; i++) {
    const row = rows[i];
    const name = row[1];
    if (!name || name === '') continue;
    const ticker = row[2];
    const status = row[3];
    const priceEntry = parseEuro(row[4]);
    const shares = parseFloat(row[5]) || 0;
    const invested = parseEuro(row[6]);
    const dateEntry = row[7];
    const currentPrice = parseEuro(row[8]);
    const currentValue = parseEuro(row[9]);
    const returnPct = parsePercent(row[15]);

    if (!invested && invested !== 0) continue;

    items.push({
      name,
      ticker: ticker || name,
      shares,
      avgPrice: priceEntry || 0,
      currentPrice: currentPrice || priceEntry || 0,
      invested: invested || 0,
      current: currentValue || invested || 0,
      returnPct: returnPct || 0,
    });
  }
  return { items, cash };
}

export async function fetchLoans() {
  const rows = await fetchSheet('5. Préstamos');
  // First 3 rows: Múltiplo, Valor de la Cartera, Cash disponible
  const multiple = parseMultiple(rows[0]?.[2]);
  const portfolioValue = parseEuro(rows[1]?.[2]);
  const cash = parseEuro(rows[2]?.[2]);

  const items = [];
  // Data rows start at index 4 (after header at index 3)
  for (let i = 4; i < rows.length; i++) {
    const row = rows[i];
    const project = row[1];
    if (!project || project === '') continue;
    const platform = row[2];
    const status = row[3];
    const capital = parseEuro(row[4]);
    const invested = parseEuro(row[6]);
    const startDate = row[7];
    const interestRate = parsePercent(row[8]);
    const endDate = row[9];
    const totalMonths = parseInt(row[10]) || 0;
    const monthsRemaining = parseInt(row[11]) || 0;
    const capitalPaid = parseEuro(row[12]);
    const interestPaid = parseEuro(row[13]);
    const capitalPending = parseEuro(row[14]);
    const totalPending = parseEuro(row[15]);
    const tir = parsePercent(row[16]);
    const interestEarned = parseEuro(row[17]);

    if (!capital && capital !== 0) continue;

    items.push({
      id: items.length + 1,
      platform: platform || 'Unknown',
      project: project || '',
      capital: capital || 0,
      interestRate: interestRate || 0,
      tir: tir || interestRate || 0,
      term: totalMonths,
      monthsRemaining,
      startDate: startDate || '',
      endDate: endDate || '',
      status: status === 'Buy' ? 'Activo' : status || 'Activo',
      capitalPending: capitalPending || 0,
      capitalPaid: capitalPaid || 0,
      interestPaid: interestPaid || 0,
      interestEarned: interestEarned || 0,
      totalPending: totalPending || 0,
    });
  }

  const totalCapital = items.reduce((s, l) => s + l.capital, 0);
  const totalInterestEarned = items.reduce((s, l) => s + l.interestEarned, 0);
  const totalPending = items.reduce((s, l) => s + l.capitalPending, 0);
  const activeCount = items.filter(l => l.status === 'Activo').length;
  const completedCount = items.filter(l => l.status !== 'Activo').length;
  const avgTir = items.length ? (items.reduce((s, l) => s + l.tir, 0) / items.length).toFixed(1) : '0';

  return {
    items,
    summary: { totalCapital, totalInterestEarned, totalPending, activeCount, completedCount, avgTir },
    multiple,
    portfolioValue,
    cash,
  };
}

export async function fetchVCPE() {
  const rows = await fetchSheet('6. VC+PE');
  const cash = parseEuro(rows[1]?.[2]);
  const items = [];
  for (let i = 3; i < rows.length; i++) {
    const row = rows[i];
    const name = row[1];
    if (!name || name === '') continue;
    const invested = parseEuro(row[6]);
    const currentValue = parseEuro(row[9]);
    if (!invested && invested !== 0) continue;
    items.push({
      name,
      invested: invested || 0,
      valuation: currentValue || invested || 0,
      status: row[3] === 'Buy' ? 'Activo' : row[3] || 'Activo',
      vintage: row[7] ? new Date(row[7]).getFullYear() || 2024 : 2024,
    });
  }
  return { items, cash };
}

export async function fetchVCPEFunds() {
  const rows = await fetchSheet('7. Fondos VC+PE');
  const cash = parseEuro(rows[1]?.[2]);
  const items = [];
  for (let i = 3; i < rows.length; i++) {
    const row = rows[i];
    const name = row[1];
    if (!name || name === '') continue;
    const invested = parseEuro(row[6]);
    const currentValue = parseEuro(row[9]);
    if (!invested && invested !== 0) continue;
    items.push({
      name,
      committed: invested || 0,
      called: invested || 0,
      nav: currentValue || invested || 0,
      dpi: 0,
      tvpi: currentValue && invested ? Math.round((currentValue / invested) * 100) / 100 : 1,
      vintage: row[7] ? new Date(row[7]).getFullYear() || 2024 : 2024,
    });
  }
  return { items, cash };
}

// Fetch all data at once
export async function fetchAllData() {
  const [resumen, etfs, monetary, crypto, stocks, loans, vcpe, vcpeFunds] = await Promise.all([
    fetchResumen(),
    fetchETFs(),
    fetchMonetary(),
    fetchCrypto(),
    fetchStocks(),
    fetchLoans(),
    fetchVCPE(),
    fetchVCPEFunds(),
  ]);

  return { resumen, etfs, monetary, crypto, stocks, loans, vcpe, vcpeFunds };
}
