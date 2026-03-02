import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { TrendingUp, TrendingDown, ArrowRight, Wallet, Lock, Droplets, Calendar, BarChart3, AlertTriangle, Bell } from 'lucide-react';
import { usePortfolio } from '../hooks/usePortfolioData';
import { useIsMobile } from '../hooks/useMediaQuery';
import { useColors } from '../hooks/useColors';

const fmt = (v) => '€' + (v || 0).toLocaleString('es-ES', { maximumFractionDigits: 0 });
const fmtDec = (v) => '€' + (v || 0).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function SemaforoText({ value, c, suffix = '%' }) {
  const color = value > 0.5 ? c.green : value < -0.5 ? c.red : c.amber;
  return <span style={{ color }}>{value >= 0 ? '+' : ''}{value}{suffix}</span>;
}

function ProgressBar({ value, max, color, c }) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  return (
    <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: c.barTrack }}>
      <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
    </div>
  );
}

export default function Overview({ setPage }) {
  const { portfolioSummary: ps, categoryAllocation, loans, loansSummary: ls, cashflow, evolution, alerts } = usePortfolio();
  const isMobile = useIsMobile();
  const c = useColors();

  const monetaryValue = categoryAllocation.find(cat => cat.name === 'Fondos Monetarios')?.value || 0;
  const rentaFijaValue = categoryAllocation.find(cat => cat.name === 'Renta Fija')?.value || 0;
  const cryptoValue = categoryAllocation.find(cat => cat.name === 'Criptomonedas')?.value || 0;
  const liquidez = monetaryValue + rentaFijaValue + cryptoValue;

  const peInv = categoryAllocation.find(cat => cat.name === 'PE')?.invested || 0;
  const vcInv = categoryAllocation.find(cat => cat.name === 'VC Startups')?.invested || 0;
  const pctIliquido = ps.totalInvested > 0 ? ((peInv + vcInv) / ps.totalInvested * 100).toFixed(1) : '0';

  const monthlyIncome = ls.totalInterestEarned > 0 ? (ls.totalInterestEarned / 12).toFixed(0) : '0';

  const upcomingLoans = [...loans]
    .sort((a, b) => {
      const [da, ma, ya] = a.endDate.split('/');
      const [db, mb, yb] = b.endDate.split('/');
      return new Date(ya, ma - 1, da) - new Date(yb, mb - 1, db);
    })
    .slice(0, 4);

  const categories = [
    { id: 'loans', name: 'Préstamos', color: c.purple, icon: '🏦', invested: ls.totalCapital, value: ls.totalCapital + ls.totalInterestEarned, detail: `${loans.length} activos · TIR media ${ls.avgTir}%`, highlight: fmtDec(ls.totalInterestEarned) + ' en intereses', highlightColor: c.green },
    { id: 'pe', name: 'Private Equity', color: c.pink, icon: '🏢', invested: peInv, value: peInv, detail: '3 participaciones directas', highlight: 'Ilíquido', highlightColor: c.amber },
    { id: 'vc', name: 'VC Startups', color: c.rose, icon: '🚀', invested: vcInv, value: vcInv, detail: '2 fondos venture capital', highlight: 'Ilíquido', highlightColor: c.amber },
    { id: 'etfs', name: 'ETFs + Fondos', color: c.blue, icon: '📈', ...categoryAllocation.find(cat => cat.name === 'ETFs + Fondos'), detail: '1 fondo (Gestivalue Cap)' },
    { id: 'monetary', name: 'Oro Físico', color: c.cyan, icon: '🥇', ...categoryAllocation.find(cat => cat.name === 'Fondos Monetarios'), detail: '500g en lingotes' },
    { id: 'crypto', name: 'Criptomonedas', color: c.amber, icon: '₿', ...categoryAllocation.find(cat => cat.name === 'Criptomonedas'), detail: '1.04 BTC' },
    { id: 'rentafija', name: 'Renta Fija', color: c.green, icon: '🛡️', ...categoryAllocation.find(cat => cat.name === 'Renta Fija'), detail: 'Revolut · 2.27% TAE' },
  ];

  const PieTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    const d = payload[0].payload;
    return (
      <div className="rounded-lg p-3 text-xs shadow-xl" style={{ background: c.tooltipBg, border: `1px solid ${c.tooltipBorder}` }}>
        <p className="font-semibold" style={{ color: c.text }}>{d.name}</p>
        <p style={{ color: c.textSecondary }}>{fmt(d.invested)} invertido</p>
      </div>
    );
  };

  const ChartTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="rounded-lg p-3 text-xs shadow-xl" style={{ background: c.tooltipBg, border: `1px solid ${c.tooltipBorder}` }}>
        <p className="font-semibold mb-1" style={{ color: c.text }}>{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }}>{p.name}: {fmt(p.value)}</p>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold`} style={{ color: c.text }}>Dashboard</h2>
        <p className="text-sm mt-1" style={{ color: c.textMuted }}>Actualizado {ps.lastUpdated ? new Date(ps.lastUpdated + 'T00:00:00').toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }) : new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
      </div>

      {/* ⚠️ ALERTS */}
      {alerts.length > 0 && (
        <div className="space-y-2">
          {alerts.map((a, i) => {
            const isUrgent = a.type === 'urgent';
            const bgColor = isUrgent ? c.redBg : c.amberBg;
            const borderColor = isUrgent ? c.redBorder : c.amberBorder;
            const textColor = isUrgent ? c.red : c.amber;
            return (
              <button
                key={i}
                onClick={() => setPage('loans')}
                className="w-full rounded-xl p-4 flex items-center gap-3 text-left transition-opacity hover:opacity-80"
                style={{ background: bgColor, border: `1px solid ${borderColor}` }}
              >
                {isUrgent ? <AlertTriangle size={18} style={{ color: textColor }} className="shrink-0" /> : <Bell size={18} style={{ color: textColor }} className="shrink-0" />}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium" style={{ color: textColor }}>
                    {a.project} vence en {a.daysLeft} días
                    <span className="font-normal ml-1" style={{ color: `${textColor}bb` }}>({a.endDate})</span>
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: `${textColor}99` }}>{fmt(a.capitalPending)} pendiente de cobro</p>
                </div>
                <ArrowRight size={14} style={{ color: textColor }} className="shrink-0" />
              </button>
            );
          })}
        </div>
      )}

      {/* Hero KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl p-5" style={{ background: `linear-gradient(135deg, ${c.goldBg}, ${c.goldBgLight})`, border: `1px solid ${c.goldBorder}` }}>
          <div className="flex items-center gap-2 mb-3">
            <Wallet size={16} style={{ color: c.gold }} />
            <span className="text-xs uppercase font-medium tracking-wider" style={{ color: c.gold }}>Patrimonio</span>
          </div>
          <p className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold`} style={{ color: c.text }}>{fmt(ps.totalValue)}</p>
          <div className="flex items-center gap-1.5 mt-2">
            {ps.totalReturnPct >= 0 ? <TrendingUp size={14} style={{ color: c.green }} /> : <TrendingDown size={14} style={{ color: c.red }} />}
            <SemaforoText value={ps.totalReturnPct} c={c} />
            <span className="text-xs ml-1" style={{ color: c.textMuted }}>({fmt(ps.totalReturn)})</span>
          </div>
        </div>

        {[
          { icon: Droplets, iconColor: c.cyan, label: 'Liquidez', value: fmt(liquidez), sub: 'RF + Oro + Crypto', valueColor: c.text },
          { icon: Lock, iconColor: c.amber, label: 'Ilíquido', value: pctIliquido + '%', sub: fmt(peInv + vcInv) + ' en PE + VC', valueColor: c.amber },
          { icon: BarChart3, iconColor: c.purple, label: 'Income/mes', value: '~€' + parseInt(monthlyIncome).toLocaleString('es-ES'), sub: 'Intereses préstamos', valueColor: c.green },
        ].map((kpi) => (
          <div key={kpi.label} className="rounded-2xl p-5" style={{ background: c.card, border: `1px solid ${c.border}` }}>
            <div className="flex items-center gap-2 mb-3">
              <kpi.icon size={16} style={{ color: kpi.iconColor }} />
              <span className="text-xs uppercase font-medium tracking-wider" style={{ color: c.textSecondary }}>{kpi.label}</span>
            </div>
            <p className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold`} style={{ color: kpi.valueColor }}>{kpi.value}</p>
            <p className="text-xs mt-2" style={{ color: c.textMuted }}>{kpi.sub}</p>
          </div>
        ))}
      </div>

      {/* 📈 Evolution Chart */}
      {evolution.length > 2 && (
        <div className="rounded-2xl p-6" style={{ background: c.card, border: `1px solid ${c.border}` }}>
          <h3 className="text-sm font-semibold mb-4" style={{ color: c.text }}>Evolución del Portfolio</h3>
          <ResponsiveContainer width="100%" height={isMobile ? 180 : 240}>
            <AreaChart data={evolution} margin={{ top: 5, right: 5, bottom: 0, left: isMobile ? -20 : 0 }}>
              <defs>
                <linearGradient id="gradGold" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={c.gold} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={c.gold} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={`${c.border}`} />
              <XAxis dataKey="month" tick={{ fill: c.textMuted, fontSize: isMobile ? 9 : 11 }} interval={isMobile ? 4 : 2} />
              <YAxis tick={{ fill: c.textMuted, fontSize: 10 }} tickFormatter={(v) => (v / 1000).toFixed(0) + 'K'} />
              <Tooltip content={<ChartTooltip />} />
              <Area type="monotone" dataKey="invested" name="Invertido" stroke={c.gold} fill="url(#gradGold)" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* 💰 Cashflow + Distribution side by side */}
      <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-2'} gap-6`}>
        {/* Cashflow Proyectado */}
        <div className="rounded-2xl p-6" style={{ background: c.card, border: `1px solid ${c.border}` }}>
          <h3 className="text-sm font-semibold mb-1" style={{ color: c.text }}>Cashflow Proyectado</h3>
          <p className="text-xs mb-4" style={{ color: c.textMuted }}>Ingresos mensuales estimados (12 meses)</p>
          <ResponsiveContainer width="100%" height={isMobile ? 180 : 220}>
            <BarChart data={cashflow} margin={{ top: 5, right: 5, bottom: 0, left: isMobile ? -20 : 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={`${c.border}`} />
              <XAxis dataKey="month" tick={{ fill: c.textMuted, fontSize: isMobile ? 8 : 10 }} interval={isMobile ? 2 : 0} />
              <YAxis tick={{ fill: c.textMuted, fontSize: 10 }} tickFormatter={(v) => v + '€'} />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="income" name="Intereses" fill={c.green} radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          {cashflow.length > 0 && (
            <div className="flex justify-between mt-4 pt-3" style={{ borderTop: `1px solid ${c.border}` }}>
              <div>
                <p className="text-[10px] uppercase tracking-wider" style={{ color: c.textSecondary }}>Total 12m</p>
                <p className="text-sm font-bold mt-0.5" style={{ color: c.green }}>{fmt(cashflow.reduce((s, m) => s + m.income, 0))}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-wider" style={{ color: c.textSecondary }}>Media/mes</p>
                <p className="text-sm font-bold mt-0.5" style={{ color: c.green }}>{fmt(Math.round(cashflow.reduce((s, m) => s + m.income, 0) / 12))}</p>
              </div>
            </div>
          )}
        </div>

        {/* Distribution Pie */}
        <div className="rounded-2xl p-6" style={{ background: c.card, border: `1px solid ${c.border}` }}>
          <h3 className="text-sm font-semibold mb-4" style={{ color: c.text }}>Distribución</h3>
          <ResponsiveContainer width="100%" height={isMobile ? 180 : 220}>
            <PieChart>
              <Pie data={categoryAllocation} cx="50%" cy="50%" innerRadius={isMobile ? 45 : 55} outerRadius={isMobile ? 75 : 90} dataKey="invested" stroke="none" paddingAngle={2}>
                {categoryAllocation.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip content={<PieTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {categoryAllocation.map((cat) => (
              <div key={cat.name} className="flex items-center gap-2 text-xs">
                <div className="w-2 h-2 rounded-full shrink-0" style={{ background: cat.color }} />
                <span className="truncate" style={{ color: c.textSecondary }}>{cat.name}</span>
                <span className="ml-auto" style={{ color: c.textMuted }}>{ps.totalInvested ? ((cat.invested / ps.totalInvested) * 100).toFixed(0) : 0}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Upcoming maturities */}
      <div className="rounded-2xl p-6" style={{ background: c.card, border: `1px solid ${c.border}` }}>
        <div className="flex items-center gap-2 mb-4">
          <Calendar size={16} style={{ color: c.gold }} />
          <h3 className="text-sm font-semibold" style={{ color: c.text }}>Próximos Vencimientos</h3>
        </div>
        <div className={`grid ${isMobile ? 'grid-cols-1 gap-4' : 'grid-cols-2 gap-x-8 gap-y-4'}`}>
          {upcomingLoans.map((l) => {
            const progress = l.cuotasPagadas / (l.cuotasPagadas + l.cuotasRestantes);
            return (
              <div key={l.id}>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-sm font-medium" style={{ color: c.text }}>{l.project}</span>
                  <span className="text-xs" style={{ color: c.textMuted }}>{l.endDate}</span>
                </div>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-xs" style={{ color: c.textSecondary }}>{fmt(l.capitalPending)} pendiente</span>
                  <span className="text-xs" style={{ color: c.green }}>{(progress * 100).toFixed(0)}% amortizado</span>
                </div>
                <ProgressBar value={l.cuotasPagadas} max={l.cuotasPagadas + l.cuotasRestantes} color={c.purple} c={c} />
              </div>
            );
          })}
        </div>
      </div>

      {/* Category Cards */}
      <div>
        <h3 className="text-lg font-semibold mb-4" style={{ color: c.text }}>Por Categoría</h3>
        <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-2 xl:grid-cols-3'} gap-4`}>
          {categories.map((cat) => {
            const pct = ps.totalInvested > 0 ? ((cat.invested / ps.totalInvested) * 100).toFixed(1) : '0';
            const ret = cat.return ?? 0;
            return (
              <button
                key={cat.id}
                onClick={() => setPage(cat.id)}
                className="rounded-2xl p-5 text-left transition-all group"
                style={{ background: c.card, border: `1px solid ${c.border}` }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = c.borderHover; e.currentTarget.style.background = c.cardHover; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = c.border; e.currentTarget.style.background = c.card; }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{cat.icon}</span>
                    <div>
                      <h4 className="text-sm font-semibold" style={{ color: c.text }}>{cat.name}</h4>
                      <p className="text-[10px] mt-0.5" style={{ color: c.textMuted }}>{cat.detail}</p>
                    </div>
                  </div>
                  <ArrowRight size={16} className="mt-1 transition-colors" style={{ color: c.textMuted }} />
                </div>
                <div className="flex items-end justify-between mt-4">
                  <div>
                    <p className="text-lg font-bold" style={{ color: c.text }}>{fmt(cat.invested)}</p>
                    <p className="text-xs" style={{ color: c.textMuted }}>{pct}% del portfolio</p>
                  </div>
                  <div className="text-right">
                    {cat.highlight
                      ? <p className="text-sm font-medium" style={{ color: cat.highlightColor }}>{cat.highlight}</p>
                      : <SemaforoText value={ret} c={c} />
                    }
                  </div>
                </div>
                <div className="mt-3">
                  <ProgressBar value={cat.invested} max={ps.totalInvested} color={cat.color} c={c} />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="rounded-xl p-4 text-xs" style={{ background: c.amberBg, border: `1px solid ${c.amberBorder}`, color: c.amber }}>
        💡 PE y VC: solo capital invertido en totales. Múltiplos no realizados como referencia en sus páginas.
      </div>
    </div>
  );
}
