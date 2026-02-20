import KPI from '../components/KPI';
import Card from '../components/Card';
import DataTable from '../components/DataTable';
import { usePortfolio } from '../hooks/usePortfolioData';
import { Shield, TrendingUp } from 'lucide-react';

const fmt = (v) => '€' + (v || 0).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const columns = [
  { key: 'name', label: 'Producto', render: (v) => <span className="font-medium text-white">{v}</span> },
  { key: 'capital', label: 'Capital', align: 'right', render: (v) => <span className="text-[#94a3b8]">{fmt(v)}</span> },
  { key: 'tae', label: 'TAE', align: 'right', render: (v) => <span className="text-[#10b981] font-medium">{v}%</span> },
  { key: 'startDate', label: 'Fecha Inicio', render: (v) => <span className="text-[#94a3b8]">{v}</span> },
  { key: 'interestAccrued', label: 'Interés Acumulado', align: 'right', render: (v) => <span className="text-[#10b981]">+{fmt(v)}</span> },
  { key: 'currentValue', label: 'Valor Actual', align: 'right', render: (v) => <span className="text-white font-medium">{fmt(v)}</span> },
  { key: 'status', label: 'Estado', render: (v) => <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/15 text-green-400">{v}</span> },
];

export default function RentaFijaPage() {
  const { rentaFija } = usePortfolio();
  const totalCapital = rentaFija.reduce((s, r) => s + r.capital, 0);
  const totalValue = rentaFija.reduce((s, r) => s + r.currentValue, 0);
  const totalInterest = rentaFija.reduce((s, r) => s + r.interestAccrued, 0);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Renta Fija</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KPI label="Valor Total" value={totalValue} icon={Shield} />
        <KPI label="Capital Invertido" value={totalCapital} />
        <KPI label="Intereses Acumulados" value={totalInterest} change={totalCapital ? ((totalInterest / totalCapital) * 100).toFixed(2) : 0} icon={TrendingUp} />
      </div>
      <Card title="Detalle de Renta Fija">
        <DataTable columns={columns} data={rentaFija} />
      </Card>
    </div>
  );
}
