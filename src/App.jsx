import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Overview from './pages/Overview';
import ETFsPage from './pages/ETFsPage';
import MonetaryPage from './pages/MonetaryPage';
import CryptoPage from './pages/CryptoPage';
import StocksPage from './pages/StocksPage';
import LoansPage from './pages/LoansPage';
import VCPEPage from './pages/VCPEPage';

const pages = {
  overview: Overview,
  etfs: ETFsPage,
  monetary: MonetaryPage,
  crypto: CryptoPage,
  stocks: StocksPage,
  loans: LoansPage,
  vcpe: VCPEPage,
};

export default function App() {
  const [page, setPage] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const Page = pages[page];

  return (
    <div className="flex h-screen bg-[#0a0e17]">
      <Sidebar page={page} setPage={(p) => { setPage(p); setSidebarOpen(false); }} open={sidebarOpen} setOpen={setSidebarOpen} />
      <main className="flex-1 overflow-auto">
        <div className="md:hidden flex items-center p-4 border-b border-[#1e293b]">
          <button onClick={() => setSidebarOpen(true)} className="text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
          <h1 className="ml-4 text-lg font-bold text-white">Investment Dashboard</h1>
        </div>
        <div className="p-4 md:p-8 max-w-[1400px] mx-auto">
          <Page />
        </div>
      </main>
    </div>
  );
}
