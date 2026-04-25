import { useState, useMemo, createContext, useContext, useEffect } from 'react';
import * as fallback from '../data/portfolio';
import { fetchPortfolio } from '../services/portfolioApi';

const PortfolioContext = createContext(null);

function buildFromFallback() {
  return {
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
    stocks: fallback.stocks,
    vcPe: fallback.vcPe,
    vcPeFunds: fallback.vcPeFunds,
  };
}

export function PortfolioProvider({ children }) {
  const [remote, setRemote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isLive, setIsLive] = useState(false);

  async function load() {
    setLoading(true);
    const r = await fetchPortfolio();
    if (r.ok) {
      setRemote(r.data);
      setIsLive(true);
      setError(null);
    } else {
      setRemote(null);
      setIsLive(false);
      setError(r.error || new Error(`api ${r.status || 'unreachable'}`));
    }
    setLastUpdated(new Date());
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  const base = useMemo(() => remote ?? buildFromFallback(), [remote]);

  // Computed views stay in the frontend (cheap, depend on base data shape).
  const cashflow = useMemo(() => fallback.computeCashflow(), [base]);
  const evolution = useMemo(() => fallback.computeEvolution(), [base]);
  const alerts = useMemo(() => fallback.computeAlerts(), [base]);

  const value = {
    ...base,
    computeRealEstateMetrics: fallback.computeRealEstateMetrics,
    cashflow,
    evolution,
    alerts,
    loading,
    error,
    lastUpdated,
    isLive,
    refresh: load,
  };

  return <PortfolioContext.Provider value={value}>{children}</PortfolioContext.Provider>;
}

export function usePortfolio() {
  return useContext(PortfolioContext);
}
