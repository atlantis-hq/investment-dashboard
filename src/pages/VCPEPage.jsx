import KPI from '../components/KPI';
import Card from '../components/Card';
import DataTable from '../components/DataTable';
import { usePortfolio } from '../hooks/usePortfolioData';
import { Rocket } from 'lucide-react';

const fmt = (v) => '€' + (v || 0).toLocaleString('es-ES');

const directCols = [
  { key: 'name', label: 'Inversión', render: (v) => <span className="font-medium text-white">{v}</span> },
  { key: 'invested', label: 'Invertido', align: 'right', render: (v) => <span className="text-[#94a3b8]">{fmt(v)}</span> },
  { key: 'valuation', label: 'Valoración', align: 'right', render: (v) => <span className="text-white font-medium">{fmt(v)}</span> },
  { key: 'vintage', label: 'Año', align: 'right', render: (v) => <span className="text-[#94a3b8]">{v}</span> },
  { key: 'status', label: 'Estado', render: (v) => <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/15 text-green-400">{v}</span> },
];

const fundCols = [
  { key: 'name', label: 'Fondo', render: (v) => <span className="font-medium text-white">{v}</span> },
  { key: 'committed', label: 'Comprometido', align: 'right', render: (v) => <span className="text-[#94a3b8]">{fmt(v)}</span> },
  { key: 'called', label: 'Llamado', align: 'right', render: (v) => <span className="text-white">{fmt(v)}</span> },
  { key: 'nav', label: 'NAV', align: 'right', render: (v) => <span className="text-white font-medium">{fmt(v)}</span> },
  { key: 'tvpi', label: 'TVPI', align: 'right', render: (v) => <span className="text-[#f59e0b]">{v}x</span> },
  { key: 'vintage', label: 'Año', align: 'right', render: (v) => <span className="text-[#94a3b8]">{v}</span> },
];

export default function VCPEPage() {
  const { vcPe, vcPeFunds } = usePortfolio();
  const totalDirect = vcPe.reduce((s, v) => s + v.invested, 0);
  const totalFunds = vcPeFunds.reduce((s, v) => s + v.called, 0);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Venture Capital + Private Equity</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KPI label="Inversión Directa" value={totalDirect} icon={Rocket} />
        <KPI label="Fondos (Capital Llamado)" value={totalFunds} />
        <KPI label="Total Expuesto" value={totalDirect + totalFunds} />
      </div>
      <Card title="Inversiones Directas (VC + PE)">
        <DataTable columns={directCols} data={vcPe} />
      </Card>
      <Card title="Fondos de VC + PE">
        <DataTable columns={fundCols} data={vcPeFunds} />
      </Card>
    </div>
  );
}
