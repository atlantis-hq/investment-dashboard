import { useState, useMemo, createContext, useContext } from 'react';
import * as fallback from '../data/portfolio';

const PortfolioContext = createContext(null);

export function PortfolioProvider({ children }) {
  const [loading] = useState(false);
  const [error] = useState(null);
  const [lastUpdated] = useState(new Date());

  const cashflow = useMemo(() => fallback.computeCashflow(), []);
  const evolution = useMemo(() => fallback.computeEvolution(), []);
  const alerts = useMemo(() => fallback.computeAlerts(), []);

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
    realEstate: fallback.realEstate,
    realEstateSummary: fallback.realEstateSummary,
    computeRealEstateMetrics: fallback.computeRealEstateMetrics,
    cashflow,
    evolution,
    alerts,
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
