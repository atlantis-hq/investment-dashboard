import KPI from '../components/KPI';
import Card from '../components/Card';
import DataTable from '../components/DataTable';
import { usePortfolio } from '../hooks/usePortfolioData';
import { Building2, TrendingUp, AlertTriangle } from 'lucide-react';

const fmt = (v) => '€' + (v || 0).toLocaleString('es-ES');

const columns = [
  { key: 'name', label: 'Empresa', render: (v) => <span className="font-medium text-white">{v}</span> },
  { key: 'participation', label: '% Participación', align: 'right', render: (v) => <span className="text-[#94a3b8]">{v}%</span> },
  { key: 'companyValuation', label: 'Valoración Empresa', align: 'right', render: (v) => <span className="text-[#94a3b8]">{fmt(v)}</span> },
  { key: 'invested', label: 'Capital Invertido', align: 'right', render: (v) => <span className="text-white">{fmt(v)}</span> },
  { key: 'currentValue', label: 'Valor Participación', align: 'right', render: (v) => <span className="text-white font-medium">{fmt(v)}</span> },
  { key: 'multiple', label: 'Múltiplo', align: 'right', render: (v) => (
    <span className={`font-bold ${v >= 1 ? 'text-[#10b981]' : 'text-[#ef4444]'}`}>{v}x</span>
  )},
];

export default function PEPage() {
  const { privateEquity, peSummary } = usePortfolio();
  const totalInvested = peSummary.totalInvested;
  const totalCurrentValue = peSummary.totalCurrentValue;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Private Equity</h2>

      <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 text-amber-400 text-sm flex items-center gap-2">
        <AlertTriangle size={16} />
        Los múltiplos son no realizados. Solo el capital invertido cuenta en el total de cartera.
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KPI label="Capital Invertido" value={totalInvested} icon={Building2} />
        <KPI label="Valor No Realizado" value={totalCurrentValue} icon={TrendingUp} />
        <KPI label="Múltiplo Medio" value={peSummary.totalMultiple + 'x'} prefix="" />
      </div>

      <Card title="Participaciones Directas" subtitle="Valoraciones no realizadas — solo capital invertido en totales">
        <DataTable columns={columns} data={privateEquity} />
      </Card>
    </div>
  );
}
