import PageHeader from '../components/PageHeader';
import { usePortfolio } from '../hooks/usePortfolioData';
import { useColors } from '../hooks/useColors';

const fmt = (v) => '€' + (v || 0).toLocaleString('es-ES', { maximumFractionDigits: 0 });

export default function VCPage({ setPage }) {
  const { vcStartups, vcSummary } = usePortfolio();
  const c = useColors();

  return (
    <div className="space-y-8">
      <PageHeader title="VC Startups" subtitle="Fondos de venture capital" icon="🚀" setPage={setPage} />

      <div className="grid grid-cols-2 gap-4">
        {[
          { label: 'Committed', value: fmt(vcSummary.totalInvested), color: c.text },
          { label: 'NAV Ref.', value: fmt(vcSummary.totalCurrentValue), color: c.amber },
        ].map((kpi) => (
          <div key={kpi.label} className="rounded-2xl p-5" style={{ background: c.card, border: `1px solid ${c.border}` }}>
            <span className="text-xs uppercase tracking-wider" style={{ color: c.textSecondary }}>{kpi.label}</span>
            <p className="text-xl font-bold mt-2" style={{ color: kpi.color }}>{kpi.value}</p>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        {vcStartups.map((vc) => {
          const mColor = vc.multiple >= 1.5 ? c.green : vc.multiple >= 1 ? c.amber : c.red;
          return (
            <div key={vc.name} className="rounded-2xl p-6" style={{ background: c.card, border: `1px solid ${c.border}` }}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold" style={{ color: c.text }}>{vc.name}</h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: `${c.amber}22`, color: c.amber }}>{vc.status}</span>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold" style={{ color: mColor }}>{vc.multiple}x</p>
                  <p className="text-[10px]" style={{ color: c.textMuted }}>TVPI</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Committed', value: fmt(vc.invested) },
                  { label: 'NAV', value: fmt(vc.currentValue) },
                ].map((f) => (
                  <div key={f.label}>
                    <p className="text-[10px] uppercase tracking-wider" style={{ color: c.textSecondary }}>{f.label}</p>
                    <p className="text-sm font-semibold mt-1" style={{ color: c.text }}>{f.value}</p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="rounded-xl p-4 text-xs" style={{ background: c.amberBg, border: `1px solid ${c.amberBorder}`, color: c.amber }}>
        💡 Solo capital committed en totales del portfolio. NAV es referencial hasta distribución.
      </div>
    </div>
  );
}
