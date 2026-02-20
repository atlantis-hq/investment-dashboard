import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Wallet, TrendingUp, PiggyBank, Target } from 'lucide-react';
import KPI from '../components/KPI';
import Card from '../components/Card';
import DataTable from '../components/DataTable';
import { usePortfolio } from '../hooks/usePortfolioData';

const fmt = (v) => '€' + (v || 0).toLocaleString('es-ES');
const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-[#1a2035] border border-[#1e293b] rounded-lg p-3 text-xs shadow-xl">
      <p className="font-semibold text-white">{d.name}</p>
      <p className="text-[#94a3b8]">Invertido: {fmt(d.invested)}</p>
      <p className="text-[#94a3b8]">Valor: {fmt(d.value)}</p>
      <p className="text-[#94a3b8]">Rentabilidad: {d.return}%</p>
    </div>
  );
};

export default function Overview() {
  const { portfolioSummary: ps, categoryAllocation } = usePortfolio();

  const columns = [
    { key: 'name', label: 'Categoría', render: (v, row) => (
      <div className="flex items-center gap-2">
        <div className="w-2.5 h-2.5 rounded-full" style={{ background: row.color }} />
        <span className="font-medium text-white">{v}</span>
      </div>
    )},
    { key: 'invested', label: 'Invertido', align: 'right', render: (v) => <span className="text-[#94a3b8]">{fmt(v)}</span> },
    { key: 'value', label: 'Valor Actual', align: 'right', render: (v) => <span className="text-white font-medium">{fmt(v)}</span> },
    { key: 'return', label: 'Rentabilidad', align: 'right', render: (v) => (
      <span className={v >= 0 ? 'text-[#10b981]' : 'text-[#ef4444]'}>{v >= 0 ? '+' : ''}{v}%</span>
    )},
    { key: 'pct', label: '% Portfolio', align: 'right', render: (_, row) => {
      const pct = ps.totalInvested ? ((row.invested / ps.totalInvested) * 100).toFixed(1) : '0';
      return <span className="text-[#94a3b8]">{pct}%</span>;
    }},
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Resumen del Portfolio</h2>
        <p className="text-[#94a3b8] text-sm mt-1">Datos reales · 20 Feb 2026</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPI label="Total Invertido" value={ps.totalInvested} icon={PiggyBank} />
        <KPI label="Valor Actual*" value={ps.totalValue} icon={Wallet} />
        <KPI label="Beneficio" value={ps.totalReturn} change={ps.totalReturnPct} icon={TrendingUp} />
        <KPI label="Categorías" value={categoryAllocation.length} prefix="" icon={Target} />
      </div>

      <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 text-amber-400 text-xs">
        * PE y VC Startups: solo capital invertido en totales. Los múltiplos no realizados se muestran como referencia.
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Distribución del Portfolio" subtitle="Por capital invertido">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={categoryAllocation} cx="50%" cy="50%" innerRadius={70} outerRadius={120} dataKey="invested" stroke="none">
                {categoryAllocation.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend formatter={(value) => <span className="text-[#94a3b8] text-xs">{value}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Rentabilidad por Categoría" subtitle="% de retorno">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryAllocation} layout="vertical" margin={{ left: 10 }}>
              <XAxis type="number" tick={{ fill: '#94a3b8', fontSize: 11 }} tickFormatter={(v) => v + '%'} />
              <YAxis type="category" dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} width={120} />
              <Tooltip formatter={(v) => v + '%'} contentStyle={{ background: '#1a2035', border: '1px solid #1e293b', borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="return" radius={[0, 4, 4, 0]}>
                {categoryAllocation.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card title="Detalle por Categoría">
        <DataTable columns={columns} data={categoryAllocation} />
      </Card>
    </div>
  );
}
