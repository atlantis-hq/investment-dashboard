import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import KPI from '../components/KPI';
import Card from '../components/Card';
import DataTable from '../components/DataTable';
import { crypto } from '../data/portfolio';
import { Bitcoin, TrendingUp } from 'lucide-react';

const fmt = (v) => '€' + v.toLocaleString('es-ES');
const totalInvested = crypto.reduce((s, c) => s + c.invested, 0);
const totalCurrent = crypto.reduce((s, c) => s + c.current, 0);
const colors = ['#f7931a', '#627eea', '#9945ff', '#375bd2', '#2775ca'];

const columns = [
  { key: 'name', label: 'Activo', render: (v, row) => (
    <div><span className="font-medium text-white">{v}</span>{row.ticker && <span className="ml-2 text-xs text-[#64748b]">{row.ticker}</span>}</div>
  )},
  { key: 'amount', label: 'Cantidad', align: 'right', render: (v) => <span className="text-[#94a3b8]">{v ?? '—'}</span> },
  { key: 'invested', label: 'Invertido', align: 'right', render: (v) => <span className="text-[#94a3b8]">{fmt(v)}</span> },
  { key: 'current', label: 'Valor Actual', align: 'right', render: (v) => <span className="text-white font-medium">{fmt(v)}</span> },
  { key: 'returnPct', label: 'Rentabilidad', align: 'right', render: (_, row) => {
    const r = ((row.current - row.invested) / row.invested * 100).toFixed(1);
    return <span className={r >= 0 ? 'text-[#10b981]' : 'text-[#ef4444]'}>{r >= 0 ? '+' : ''}{r}%</span>;
  }},
];

export default function CryptoPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Criptomonedas</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KPI label="Valor Total" value={totalCurrent} icon={Bitcoin} />
        <KPI label="Total Invertido" value={totalInvested} />
        <KPI label="Beneficio" value={totalCurrent - totalInvested} change={((totalCurrent - totalInvested) / totalInvested * 100).toFixed(1)} icon={TrendingUp} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card title="Distribución Crypto" className="lg:col-span-1">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={crypto} cx="50%" cy="50%" innerRadius={50} outerRadius={90} dataKey="current" stroke="none">
                {crypto.map((_, i) => <Cell key={i} fill={colors[i]} />)}
              </Pie>
              <Tooltip formatter={(v) => fmt(v)} contentStyle={{ background: '#1a2035', border: '1px solid #1e293b', borderRadius: 8, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
        <Card title="Detalle de Criptomonedas" className="lg:col-span-2">
          <DataTable columns={columns} data={crypto} />
        </Card>
      </div>
    </div>
  );
}
