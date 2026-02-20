import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import KPI from '../components/KPI';
import Card from '../components/Card';
import DataTable from '../components/DataTable';
import { usePortfolio } from '../hooks/usePortfolioData';
import { Handshake, TrendingUp, CheckCircle, Clock } from 'lucide-react';

const fmt = (v) => '€' + (v || 0).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const columns = [
  { key: 'id', label: '#', render: (v) => <span className="text-[#64748b] font-mono">{v}</span> },
  { key: 'project', label: 'Préstamo', render: (v) => <span className="font-medium text-white text-xs">{v}</span> },
  { key: 'capital', label: 'Capital', align: 'right', render: (v) => <span className="text-[#94a3b8]">{fmt(v)}</span> },
  { key: 'tir', label: 'TIR', align: 'right', render: (v) => <span className="text-[#f59e0b] font-medium">{v}%</span> },
  { key: 'startDate', label: 'Inicio', render: (v) => <span className="text-[#94a3b8] text-xs">{v}</span> },
  { key: 'endDate', label: 'Vencimiento', render: (v) => <span className="text-[#94a3b8] text-xs">{v}</span> },
  { key: 'cuotasPagadas', label: 'Pagadas', align: 'right', render: (v, row) => <span className="text-[#94a3b8]">{v}/{v + row.cuotasRestantes}</span> },
  { key: 'interestEarned', label: 'Intereses Cobrados', align: 'right', render: (v) => <span className="text-[#10b981]">{fmt(v)}</span> },
  { key: 'capitalPending', label: 'Cap. Pendiente', align: 'right', render: (v) => <span className="text-white">{fmt(v)}</span> },
];

export default function LoansPage() {
  const { loans, loansSummary: ls } = usePortfolio();
  const tirData = loans.map(l => ({ name: `#${l.id}`, tir: l.tir }));

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Préstamos Habitalia</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPI label="Capital Total" value={ls.totalCapital} icon={Handshake} />
        <KPI label="Intereses Cobrados" value={ls.totalInterestEarned} icon={TrendingUp} />
        <KPI label="Capital Pendiente" value={ls.totalPending} icon={Clock} />
        <KPI label="TIR Media" value={ls.avgTir + '%'} prefix="" icon={CheckCircle} />
      </div>

      <Card title="TIR por Préstamo">
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={tirData}>
            <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 10 }} />
            <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} tickFormatter={(v) => v + '%'} domain={[0, 15]} />
            <Tooltip contentStyle={{ background: '#1a2035', border: '1px solid #1e293b', borderRadius: 8, fontSize: 12 }} formatter={(v) => v + '%'} />
            <Bar dataKey="tir" radius={[3, 3, 0, 0]} fill="#8b5cf6" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card title={`${loans.length} Préstamos — Capital: ${fmt(ls.totalCapital)} — Intereses: ${fmt(ls.totalInterestEarned)}`}>
        <DataTable columns={columns} data={loans} />
      </Card>
    </div>
  );
}
