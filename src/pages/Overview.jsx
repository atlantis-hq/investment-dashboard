import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Wallet, TrendingUp, PiggyBank, Target, RefreshCw, Wifi, WifiOff } from 'lucide-react';
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
      <p className="text-[#94a3b8]">Valor: {fmt(d.value)}</p>
      <p className="text-[#94a3b8]">Rentabilidad: {d.return}%</p>
    </div>
  );
};

export default function Overview() {
  const { portfolioSummary: ps, categoryAllocation, loading, error, isLive, lastUpdated, refresh } = usePortfolio();

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
      const pct = ps.totalValue ? ((row.value / ps.totalValue) * 100).toFixed(1) : '0';
      return <span className="text-[#94a3b8]">{pct}%</span>;
    }},
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Resumen del Portfolio</h2>
          <p className="text-[#94a3b8] text-sm mt-1 flex items-center gap-2">
            {loading ? 'Cargando datos...' : (
              <>
                {isLive ? <Wifi className="w-3 h-3 text-green-400" /> : <WifiOff className="w-3 h-3 text-yellow-400" />}
                {isLive ? 'Datos en vivo de Google Sheets' : 'Datos de respaldo (offline)'}
                {lastUpdated && <span className="text-[#64748b]">· {lastUpdated.toLocaleTimeString('es-ES')}</span>}
              </>
            )}
          </p>
        </div>
        <button onClick={refresh} className="p-2 rounded-lg bg-[#1e293b] hover:bg-[#2d3b4f] text-[#94a3b8] hover:text-white transition-colors" title="Actualizar datos">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {error && (
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 text-yellow-400 text-sm">
          ⚠️ No se pudieron cargar datos en vivo: {error}. Mostrando datos de respaldo.
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPI label="Valor Total" value={ps.totalValue} icon={Wallet} />
        <KPI label="Total Invertido" value={ps.totalInvested} icon={PiggyBank} />
        <KPI label="Beneficio Total" value={ps.totalReturn} change={ps.totalReturnPct} icon={TrendingUp} />
        <KPI label="Categorías" value={categoryAllocation.length} prefix="" icon={Target} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Distribución del Portfolio" subtitle="Por tipo de activo">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={categoryAllocation} cx="50%" cy="50%" innerRadius={70} outerRadius={120} dataKey="value" stroke="none">
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
