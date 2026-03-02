import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import Card from '../components/Card';
import DataTable from '../components/DataTable';
import PageHeader from '../components/PageHeader';
import { AccordionCard } from '../components/MobileCard';
import { usePortfolio } from '../hooks/usePortfolioData';
import { useIsMobile } from '../hooks/useMediaQuery';
import { useColors } from '../hooks/useColors';

const fmt = (v) => '€' + (v || 0).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtShort = (v) => '€' + (v || 0).toLocaleString('es-ES', { maximumFractionDigits: 0 });

export default function LoansPage({ setPage }) {
  const { loans, loansSummary: ls } = usePortfolio();
  const isMobile = useIsMobile();
  const c = useColors();
  const tirData = loans.map(l => ({ name: `#${l.id}`, tir: l.tir }));

  const columns = [
    { key: 'id', label: '#', render: (v) => <span style={{ color: c.textMuted }} className="font-mono text-xs">{v}</span> },
    { key: 'project', label: 'Préstamo', render: (v) => <span style={{ color: c.text }} className="font-medium text-xs">{v}</span> },
    { key: 'capital', label: 'Capital', align: 'right', render: (v) => <span style={{ color: c.textSecondary }}>{fmt(v)}</span> },
    { key: 'tir', label: 'TIR', align: 'right', render: (v) => <span style={{ color: c.amber }} className="font-medium">{v}%</span> },
    { key: 'startDate', label: 'Inicio', render: (v) => <span style={{ color: c.textSecondary }} className="text-xs">{v}</span> },
    { key: 'endDate', label: 'Vencimiento', render: (v) => <span style={{ color: c.textSecondary }} className="text-xs">{v}</span> },
    { key: 'cuotasPagadas', label: 'Pagadas', align: 'right', render: (v, row) => {
      const total = v + row.cuotasRestantes;
      const pct = ((v / total) * 100).toFixed(0);
      return (
        <div className="flex items-center gap-2 justify-end">
          <div className="w-12 h-1.5 rounded-full overflow-hidden" style={{ background: c.barTrack }}>
            <div className="h-full rounded-full" style={{ width: `${pct}%`, background: c.purple }} />
          </div>
          <span style={{ color: c.textSecondary }} className="text-xs">{v}/{total}</span>
        </div>
      );
    }},
    { key: 'interestEarned', label: 'Intereses', align: 'right', render: (v) => <span style={{ color: c.green }} className="font-medium">{fmt(v)}</span> },
    { key: 'capitalPending', label: 'Pendiente', align: 'right', render: (v) => <span style={{ color: c.text }}>{fmt(v)}</span> },
  ];

  return (
    <div className="space-y-8">
      <PageHeader title="Préstamos" subtitle={`${loans.length} préstamos activos en Habitalia`} icon="🏦" setPage={setPage} />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Capital Total', value: fmtShort(ls.totalCapital), sub: `${loans.length} préstamos`, color: c.text },
          { label: 'Intereses Cobrados', value: fmtShort(ls.totalInterestEarned), sub: 'Acumulado', color: c.green },
          { label: 'Capital Pendiente', value: fmtShort(ls.totalPending), sub: 'Por amortizar', color: c.text },
          { label: 'TIR Media', value: ls.avgTir + '%', sub: 'Ponderada', color: c.amber },
        ].map((kpi) => (
          <div key={kpi.label} className="rounded-2xl p-5" style={{ background: c.card, border: `1px solid ${c.border}` }}>
            <span className="text-xs uppercase tracking-wider" style={{ color: c.textSecondary }}>{kpi.label}</span>
            <p className="text-xl font-bold mt-2" style={{ color: kpi.color }}>{kpi.value}</p>
            <p className="text-[10px] mt-1" style={{ color: c.textMuted }}>{kpi.sub}</p>
          </div>
        ))}
      </div>

      {!isMobile && (
        <Card title="TIR por Préstamo">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={tirData}>
              <XAxis dataKey="name" tick={{ fill: c.textSecondary, fontSize: 10 }} />
              <YAxis tick={{ fill: c.textSecondary, fontSize: 11 }} tickFormatter={(v) => v + '%'} domain={[0, 15]} />
              <Tooltip contentStyle={{ background: c.tooltipBg, border: `1px solid ${c.tooltipBorder}`, borderRadius: 8, fontSize: 12 }} formatter={(v) => v + '%'} />
              <Bar dataKey="tir" radius={[3, 3, 0, 0]} fill={c.purple} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      )}

      {isMobile ? (
        <div className="space-y-3">
          {loans.map((loan) => (
            <AccordionCard
              key={loan.id}
              title={loan.project}
              accent={c.purple}
              badge={`${loan.tir}% TIR`}
              summaryFields={[
                { label: 'Capital', value: fmtShort(loan.capital) },
                { label: 'Intereses', value: fmt(loan.interestEarned), color: 'text-[#10b981]' },
              ]}
              fields={[
                { label: 'Capital Inicial', value: fmt(loan.capital) },
                { label: 'TIR', value: `${loan.tir}%` },
                { label: 'Inicio', value: loan.startDate },
                { label: 'Vencimiento', value: loan.endDate },
                { label: 'Cuotas', value: `${loan.cuotasPagadas}/${loan.cuotasPagadas + loan.cuotasRestantes}` },
                { label: 'Intereses', value: fmt(loan.interestEarned), color: 'text-[#10b981]' },
                { label: 'Pendiente', value: fmt(loan.capitalPending) },
              ]}
            />
          ))}
        </div>
      ) : (
        <Card>
          <DataTable columns={columns} data={loans} />
        </Card>
      )}
    </div>
  );
}
