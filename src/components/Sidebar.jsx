import { LayoutDashboard, TrendingUp, Landmark, Bitcoin, Shield, Handshake, Building2, Rocket, X } from 'lucide-react';

const nav = [
  { id: 'overview', label: 'Resumen', icon: LayoutDashboard },
  { id: 'etfs', label: 'ETFs + Fondos', icon: TrendingUp },
  { id: 'monetary', label: 'Fondos Monetarios', icon: Landmark },
  { id: 'crypto', label: 'Criptomonedas', icon: Bitcoin },
  { id: 'rentafija', label: 'Renta Fija', icon: Shield },
  { id: 'loans', label: 'Préstamos', icon: Handshake },
  { id: 'pe', label: 'Private Equity', icon: Building2 },
  { id: 'vc', label: 'VC Startups', icon: Rocket },
];

export default function Sidebar({ page, setPage, open, setOpen }) {
  return (
    <>
      {open && <div className="fixed inset-0 bg-black/60 z-40 md:hidden" onClick={() => setOpen(false)} />}
      <aside className={`fixed md:static z-50 top-0 left-0 h-full w-64 bg-[#111827] border-r border-[#1e293b] flex flex-col transition-transform duration-200 ${open ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <div className="flex items-center justify-between p-6 border-b border-[#1e293b]">
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">💼 Portfolio</h1>
            <p className="text-xs text-[#94a3b8] mt-1">Investment Dashboard</p>
          </div>
          <button className="md:hidden text-[#94a3b8]" onClick={() => setOpen(false)}><X size={20} /></button>
        </div>
        <nav className="flex-1 py-4 space-y-1 px-3">
          {nav.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setPage(id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                page === id
                  ? 'bg-[#3b82f6]/15 text-[#3b82f6]'
                  : 'text-[#94a3b8] hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon size={18} />
              {label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-[#1e293b] text-xs text-[#64748b]">
          Última actualización: 20 Feb 2026
        </div>
      </aside>
    </>
  );
}
