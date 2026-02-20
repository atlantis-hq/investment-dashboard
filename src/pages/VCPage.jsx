import KPI from '../components/KPI';
import Card from '../components/Card';
import DataTable from '../components/DataTable';
import { usePortfolio } from '../hooks/usePortfolioData';
import { Rocket, TrendingUp, AlertTriangle } from 'lucide-react';

const fmt = (v) => '€' + (v || 0).toLocaleString('es-ES');

const columns = [
  { key: 'name', label: 'Fondo', render: (v) => <span className="font-medium text-white">{v}</span> },
  { key: 'invested', label: 'Capital Invertido', align: 'right', render: (v) => <span className="text-[#94a3b8]">{fmt(v)}</span> },
  { key: 'currentValue', label: 'Valor Actual', align: 'right', render: (v) => <span className="text-white font-medium">{fmt(v)}</span> },
  { key: 'multiple', label: 'Múltiplo', align: 'right', render: (v) => (
    <span className={`font-bold ${v >= 1 ? 'text-[#10b981]' : 'text-[#ef4444]'}`}>{v}x</span>
  )},
  { key: 'status', label: 'Estado', render: (v) => <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/15 text-green-400">{v}</span> },
];

export default function VCPage() {
  const { vcStartups, vcSummary } = usePortfolio();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">VC Startups</h2>

      <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 text-amber-400 text-sm flex items-center gap-2">
        <AlertTriangle size={16} />
        Los múltiplos son no realizados. Solo el capital invertido cuenta en el total de cartera.
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KPI label="Capital Invertido" value={vcSummary.totalInvested} icon={Rocket} />
        <KPI label="Valor No Realizado" value={vcSummary.totalCurrentValue} icon={TrendingUp} />
        <KPI label="Ganancia No Realizada" value={vcSummary.totalCurrentValue - vcSummary.totalInvested} change={vcSummary.totalInvested ? (((vcSummary.totalCurrentValue - vcSummary.totalInvested) / vcSummary.totalInvested) * 100).toFixed(1) : 0} />
      </div>

      <Card title="Fondos de Venture Capital" subtitle="Múltiplos como referencia — solo capital invertido en totales">
        <DataTable columns={columns} data={vcStartups} />
      </Card>
    </div>
  );
}
