import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Overview from './pages/Overview';
import ETFsPage from './pages/ETFsPage';
import MonetaryPage from './pages/MonetaryPage';
import CryptoPage from './pages/CryptoPage';
import RentaFijaPage from './pages/RentaFijaPage';
import LoansPage from './pages/LoansPage';
import PEPage from './pages/PEPage';
import VCPage from './pages/VCPage';
import { PortfolioProvider } from './hooks/usePortfolioData';
import { ThemeProvider } from './hooks/useTheme';
import { useColors } from './hooks/useColors';

const pages = {
  overview: Overview,
  etfs: ETFsPage,
  monetary: MonetaryPage,
  crypto: CryptoPage,
  rentafija: RentaFijaPage,
  loans: LoansPage,
  pe: PEPage,
  vc: VCPage,
};

function AppInner() {
  const [page, setPage] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const c = useColors();
  const Page = pages[page];

  return (
    <div className="flex h-screen" style={{ background: c.bg }}>
      <Sidebar page={page} setPage={(p) => { setPage(p); setSidebarOpen(false); }} open={sidebarOpen} setOpen={setSidebarOpen} />
      <main className="flex-1 overflow-auto">
        <div className="md:hidden flex items-center p-4" style={{ borderBottom: `1px solid ${c.border}` }}>
          <button onClick={() => setSidebarOpen(true)} style={{ color: c.gold }} className="hover:opacity-80 transition-opacity">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
          <h1 className="ml-4 text-lg font-bold" style={{ color: c.gold }}>Portfolio</h1>
        </div>
        <div className="p-4 md:p-8 max-w-[1400px] mx-auto">
          <Page setPage={(p) => { setPage(p); }} />
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <PortfolioProvider>
        <AppInner />
      </PortfolioProvider>
    </ThemeProvider>
  );
}
