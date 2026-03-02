import PageHeader from '../components/PageHeader';
import { usePortfolio } from '../hooks/usePortfolioData';
import { useColors } from '../hooks/useColors';

const fmt = (v) => '€' + (v || 0).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function CryptoPage({ setPage }) {
  const { crypto } = usePortfolio();
  const c = useColors();
  const btc = crypto[0];
  const pnl = btc.current - btc.invested;
  const pnlPct = ((pnl / btc.invested) * 100).toFixed(1);
  const pnlColor = pnl > 0 ? c.green : pnl < 0 ? c.red : c.amber;

  return (
    <div className="space-y-8">
      <PageHeader title="Criptomonedas" subtitle="Posiciones en cripto" icon="₿" setPage={setPage} />
      <div className="rounded-2xl p-6" style={{ background: c.card, border: `1px solid ${c.border}` }}>
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold" style={{ color: c.text }}>Bitcoin (BTC)</h3>
            <p className="text-xs mt-1" style={{ color: c.textMuted }}>{btc.amount} BTC · Precio medio €{btc.avgPrice.toLocaleString('es-ES')}</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold" style={{ color: pnlColor }}>{pnlPct}%</p>
            <p className="text-[10px]" style={{ color: c.textMuted }}>P&L</p>
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Invertido', value: fmt(btc.invested), color: c.text },
            { label: 'Valor Actual', value: fmt(btc.current), color: c.text },
            { label: 'P&L', value: fmt(pnl), color: pnlColor },
            { label: 'Precio Actual', value: '€' + btc.currentPrice.toLocaleString('es-ES'), color: c.text },
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
