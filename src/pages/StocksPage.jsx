import KPI from '../components/KPI';
import Card from '../components/Card';
import DataTable from '../components/DataTable';
import { stocks } from '../data/portfolio';
import { BarChart3, TrendingUp } from 'lucide-react';

const fmt = (v) => '€' + v.toLocaleString('es-ES');
const totalInvested = stocks.reduce((s, c) => s + c.invested, 0);
const totalCurrent = stocks.reduce((s, c) => s + c.current, 0);

const columns = [
  { key: 'name', label: 'Empresa', render: (v, row) => (
    <div><span className="font-medium text-white">{v}</span>{row.ticker && <span className="ml-2 text-xs text-[#64748b]">{row.ticker}</span>}</div>
  )},
  { key: 'shares', label: 'Acciones', align: 'right', render: (v) => <span className="text-[#94a3b8]">{v ?? '—'}</span> },
  { key: 'invested', label: 'Invertido', align: 'right', render: (v) => <span className="text-[#94a3b8]">{fmt(v)}</span> },
  { key: 'current', label: 'Valor Actual', align: 'right', render: (v) => <span className="text-white font-medium">{fmt(v)}</span> },
  { key: 'returnPct', label: 'Rentabilidad', align: 'right', render: (_, row) => {
    const r = ((row.current - row.invested) / row.invested * 100).toFixed(1);
    return <span className={r >= 0 ? 'text-[#10b981]' : 'text-[#ef4444]'}>{r >= 0 ? '+' : ''}{r}%</span>;
  }},
];

export default function StocksPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Renta Variable</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KPI label="Valor Total" value={totalCurrent} icon={BarChart3} />
        <KPI label="Total Invertido" value={totalInvested} />
        <KPI label="Beneficio" value={totalCurrent - totalInvested} change={((totalCurrent - totalInvested) / totalInvested * 100).toFixed(1)} icon={TrendingUp} />
      </div>
      <Card title="Detalle de Acciones">
        <DataTable columns={columns} data={stocks} />
      </Card>
    </div>
  );
}
