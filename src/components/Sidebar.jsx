import { LayoutDashboard, TrendingUp, Landmark, Bitcoin, Shield, Handshake, Building2, Rocket, X, Sun, Moon } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { useColors } from '../hooks/useColors';

const nav = [
  { id: 'overview', label: 'Resumen', icon: LayoutDashboard },
  { id: 'etfs', label: 'ETFs + Fondos', icon: TrendingUp },
  { id: 'monetary', label: 'Oro Físico', icon: Landmark },
  { id: 'crypto', label: 'Criptomonedas', icon: Bitcoin },
  { id: 'rentafija', label: 'Renta Fija', icon: Shield },
  { id: 'loans', label: 'Préstamos', icon: Handshake },
  { id: 'pe', label: 'Private Equity', icon: Building2 },
  { id: 'vc', label: 'VC Startups', icon: Rocket },
];

export default function Sidebar({ page, setPage, open, setOpen }) {
  const { toggle, isDark } = useTheme();
  const c = useColors();

  return (
    <>
      {open && <div className="fixed inset-0 z-40 md:hidden" style={{ background: c.overlay }} onClick={() => setOpen(false)} />}
      <aside
        className={`fixed md:static z-50 top-0 left-0 h-full w-64 flex flex-col transition-transform duration-200 ${open ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
        style={{ background: c.sidebar, borderRight: `1px solid ${c.sidebarBorder}` }}
      >
        <div className="flex items-center justify-between p-6" style={{ borderBottom: `1px solid ${c.sidebarBorder}` }}>
          <div>
            <h1 className="text-xl font-bold tracking-tight" style={{ color: c.gold }}>Portfolio</h1>
            <p className="text-xs mt-1" style={{ color: c.textMuted }}>Investment Dashboard</p>
          </div>
          <button className="md:hidden" style={{ color: c.textSecondary }} onClick={() => setOpen(false)}><X size={20} /></button>
        </div>
        <nav className="flex-1 py-4 space-y-1 px-3">
          {nav.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setPage(id)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
              style={page === id
                ? { background: `${c.gold}22`, color: c.gold }
                : { color: c.textSecondary }
              }
              onMouseEnter={(e) => { if (page !== id) { e.currentTarget.style.color = c.text; e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'; }}}
              onMouseLeave={(e) => { if (page !== id) { e.currentTarget.style.color = c.textSecondary; e.currentTarget.style.background = 'transparent'; }}}
            >
              <Icon size={18} />
              {label}
            </button>
          ))}
        </nav>
        <div className="p-4 space-y-3" style={{ borderTop: `1px solid ${c.sidebarBorder}` }}>
          <button
            onClick={toggle}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all"
            style={{ background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', color: c.textSecondary }}
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
            {isDark ? 'Modo claro' : 'Modo oscuro'}
          </button>
          <p className="text-center text-xs" style={{ color: c.textMuted }}>
            Última actualización: {new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}
          </p>
        </div>
      </aside>
    </>
  );
}
