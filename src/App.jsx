import { useState } from 'react';
import Sidebar from './components/Sidebar';
import BottomNav from './components/BottomNav';
import Overview from './pages/Overview';
import OverviewMobile from './pages/OverviewMobile';
import LoansPage from './pages/LoansPage';
import LoansMobile from './pages/LoansMobile';
import ETFsPage from './pages/ETFsPage';
import MonetaryPage from './pages/MonetaryPage';
import CryptoPage from './pages/CryptoPage';
import RentaFijaPage from './pages/RentaFijaPage';
import PEPage from './pages/PEPage';
import VCPage from './pages/VCPage';
import RealEstatePage from './pages/RealEstatePage';
import { PortfolioProvider } from './hooks/usePortfolioData';
import { ThemeProvider } from './hooks/useTheme';
import { useColors } from './hooks/useColors';
import { useIsMobile } from './hooks/useMediaQuery';

const desktopPages = {
  overview: Overview,
  etfs: ETFsPage,
  monetary: MonetaryPage,
  crypto: CryptoPage,
  rentafija: RentaFijaPage,
  loans: LoansPage,
  pe: PEPage,
  vc: VCPage,
  realestate: RealEstatePage,
};

const mobilePages = {
  overview: OverviewMobile,
  loans: LoansMobile,
  // Categorías que conservan la versión desktop sobre mobile (responsive shrink)
  etfs: ETFsPage,
  monetary: MonetaryPage,
  crypto: CryptoPage,
  rentafija: RentaFijaPage,
  pe: PEPage,
  vc: VCPage,
  realestate: RealEstatePage,
};

function AppInner() {
  const [page, setPage] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const c = useColors();
  const isMobile = useIsMobile();

  const Page = (isMobile ? mobilePages : desktopPages)[page] || desktopPages.overview;

  return (
    <div className="flex h-screen" style={{ background: c.bg }}>
      {/* Desktop sidebar — hidden on mobile (replaced by bottom nav) */}
      {!isMobile && (
        <Sidebar
          page={page}
          setPage={(p) => {
            setPage(p);
            setSidebarOpen(false);
          }}
          open={sidebarOpen}
          setOpen={setSidebarOpen}
        />
      )}

      {/* Mobile sidebar acts as the "Más" sheet */}
      {isMobile && sidebarOpen && (
        <Sidebar
          page={page}
          setPage={(p) => {
            setPage(p);
            setSidebarOpen(false);
          }}
          open={sidebarOpen}
          setOpen={setSidebarOpen}
        />
      )}

      <main className="flex-1 overflow-auto">
        <div
          className="mx-auto"
          style={{
            maxWidth: 1400,
            padding: isMobile ? '0 16px 88px' : '32px',
          }}
        >
          <Page setPage={setPage} />
        </div>
      </main>

      {isMobile && (
        <BottomNav
          page={page}
          setPage={setPage}
          openMenu={() => setSidebarOpen(true)}
        />
      )}
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
