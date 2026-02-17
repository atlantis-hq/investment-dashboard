import KPI from '../components/KPI';
import Card from '../components/Card';
import DataTable from '../components/DataTable';
import { monetaryFunds } from '../data/portfolio';
import { Landmark } from 'lucide-react';

const fmt = (v) => '€' + v.toLocaleString('es-ES');
const total = monetaryFunds.reduce((s, f) => s + f.current, 0);

const columns = [
  { key: 'name', label: 'Nombre', render: (v) => <span className="font-medium text-white">{v}</span> },
  { key: 'type', label: 'Tipo', render: (v) => <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-400">{v}</span> },
  { key: 'invested', label: 'Invertido', align: 'right', render: (v) => <span className="text-[#94a3b8]">{fmt(v)}</span> },
  { key: 'current', label: 'Valor Actual', align: 'right', render: (v) => <span className="text-white font-medium">{fmt(v)}</span> },
  { key: 'rate', label: 'Tipo Interés', align: 'right', render: (v) => <span className="text-[#06b6d4]">{v}%</span> },
];

export default function MonetaryPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Fondos Monetarios</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <KPI label="Valor Total" value={total} icon={Landmark} />
        <KPI label="Tipo Medio" value={(monetaryFunds.reduce((s, f) => s + f.rate, 0) / monetaryFunds.length).toFixed(2)} prefix="" change={1.69} />
      </div>
      <Card title="Detalle de Fondos Monetarios">
        <DataTable columns={columns} data={monetaryFunds} />
      </Card>
    </div>
  );
}
