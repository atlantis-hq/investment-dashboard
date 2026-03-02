import PageHeader from '../components/PageHeader';
import { usePortfolio } from '../hooks/usePortfolioData';
import { useIsMobile } from '../hooks/useMediaQuery';
import { useColors } from '../hooks/useColors';

const fmt = (v) => '€' + (v || 0).toLocaleString('es-ES', { maximumFractionDigits: 0 });

export default function PEPage({ setPage }) {
  const { privateEquity, peSummary } = usePortfolio();
  const isMobile = useIsMobile();
  const c = useColors();

  return (
    <div className="space-y-8">
      <PageHeader title="Private Equity" subtitle="Participaciones directas en empresas" icon="🏢" setPage={setPage} />

      <div className="grid grid-cols-2 gap-4">
        {[
          { label: 'Capital Invertido', value: fmt(peSummary.totalInvested), sub: `${privateEquity.length} participaciones`, color: c.text },
          { label: 'Valoración Ref.', value: fmt(peSummary.totalCurrentValue), sub: 'No realizado', color: c.amber },
        ].map((kpi) => (
          <div key={kpi.label} className="rounded-2xl p-5" style={{ background: c.card, border: `1px solid ${c.border}` }}>
            <span className="text-xs uppercase tracking-wider" style={{ color: c.textSecondary }}>{kpi.label}</span>
            <p className="text-xl font-bold mt-2" style={{ color: kpi.color }}>{kpi.value}</p>
            <p className="text-[10px] mt-1" style={{ color: c.textMuted }}>{kpi.sub}</p>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        {privateEquity.map((pe) => {
          const mColor = pe.multiple >= 2 ? c.green : pe.multiple >= 1 ? c.amber : c.red;
          const pct = Math.min(pe.multiple / 5, 1) * 100;
          return (
            <div key={pe.name} className="rounded-2xl p-6" style={{ background: c.card, border: `1px solid ${c.border}` }}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold" style={{ color: c.text }}>{pe.name}</h3>
                  <p className="text-xs mt-0.5" style={{ color: c.textMuted }}>{pe.participation}% participación · Valoración {fmt(pe.companyValuation)}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold" style={{ color: mColor }}>{pe.multiple}x</p>
                  <p className="text-[10px]" style={{ color: c.textMuted }}>múltiplo</p>
                </div>
              </div>
              <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: c.barTrack }}>
                <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: mColor }} />
              </div>
              <div className={`grid ${isMobile ? 'grid-cols-2' : 'grid-cols-3'} gap-4 mt-5`}>
                {[
                  { label: 'Invertido', value: fmt(pe.invested) },
                  { label: 'Valor Ref.', value: fmt(pe.currentValue) },
                  ...(!isMobile ? [{ label: 'Val. Compañía', value: fmt(pe.companyValuation) }] : []),
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
        💡 Las valoraciones son referenciales. Solo el capital invertido cuenta en los totales hasta la venta.
      </div>
    </div>
  );
}
