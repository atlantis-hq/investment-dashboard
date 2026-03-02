import PageHeader from '../components/PageHeader';
import { usePortfolio } from '../hooks/usePortfolioData';
import { useColors } from '../hooks/useColors';

const fmt = (v) => '€' + (v || 0).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function MonetaryPage({ setPage }) {
  const { monetaryFunds } = usePortfolio();
  const c = useColors();
  const gold = monetaryFunds[0];
  const pnl = gold.current - gold.invested;
  const pnlPct = ((pnl / gold.invested) * 100).toFixed(1);
  const pnlColor = pnl > 0 ? c.green : pnl < 0 ? c.red : c.amber;

  return (
    <div className="space-y-8">
      <PageHeader title="Oro Físico" subtitle="Reserva en lingotes de oro" icon="🥇" setPage={setPage} />
      <div className="rounded-2xl p-6" style={{ background: c.card, border: `1px solid ${c.border}` }}>
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold" style={{ color: c.text }}>{gold.name}</h3>
            <p className="text-xs mt-1" style={{ color: c.textMuted }}>{gold.units} × {gold.unitWeight} · {gold.status}</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold" style={{ color: pnlColor }}>{pnlPct}%</p>
            <p className="text-[10px]" style={{ color: c.textMuted }}>vs coste</p>
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { label: 'Coste Total', value: fmt(gold.invested), color: c.text },
            { label: 'Valor Actual', value: fmt(gold.current), color: c.text },
            { label: 'P&L', value: fmt(pnl), color: pnlColor },
          ].map((f) => (
            <div key={f.label}>
              <p className="text-[10px] uppercase tracking-wider" style={{ color: c.textSecondary }}>{f.label}</p>
              <p className="text-lg font-semibold mt-1" style={{ color: f.color }}>{f.value}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-xl p-4 text-xs" style={{ background: `${c.cyan}15`, border: `1px solid ${c.cyan}33`, color: c.cyan }}>
        💡 Precio referencia vía proxy GLD ETF (~8% bajo spot). El valor real puede ser ligeramente superior.
      </div>
    </div>
  );
}
