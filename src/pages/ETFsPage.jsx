import KPI from '../components/KPI';
import Card from '../components/Card';
import DataTable from '../components/DataTable';
import { etfsFunds } from '../data/portfolio';
import { TrendingUp, Wallet } from 'lucide-react';

const fmt = (v) => '€' + v.toLocaleString('es-ES');
const totalInvested = etfsFunds.reduce((s, f) => s + f.invested, 0);
const totalCurrent = etfsFunds.reduce((s, f) => s + f.current, 0);

const columns = [
  { key: 'name', label: 'Nombre', render: (v, row) => (
    <div><span className="font-medium text-white">{v}</span><span className="ml-2 text-xs text-[#64748b]">{row.ticker}</span></div>
  )},
  { key: 'type', label: 'Tipo', render: (v) => (
    <span className={`text-xs px-2 py-0.5 rounded-full ${v === 'ETF' ? 'bg-blue-500/15 text-blue-400' : 'bg-purple-500/15 text-purple-400'}`}>{v}</span>
  )},
  { key: 'invested', label: 'Invertido', align: 'right', render: (v) => <span className="text-[#94a3b8]">{fmt(v)}</span> },
  { key: 'current', label: 'Valor Actual', align: 'right', render: (v) => <span className="text-white font-medium">{fmt(v)}</span> },
  { key: 'returnPct', label: 'Rentabilidad', align: 'right', render: (v) => <span className="text-[#10b981]">+{v}%</span> },
];

export default function ETFsPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">ETFs + Fondos Indexados</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KPI label="Valor Total" value={totalCurrent} icon={Wallet} />
        <KPI label="Total Invertido" value={totalInvested} />
        <KPI label="Beneficio" value={totalCurrent - totalInvested} change={((totalCurrent - totalInvested) / totalInvested * 100).toFixed(1)} icon={TrendingUp} />
      </div>
      <Card title="Detalle de Fondos y ETFs">
        <DataTable columns={columns} data={etfsFunds} />
      </Card>
    </div>
  );
}
