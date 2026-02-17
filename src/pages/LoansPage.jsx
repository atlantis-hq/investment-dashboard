import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import KPI from '../components/KPI';
import Card from '../components/Card';
import DataTable from '../components/DataTable';
import { loans, loansSummary as ls } from '../data/portfolio';
import { Handshake, TrendingUp, CheckCircle, Clock } from 'lucide-react';

const fmt = (v) => '€' + v.toLocaleString('es-ES');

const tirData = loans.map(l => ({ name: `#${l.id}`, tir: l.tir, platform: l.platform }));

const columns = [
  { key: 'id', label: '#', render: (v) => <span className="text-[#64748b] font-mono">{v}</span> },
  { key: 'platform', label: 'Plataforma', render: (v) => (
    <span className={`text-xs px-2 py-0.5 rounded-full ${v === 'Habitalia' ? 'bg-purple-500/15 text-purple-400' : 'bg-cyan-500/15 text-cyan-400'}`}>{v}</span>
  )},
  { key: 'project', label: 'Proyecto', render: (v) => <span className="font-medium text-white text-xs">{v}</span> },
  { key: 'capital', label: 'Capital', align: 'right', render: (v) => <span className="text-[#94a3b8]">{fmt(v)}</span> },
  { key: 'tir', label: 'TIR', align: 'right', render: (v) => <span className="text-[#f59e0b] font-medium">{v}%</span> },
  { key: 'term', label: 'Plazo', align: 'right', render: (v) => <span className="text-[#94a3b8]">{v}m</span> },
  { key: 'interestEarned', label: 'Intereses', align: 'right', render: (v) => <span className="text-[#10b981]">{fmt(v)}</span> },
  { key: 'status', label: 'Estado', render: (v) => (
    <span className={`text-xs px-2 py-0.5 rounded-full ${v === 'Activo' ? 'bg-green-500/15 text-green-400' : 'bg-blue-500/15 text-blue-400'}`}>{v}</span>
  )},
  { key: 'capitalPending', label: 'Pendiente', align: 'right', render: (v) => <span className="text-white">{fmt(v)}</span> },
];

export default function LoansPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Préstamos</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPI label="Capital Total" value={ls.totalCapital} icon={Handshake} />
        <KPI label="Intereses Generados" value={ls.totalInterestEarned} icon={TrendingUp} />
        <KPI label="Activos / Amortizados" value={`${ls.activeCount} / ${ls.completedCount}`} prefix="" icon={CheckCircle} />
        <KPI label="TIR Media" value={ls.avgTir + '%'} prefix="" icon={Clock} />
      </div>

      <Card title="TIR por Préstamo" subtitle="Tasa Interna de Retorno de cada proyecto">
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={tirData}>
            <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 10 }} />
            <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} tickFormatter={(v) => v + '%'} domain={[0, 15]} />
            <Tooltip contentStyle={{ background: '#1a2035', border: '1px solid #1e293b', borderRadius: 8, fontSize: 12 }} formatter={(v) => v + '%'} />
            <Bar dataKey="tir" radius={[3, 3, 0, 0]}>
              {tirData.map((entry, i) => <Cell key={i} fill={entry.platform === 'Habitalia' ? '#8b5cf6' : '#06b6d4'} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card title="Detalle de Préstamos" subtitle={`${loans.length} préstamos — Capital: ${fmt(ls.totalCapital)} — Intereses: ${fmt(ls.totalInterestEarned)}`}>
        <DataTable columns={columns} data={loans} />
      </Card>
    </div>
  );
}
