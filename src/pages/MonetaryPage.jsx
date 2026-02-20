import KPI from '../components/KPI';
import Card from '../components/Card';
import DataTable from '../components/DataTable';
import { usePortfolio } from '../hooks/usePortfolioData';
import { Landmark, TrendingDown } from 'lucide-react';

const fmt = (v) => '€' + (v || 0).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const columns = [
  { key: 'name', label: 'Nombre', render: (v) => <span className="font-medium text-white">{v}</span> },
  { key: 'type', label: 'Tipo', render: (v) => (
    <span className={`text-xs px-2 py-0.5 rounded-full ${v === 'Oro Físico' ? 'bg-yellow-500/15 text-yellow-400' : 'bg-cyan-500/15 text-cyan-400'}`}>{v}</span>
  )},
  { key: 'invested', label: 'Coste', align: 'right', render: (v) => <span className="text-[#94a3b8]">{fmt(v)}</span> },
  { key: 'current', label: 'Valor Actual', align: 'right', render: (v) => <span className="text-white font-medium">{fmt(v)}</span> },
  { key: 'returnPct', label: 'Rentabilidad', align: 'right', render: (_, row) => {
    const r = row.invested ? ((row.current - row.invested) / row.invested * 100).toFixed(2) : '0';
    return <span className={r >= 0 ? 'text-[#10b981]' : 'text-[#ef4444]'}>{r >= 0 ? '+' : ''}{r}%</span>;
  }},
];

export default function MonetaryPage() {
  const { monetaryFunds } = usePortfolio();
  const totalInvested = monetaryFunds.reduce((s, f) => s + f.invested, 0);
  const totalCurrent = monetaryFunds.reduce((s, f) => s + f.current, 0);
  const pnl = totalCurrent - totalInvested;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Fondos Monetarios + Oro</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KPI label="Valor Total" value={totalCurrent} icon={Landmark} />
        <KPI label="Coste Total" value={totalInvested} />
        <KPI label="Ganancia/Pérdida" value={pnl} change={totalInvested ? ((pnl / totalInvested) * 100).toFixed(2) : 0} icon={TrendingDown} />
      </div>
      <Card title="Detalle de Activos Monetarios">
        <DataTable columns={columns} data={monetaryFunds} />
      </Card>
    </div>
  );
}
