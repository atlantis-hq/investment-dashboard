import PageHeader from '../components/PageHeader';
import { usePortfolio } from '../hooks/usePortfolioData';
import { useColors } from '../hooks/useColors';

const fmt = (v) => '€' + (v || 0).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function ETFsPage({ setPage }) {
  const { etfsFunds } = usePortfolio();
  const c = useColors();
  const fund = etfsFunds[0];
  const retColor = fund.returnPct > 0 ? c.green : fund.returnPct < 0 ? c.red : c.amber;

  return (
    <div className="space-y-8">
      <PageHeader title="ETFs + Fondos" subtitle="Fondos de inversión" icon="📈" setPage={setPage} />
      <div className="rounded-2xl p-6" style={{ background: c.card, border: `1px solid ${c.border}` }}>
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold" style={{ color: c.text }}>{fund.name}</h3>
            <p className="text-xs mt-1" style={{ color: c.textMuted }}>{fund.type} · {fund.status} · Entrada {fund.dateEntry}</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold" style={{ color: retColor }}>+{fund.returnPct}%</p>
            <p className="text-[10px]" style={{ color: c.textMuted }}>rentabilidad</p>
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { label: 'Invertido', value: fmt(fund.invested), color: c.text },
            { label: 'Valor Actual', value: fmt(fund.current), color: c.green },
            { label: 'Beneficio', value: fmt(fund.current - fund.invested), color: c.green },
          ].map((f) => (
            <div key={f.label}>
              <p className="text-[10px] uppercase tracking-wider" style={{ color: c.textSecondary }}>{f.label}</p>
              <p className="text-lg font-semibold mt-1" style={{ color: f.color }}>{f.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
