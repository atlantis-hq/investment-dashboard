import { useState, useEffect, createContext, useContext } from 'react';
import { fetchAllData } from '../services/googleSheets';
import * as fallback from '../data/portfolio';

const PortfolioContext = createContext(null);

export function PortfolioProvider({ children }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const result = await fetchAllData();
      setData(result);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      console.error('Failed to fetch Google Sheets data, using fallback:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  // Build the portfolio data, merging live data with fallback
  const portfolio = buildPortfolio(data);

  return (
    <PortfolioContext.Provider value={{ ...portfolio, loading, error, lastUpdated, refresh: loadData }}>
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  return useContext(PortfolioContext);
}

function buildPortfolio(data) {
  if (!data) {
    // Use fallback data
    return {
      portfolioSummary: fallback.portfolioSummary,
      categoryAllocation: fallback.categoryAllocation,
      etfsFunds: fallback.etfsFunds,
      monetaryFunds: fallback.monetaryFunds,
      crypto: fallback.crypto,
      stocks: fallback.stocks,
      loans: fallback.loans,
      loansSummary: fallback.loansSummary,
      vcPe: fallback.vcPe,
      vcPeFunds: fallback.vcPeFunds,
      isLive: false,
    };
  }

  const { resumen, etfs, monetary, crypto, stocks, loans, vcpe, vcpeFunds } = data;

  return {
    portfolioSummary: resumen.summary,
    categoryAllocation: resumen.categories.length > 0 ? resumen.categories : fallback.categoryAllocation,
    etfsFunds: etfs.length > 0 ? etfs : fallback.etfsFunds,
    monetaryFunds: monetary.items.length > 0 ? monetary.items : fallback.monetaryFunds,
    monetaryMeta: { multiple: monetary.multiple, portfolioValue: monetary.portfolioValue, cash: monetary.cash },
    crypto: crypto.items.length > 0 ? crypto.items : fallback.crypto,
    stocks: stocks.items.length > 0 ? stocks.items : fallback.stocks,
    loans: loans.items.length > 0 ? loans.items : fallback.loans,
    loansSummary: loans.items.length > 0 ? loans.summary : fallback.loansSummary,
    loansMeta: { multiple: loans.multiple, portfolioValue: loans.portfolioValue, cash: loans.cash },
    vcPe: vcpe.items.length > 0 ? vcpe.items : fallback.vcPe,
    vcPeFunds: vcpeFunds.items.length > 0 ? vcpeFunds.items : fallback.vcPeFunds,
    isLive: true,
  };
}
