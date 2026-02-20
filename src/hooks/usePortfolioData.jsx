import { useState, useEffect, createContext, useContext } from 'react';
import * as fallback from '../data/portfolio';

const PortfolioContext = createContext(null);

export function PortfolioProvider({ children }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated] = useState(new Date());

  // Use static data directly (real data from Google Sheets baked into portfolio.js)
  const portfolio = {
    portfolioSummary: fallback.portfolioSummary,
    categoryAllocation: fallback.categoryAllocation,
    etfsFunds: fallback.etfsFunds,
    monetaryFunds: fallback.monetaryFunds,
    crypto: fallback.crypto,
    rentaFija: fallback.rentaFija,
    loans: fallback.loans,
    loansSummary: fallback.loansSummary,
    privateEquity: fallback.privateEquity,
    peSummary: fallback.peSummary,
    vcStartups: fallback.vcStartups,
    vcSummary: fallback.vcSummary,
    // Legacy
    stocks: fallback.stocks,
    vcPe: fallback.vcPe,
    vcPeFunds: fallback.vcPeFunds,
    isLive: false,
  };

  return (
    <PortfolioContext.Provider value={{ ...portfolio, loading, error, lastUpdated, isLive: false, refresh: () => {} }}>
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  return useContext(PortfolioContext);
}
