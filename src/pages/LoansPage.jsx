import { useState, useMemo } from 'react';
import {
  ArrowLeft,
  Handshake,
  TrendingUp,
  Clock,
  Target,
} from 'lucide-react';
import { usePortfolio } from '../hooks/usePortfolioData';
import { useColors } from '../hooks/useColors';
import Card from '../components/Card';
import KPI from '../components/KPI';
import Badge from '../components/Badge';
import ProgressBar from '../components/ProgressBar';

const fmt = (v) => '€' + Math.round(v || 0).toLocaleString('es-ES');
const fmtDec = (v) =>
  '€' + (v || 0).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function LoansPage({ setPage }) {
  const { loans, loansSummary: ls } = usePortfolio();
  const c = useColors();
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('vencimiento');

  const now = new Date();

  const withMeta = useMemo(
    () =>
      loans.map((l) => {
        const [d, m, y] = l.endDate.split('/');
        const end = new Date(+y, +m - 1, +d);
        const days = Math.ceil((end - now) / 86400000);
        const total = l.cuotasPagadas + l.cuotasRestantes;
        const pct = l.cuotasPagadas / total;
        let bucket;
        if (days <= 30) bucket = 'urgent';
        else if (days <= 90) bucket = 'soon';
        else bucket = 'active';
        return { ...l, daysLeft: days, pct, bucket };
      }),
    [loans] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const counts = {
    all: withMeta.length,
    urgent: withMeta.filter((l) => l.bucket === 'urgent').length,
    soon: withMeta.filter((l) => l.bucket === 'soon').length,
    active: withMeta.filter((l) => l.bucket === 'active').length,
  };

  const filtered = useMemo(() => {
    let arr = withMeta;
    if (filter !== 'all') arr = arr.filter((l) => l.bucket === filter);
    if (sort === 'vencimiento') arr = [...arr].sort((a, b) => a.daysLeft - b.daysLeft);
    else if (sort === 'tir') arr = [...arr].sort((a, b) => b.tir - a.tir);
    else if (sort === 'capital') arr = [...arr].sort((a, b) => b.capital - a.capital);
    return arr;
  }, [filter, sort, withMeta]);

  // Timeline: next 14 months
  const timeline = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 14; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
      arr.push({
        key: d.toLocaleDateString('es-ES', { month: 'short', year: '2-digit' }),
        date: d,
        loans: [],
      });
    }
    withMeta.forEach((l) => {
      const [dd, mm, yy] = l.endDate.split('/');
      const end = new Date(+yy, +mm - 1, +dd);
      const idx = arr.findIndex(
        (t) =>
          t.date.getFullYear() === end.getFullYear() &&
          t.date.getMonth() === end.getMonth()
      );
      if (idx >= 0) arr[idx].loans.push(l);
    });
    return arr;
  }, [withMeta]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="bc-fade" style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <button
          onClick={() => setPage('overview')}
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            background: c.card,
            border: `1px solid ${c.border}`,
            color: c.textSecondary,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'inherit',
          }}
        >
          <ArrowLeft size={17} />
        </button>
        <div>
          <p
            style={{
              fontSize: 11,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: c.purple,
              fontWeight: 500,
            }}
          >
            Préstamos P2P
          </p>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginTop: 4 }}>
            <h1
              style={{
                fontSize: 30,
                fontWeight: 800,
                letterSpacing: '-0.02em',
                color: c.text,
              }}
            >
              Préstamos
            </h1>
            <span style={{ fontSize: 13, color: c.textMuted }}>
              {loans.length} activos en Habitalia
            </span>
          </div>
        </div>
      </div>

      {/* KPI row */}
      <div
        style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}
        className="kpi-grid"
      >
        <KPI
          label="Capital total"
          value={fmt(ls.totalCapital)}
          sub={loans.length + ' préstamos'}
          icon={Handshake}
          iconColor={c.purple}
        />
        <KPI
          label="Intereses cobrados"
          value={fmt(ls.totalInterestEarned)}
          sub="Acumulado"
          valueColor={c.green}
          icon={TrendingUp}
          iconColor={c.green}
        />
        <KPI
          label="Capital pendiente"
          value={fmt(ls.totalPending)}
          sub="Por amortizar"
          icon={Clock}
          iconColor={c.amber}
        />
        <KPI
          label="TIR media"
          value={ls.avgTir + '%'}
          sub="Ponderada"
          valueColor={c.gold}
          icon={Target}
          iconColor={c.gold}
        />
      </div>

      {/* Timeline */}
      <Card
        title="Timeline de vencimientos"
        subtitle="Distribución en los próximos 14 meses"
        pad={22}
      >
        <div
          style={{
            display: 'flex',
            gap: 3,
            alignItems: 'flex-end',
            height: 110,
            marginBottom: 10,
          }}
        >
          {timeline.map((t) => {
            const n = t.loans.length;
            const height = Math.max(n * 22, n > 0 ? 8 : 2);
            const cap = t.loans.reduce((s, l) => s + l.capitalPending, 0);
            const urgent = t.loans.some((l) => l.bucket === 'urgent');
            return (
              <div
                key={t.key}
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                {n > 0 && (
                  <span
                    style={{
                      fontSize: 9,
                      color: c.textMuted,
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    {fmt(cap)}
                  </span>
                )}
                <div
                  title={t.key + ': ' + n + ' préstamos'}
                  style={{
                    width: '100%',
                    height,
                    background: n === 0 ? c.border : urgent ? c.red : c.purple,
                    opacity: n === 0 ? 0.3 : 1,
                    borderRadius: 4,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontSize: 10,
                    fontWeight: 600,
                  }}
                >
                  {n > 0 && n}
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ display: 'flex', gap: 3 }}>
          {timeline.map((t) => (
            <span
              key={t.key}
              style={{
                flex: 1,
                fontSize: 9,
                color: c.textMuted,
                textAlign: 'center',
                textTransform: 'capitalize',
              }}
            >
              {t.key.split(' ')[0]}
            </span>
          ))}
        </div>
      </Card>

      {/* Filters */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          flexWrap: 'wrap',
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: 6,
            background: c.card,
            border: `1px solid ${c.border}`,
            padding: 4,
            borderRadius: 10,
            flexWrap: 'wrap',
          }}
        >
          {[
            { id: 'all', label: 'Todos', color: c.textSecondary, count: counts.all },
            { id: 'urgent', label: 'Urgente (<30d)', color: c.red, count: counts.urgent },
            { id: 'soon', label: 'Próximo (<90d)', color: c.amber, count: counts.soon },
            { id: 'active', label: 'Activo', color: c.green, count: counts.active },
          ].map((f) => {
            const active = filter === f.id;
            return (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                style={{
                  background: active
                    ? f.id === 'all'
                      ? c.goldBg
                      : f.color + '22'
                    : 'transparent',
                  color: active ? (f.id === 'all' ? c.gold : f.color) : c.textSecondary,
                  border: 'none',
                  padding: '7px 14px',
                  borderRadius: 8,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  fontSize: 12,
                  fontWeight: 500,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                {f.label}
                <span
                  style={{
                    fontSize: 10,
                    background: active ? 'rgba(255,255,255,0.1)' : c.border,
                    padding: '1px 6px',
                    borderRadius: 999,
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {f.count}
                </span>
              </button>
            );
          })}
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontSize: 12,
            color: c.textSecondary,
          }}
        >
          <span>Ordenar por</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            style={{
              background: c.card,
              border: `1px solid ${c.border}`,
              color: c.text,
              padding: '6px 10px',
              borderRadius: 8,
              fontFamily: 'inherit',
              fontSize: 12,
              cursor: 'pointer',
            }}
          >
            <option value="vencimiento">Vencimiento</option>
            <option value="tir">TIR</option>
            <option value="capital">Capital</option>
          </select>
        </div>
      </div>

      {/* Loan rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {filtered.map((l) => {
          const total = l.cuotasPagadas + l.cuotasRestantes;
          const pct = l.pct * 100;
          const badgeColor =
            l.bucket === 'urgent' ? c.red : l.bucket === 'soon' ? c.amber : c.green;
          const badgeBg =
            l.bucket === 'urgent' ? c.redBg : l.bucket === 'soon' ? c.amberBg : c.greenBg;
          const badgeBorder =
            l.bucket === 'urgent'
              ? c.redBorder
              : l.bucket === 'soon'
              ? c.amberBorder
              : c.greenBorder;
          const badgeLabel =
            l.bucket === 'urgent'
              ? l.daysLeft + ' días'
              : l.bucket === 'soon'
              ? l.daysLeft + ' días'
              : 'Activo';
          return (
            <div
              key={l.id}
              style={{
                background: c.card,
                border: `1px solid ${c.border}`,
                borderRadius: 12,
                padding: '14px 18px',
                display: 'grid',
                gridTemplateColumns: '48px 1.4fr 1fr 1fr 1.2fr 130px',
                gap: 18,
                alignItems: 'center',
              }}
              className="loan-row"
            >
              <span
                style={{
                  fontFamily: 'ui-monospace, Menlo, monospace',
                  fontSize: 11,
                  color: c.textMuted,
                }}
              >
                #{String(l.id).padStart(2, '0')}
              </span>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: c.text }}>
                    {l.project}
                  </span>
                  <Badge color={badgeColor} bg={badgeBg} border={badgeBorder}>
                    {badgeLabel}
                  </Badge>
                </div>
                <p style={{ fontSize: 11, color: c.textMuted, marginTop: 3 }}>
                  {l.startDate} → {l.endDate}
                </p>
              </div>
              <div>
                <p
                  style={{
                    fontSize: 10,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    color: c.textSecondary,
                  }}
                >
                  Capital
                </p>
                <p
                  style={{
                    fontSize: 13,
                    color: c.text,
                    marginTop: 2,
                    fontVariantNumeric: 'tabular-nums',
                    fontWeight: 500,
                  }}
                >
                  {fmtDec(l.capital)}
                </p>
              </div>
              <div>
                <p
                  style={{
                    fontSize: 10,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    color: c.textSecondary,
                  }}
                >
                  TIR
                </p>
                <p
                  style={{
                    fontSize: 13,
                    color: c.gold,
                    marginTop: 2,
                    fontVariantNumeric: 'tabular-nums',
                    fontWeight: 600,
                  }}
                >
                  {l.tir}%
                </p>
              </div>
              <div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: 11,
                    color: c.textSecondary,
                    marginBottom: 4,
                  }}
                >
                  <span>Amortizado</span>
                  <span style={{ fontVariantNumeric: 'tabular-nums', color: c.text }}>
                    {l.cuotasPagadas}/{total}
                  </span>
                </div>
                <ProgressBar
                  value={l.cuotasPagadas}
                  max={total}
                  color={l.bucket === 'urgent' ? c.red : c.purple}
                  height={5}
                />
                <p
                  style={{
                    fontSize: 10,
                    color: c.textMuted,
                    marginTop: 3,
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {pct.toFixed(0)}% · {fmt(l.capitalPending)} pendiente
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p
                  style={{
                    fontSize: 10,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    color: c.textSecondary,
                  }}
                >
                  Intereses
                </p>
                <p
                  style={{
                    fontSize: 13,
                    color: c.green,
                    marginTop: 2,
                    fontVariantNumeric: 'tabular-nums',
                    fontWeight: 600,
                  }}
                >
                  {fmtDec(l.interestEarned)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
