import PageHeader from '../components/PageHeader';
import { usePortfolio } from '../hooks/usePortfolioData';
import { useColors } from '../hooks/useColors';

const fmt = (v) => '€' + (v || 0).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function RentaFijaPage({ setPage }) {
  const { rentaFija } = usePortfolio();
  const c = useColors();
  const rf = rentaFija[0];

  return (
    <div className="space-y-8">
      <PageHeader title="Renta Fija" subtitle="Cuentas remuneradas y depósitos" icon="🛡️" setPage={setPage} />
      <div className="rounded-2xl p-6" style={{ background: c.card, border: `1px solid ${c.border}` }}>
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold" style={{ color: c.text }}>{rf.name}</h3>
            <p className="text-xs mt-1" style={{ color: c.textMuted }}>{rf.product} · Inicio {rf.startDate} · {rf.status}</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold" style={{ color: c.green }}>{rf.tae}%</p>
            <p className="text-[10px]" style={{ color: c.textMuted }}>TAE</p>
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { label: 'Capital', value: fmt(rf.capital), color: c.text },
            { label: 'Intereses', value: fmt(rf.interestAccrued), color: c.green },
            { label: 'Valor Total', value: fmt(rf.currentValue), color: c.text },
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
