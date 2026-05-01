import { useState, useMemo } from 'react';
import {
  Droplets,
  Lock,
  AlertTriangle,
  Bell,
  ArrowRight,
  ChevronRight,
  TrendingUp,
  Landmark,
  Bitcoin,
  Shield,
  Handshake,
  Building2,
  Rocket,
  Home,
} from 'lucide-react';
import { usePortfolio } from '../hooks/usePortfolioData';
import { useColors } from '../hooks/useColors';
import Card from '../components/Card';
import KPI from '../components/KPI';
import Badge from '../components/Badge';
import ProgressBar from '../components/ProgressBar';

const fmt = (v) => '€' + Math.round(v || 0).toLocaleString('es-ES');

const iconFor = {
  'Préstamos': Handshake,
  'PE': Building2,
  'VC Startups': Rocket,
  'ETFs + Fondos': TrendingUp,
  'Fondos Monetarios': Landmark,
  'Criptomonedas': Bitcoin,
  'Renta Fija': Shield,
  'Real Estate': Home,
};

const pageFor = {
  'Préstamos': 'loans',
  'PE': 'pe',
  'VC Startups': 'vc',
  'ETFs + Fondos': 'etfs',
  'Fondos Monetarios': 'monetary',
  'Criptomonedas': 'crypto',
  'Renta Fija': 'rentafija',
  'Real Estate': 'realestate',
};

function Donut({ data, total, size = 200, thickness = 24 }) {
  const c = useColors();
  const [hover, setHover] = useState(null);
  const r = size / 2 - thickness / 2;
  const cx = size / 2;
  const cy = size / 2;

  let acc = 0;
  const arcs = data.map((d) => {
    const start = acc;
    const len = (d.invested / total) * 2 * Math.PI;
    acc += len;
    return { ...d, start, len };
  });

  const arcPath = (startA, len) => {
    const x1 = cx + r * Math.cos(startA - Math.PI / 2);
    const y1 = cy + r * Math.sin(startA - Math.PI / 2);
    const x2 = cx + r * Math.cos(startA + len - Math.PI / 2);
    const y2 = cy + r * Math.sin(startA + len - Math.PI / 2);
    const large = len > Math.PI ? 1 : 0;
    return `M${x1},${y1} A${r},${r} 0 ${large} 1 ${x2},${y2}`;
  };

  const selected = hover !== null ? arcs[hover] : null;

  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size}>
        {arcs.map((a, i) => (
          <path
            key={i}
            d={arcPath(a.start, a.len)}
            stroke={a.color}
            strokeWidth={hover === i ? thickness + 4 : thickness}
            fill="none"
            strokeLinecap="butt"
            opacity={hover !== null && hover !== i ? 0.35 : 1}
            style={{ transition: 'all .15s', cursor: 'pointer' }}
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
          />
        ))}
      </svg>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
        }}
      >
        <span
          style={{
            fontSize: 10,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: c.textMuted,
            fontWeight: 500,
          }}
        >
          {selected ? selected.name : 'Total invertido'}
        </span>
        <span
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: c.text,
            fontVariantNumeric: 'tabular-nums',
            marginTop: 4,
          }}
        >
          {fmt(selected ? selected.invested : total)}
        </span>
        <span
          style={{
            fontSize: 11,
            color: selected ? selected.color : c.textSecondary,
            marginTop: 4,
          }}
        >
          {selected
            ? ((selected.invested / total) * 100).toFixed(1) + '%'
            : '8 categorías'}
        </span>
      </div>
    </div>
  );
}

function EvolutionChart({ data }) {
  const c = useColors();
  if (!data || data.length === 0) return null;
  const hasValue = data.some((d) => typeof d.value === 'number');
  const allVals = hasValue
    ? data.flatMap((d) => [d.invested, d.value])
    : data.map((d) => d.invested);
  const min = Math.min(...allVals);
  const max = Math.max(...allVals);
  const range = max - min || 1;
  const w = 620;
  const h = 120;
  const pad = 5;
  const projX = (i) => ((i / Math.max(1, data.length - 1)) * w).toFixed(1);
  const projY = (n) => (h - ((n - min) / range) * (h - pad * 2) - pad).toFixed(1);

  const investedPts = data.map((d, i) => [projX(i), projY(d.invested)]);
  const valuePts = hasValue ? data.map((d, i) => [projX(i), projY(d.value)]) : null;

  const investedPath = investedPts.map((p, i) => (i === 0 ? 'M' : 'L') + p[0] + ',' + p[1]).join(' ');
  const valuePath = valuePts ? valuePts.map((p, i) => (i === 0 ? 'M' : 'L') + p[0] + ',' + p[1]).join(' ') : null;

  // Gap area between value (top) and invested (bottom) where value > invested.
  // Computed as polygon: value forward + invested reversed.
  const gapPath = valuePts
    ? valuePts.map((p, i) => (i === 0 ? 'M' : 'L') + p[0] + ',' + p[1]).join(' ') +
      ' ' +
      [...investedPts].reverse().map((p) => 'L' + p[0] + ',' + p[1]).join(' ') +
      ' Z'
    : null;

  const gid = 'evoGap-' + (data.length || 0);

  return (
    <svg
      width="100%"
      height={120}
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="none"
      style={{ display: 'block' }}
    >
      <defs>
        <linearGradient id={gid} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={c.green} stopOpacity="0.28" />
          <stop offset="100%" stopColor={c.green} stopOpacity="0.04" />
        </linearGradient>
      </defs>
      {gapPath && <path d={gapPath} fill={`url(#${gid})`} />}
      <path d={investedPath} stroke={c.textMuted} strokeWidth="1.6" fill="none" strokeDasharray="2 3" />
      {valuePath && <path d={valuePath} stroke={c.green} strokeWidth="2" fill="none" />}
    </svg>
  );
}

function GainHero({ ps, c }) {
  const gain = Number(ps.totalReturn) || 0;
  const totalPct = Number(ps.totalReturnPct) || 0;
  const xirr = ps.xirrPct;
  const hold = ps.holdYears;
  const positive = gain >= 0;
  const xirrPositive = (xirr ?? 0) >= 0;
  const grossAssetValue = ps.grossAssetValue ?? null;
  const mortgageDebt = ps.mortgageDebt ?? 0;

  const labelStyle = {
    fontSize: 10,
    fontWeight: 500,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: c.gold,
  };
  const subLabelStyle = {
    fontSize: 11,
    color: c.textMuted,
    fontVariantNumeric: 'tabular-nums',
    marginTop: 6,
  };
  const bigStyle = {
    fontSize: 44,
    fontWeight: 800,
    letterSpacing: '-0.025em',
    lineHeight: 1,
    fontVariantNumeric: 'tabular-nums',
    marginTop: 10,
  };

  return (
    <div
      style={{
        background: `linear-gradient(135deg, ${c.goldBg}, ${c.goldBgLight})`,
        border: `1px solid ${c.goldBorder}`,
        borderRadius: 20,
        padding: '24px 28px',
        display: 'flex',
        flexDirection: 'column',
        gap: 22,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 24, flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 220px' }}>
          <p style={labelStyle}>Ganancia</p>
          <p style={{ ...bigStyle, color: positive ? c.green : c.red }}>
            {(positive ? '+' : '−')}{fmt(Math.abs(gain))}
          </p>
          <p style={subLabelStyle}>
            ({(positive ? '+' : '')}{totalPct.toFixed(2)}% total)
          </p>
        </div>
        <div style={{ flex: '1 1 220px', textAlign: 'right' }}>
          <p style={labelStyle}>Rent. anualizada</p>
          <p style={{ ...bigStyle, color: xirrPositive ? c.green : c.red }}>
            {xirr === null || xirr === undefined
              ? '—'
              : (xirrPositive ? '+' : '') + Number(xirr).toFixed(2) + '%/año'}
          </p>
          <p style={subLabelStyle}>
            XIRR{hold !== null && hold !== undefined ? ` · ${Number(hold).toFixed(2)}y hold` : ''}
          </p>
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          gap: 28,
          flexWrap: 'wrap',
          paddingTop: 16,
          borderTop: `1px solid ${c.border}`,
        }}
      >
        <div>
          <p style={{ fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: c.textSecondary }}>
            Total invertido
          </p>
          <p style={{ fontSize: 18, fontWeight: 600, color: c.text, fontVariantNumeric: 'tabular-nums', marginTop: 4 }}>
            {fmt(ps.totalInvested)}
          </p>
        </div>
        <div>
          <p style={{ fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: c.textSecondary }}>
            Valor actual
          </p>
          <p style={{ fontSize: 18, fontWeight: 600, color: c.text, fontVariantNumeric: 'tabular-nums', marginTop: 4 }}>
            {fmt(ps.totalValue)}
          </p>
        </div>
        {mortgageDebt > 0 && grossAssetValue !== null && (
          <>
            <div>
              <p style={{ fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: c.textSecondary }}>
                Activos brutos
              </p>
              <p style={{ fontSize: 18, fontWeight: 600, color: c.text, fontVariantNumeric: 'tabular-nums', marginTop: 4 }}>
                {fmt(grossAssetValue)}
              </p>
            </div>
            <div>
              <p style={{ fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: c.textSecondary }}>
                Deuda hipotecaria
              </p>
              <p style={{ fontSize: 18, fontWeight: 600, color: c.red, fontVariantNumeric: 'tabular-nums', marginTop: 4 }}>
                −{fmt(mortgageDebt)}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function CashflowBars({ data }) {
  const c = useColors();
  if (!data || data.length === 0) return null;
  const max = Math.max(...data.map((d) => d.income));
  const w = 420;
  const h = 130;
  const barW = w / data.length - 6;
  return (
    <svg width="100%" viewBox={`0 0 ${w} ${h + 20}`} style={{ display: 'block', maxHeight: 150 }}>
      {data.map((d, i) => {
        const bh = max > 0 ? (d.income / max) * h : 0;
        return (
          <g key={i}>
            <rect
              x={i * (w / data.length) + 3}
              y={h - bh}
              width={barW}
              height={bh}
              fill={c.green}
              rx="3"
              opacity="0.85"
            />
            <text
              x={i * (w / data.length) + 3 + barW / 2}
              y={h + 14}
              textAnchor="middle"
              fontSize="9"
              fill={c.textMuted}
            >
              {d.month}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export default function Overview({ setPage }) {
  const {
    portfolioSummary: ps,
    categoryAllocation,
    loans,
    cashflow,
    evolution,
    alerts = [],
  } = usePortfolio();
  const c = useColors();

  const iliquido = categoryAllocation
    .filter((cat) => cat.name === 'PE' || cat.name === 'VC Startups' || cat.name === 'Real Estate')
    .reduce((s, cat) => s + cat.invested, 0);
  const liquidez = categoryAllocation
    .filter((cat) => ['Fondos Monetarios', 'Renta Fija', 'Criptomonedas'].includes(cat.name))
    .reduce((s, cat) => s + cat.value, 0);
  const pctIliquido = ps.totalInvested > 0 ? ((iliquido / ps.totalInvested) * 100).toFixed(1) : '0';

  const upcoming = useMemo(
    () =>
      [...loans]
        .sort((a, b) => {
          const pa = a.endDate.split('/').reverse().join('');
          const pb = b.endDate.split('/').reverse().join('');
          return pa.localeCompare(pb);
        })
        .slice(0, 4),
    [loans]
  );

  const lastUpdated = new Date(ps.lastUpdated || Date.now()).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="bc-fade" style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      {/* Header */}
      <header>
        <p
          style={{
            fontSize: 11,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: c.gold,
            fontWeight: 500,
          }}
        >
          Resumen
        </p>
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            marginTop: 4,
          }}
        >
          <h1
            style={{
              fontSize: 34,
              fontWeight: 800,
              letterSpacing: '-0.025em',
              color: c.text,
            }}
          >
            Dashboard
          </h1>
          <p style={{ fontSize: 12, color: c.textMuted }}>Actualizado {lastUpdated}</p>
        </div>
      </header>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {alerts.slice(0, 2).map((a, i) => {
            const urgent = a.type === 'urgent' || (a.daysLeft !== undefined && a.daysLeft <= 30);
            const col = urgent ? c.red : c.amber;
            const bg = urgent ? c.redBg : c.amberBg;
            const bd = urgent ? c.redBorder : c.amberBorder;
            const Ic = urgent ? AlertTriangle : Bell;
            return (
              <button
                key={i}
                onClick={() => setPage('loans')}
                style={{
                  background: bg,
                  border: `1px solid ${bd}`,
                  borderRadius: 12,
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontFamily: 'inherit',
                }}
              >
                <Ic size={18} color={col} />
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 13, fontWeight: 500, color: col }}>
                    {a.project} vence en {a.daysLeft} días{' '}
                    <span style={{ color: col, opacity: 0.7, fontWeight: 400 }}>
                      ({a.endDate})
                    </span>
                  </p>
                  {a.capitalPending !== undefined && (
                    <p style={{ fontSize: 11, color: col, opacity: 0.7, marginTop: 2 }}>
                      {fmt(a.capitalPending)} pendiente de cobro
                    </p>
                  )}
                </div>
                <ArrowRight size={14} color={col} />
              </button>
            );
          })}
        </div>
      )}

      {/* Hero — ganancia + XIRR with secondary metrics */}
      <GainHero ps={ps} c={c} />

      {/* Liquidity / illiquid breakdown */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 16,
        }}
        className="kpi-grid"
      >
        <KPI
          label="Liquidez"
          value={fmt(liquidez)}
          sub="RF + Oro + Crypto"
          icon={Droplets}
          iconColor={c.cyan}
        />
        <KPI
          label="Ilíquido"
          value={pctIliquido + '%'}
          sub={fmt(iliquido) + ' · PE + VC + RE'}
          icon={Lock}
          iconColor={c.amber}
          valueColor={c.amber}
        />
      </div>

      {/* Evolution chart */}
      {evolution && evolution.length > 0 && (
        <Card title="Evolución del portfolio" subtitle="Capital invertido acumulado" pad={24}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              marginBottom: 16,
            }}
          >
            <div>
              <p
                style={{
                  fontSize: 11,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: c.textSecondary,
                }}
              >
                Invertido
              </p>
              <p
                style={{
                  fontSize: 28,
                  fontWeight: 700,
                  color: c.text,
                  fontVariantNumeric: 'tabular-nums',
                  marginTop: 4,
                }}
              >
                {fmt(ps.totalInvested)}
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p
                style={{
                  fontSize: 11,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: c.textSecondary,
                }}
              >
                Valor actual
              </p>
              <p
                style={{
                  fontSize: 28,
                  fontWeight: 700,
                  color: ps.totalValue >= ps.totalInvested ? c.green : c.red,
                  fontVariantNumeric: 'tabular-nums',
                  marginTop: 4,
                }}
              >
                {fmt(ps.totalValue)}
              </p>
            </div>
          </div>
          <div style={{ width: '100%', marginTop: 8 }}>
            <EvolutionChart data={evolution} />
          </div>
        </Card>
      )}

      {/* Donut + Cashflow */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 20 }} className="two-col">
        <Card title="Distribución" subtitle="Capital invertido por categoría" pad={24}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 28, flexWrap: 'wrap' }}>
            <Donut data={categoryAllocation} total={ps.totalInvested} size={200} thickness={24} />
            <div style={{ flex: 1, minWidth: 180, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {categoryAllocation.map((cat) => {
                const pct = ((cat.invested / ps.totalInvested) * 100).toFixed(1);
                return (
                  <div
                    key={cat.name}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12 }}
                  >
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: 2,
                        background: cat.color,
                        flexShrink: 0,
                      }}
                    />
                    <span style={{ color: c.textSecondary, flex: 1 }}>{cat.name}</span>
                    <span
                      style={{
                        color: c.text,
                        fontWeight: 600,
                        fontVariantNumeric: 'tabular-nums',
                      }}
                    >
                      {pct}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>

        {cashflow && cashflow.length > 0 && (
          <Card title="Cashflow proyectado" subtitle="Ingresos mensuales · 12 meses" pad={24}>
            <CashflowBars data={cashflow} />
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: 16,
                paddingTop: 14,
                borderTop: `1px solid ${c.border}`,
              }}
            >
              <div>
                <p
                  style={{
                    fontSize: 10,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: c.textSecondary,
                  }}
                >
                  Total 12m
                </p>
                <p
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                    color: c.green,
                    marginTop: 4,
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {fmt(cashflow.reduce((s, m) => s + m.income, 0))}
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p
                  style={{
                    fontSize: 10,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: c.textSecondary,
                  }}
                >
                  Media/mes
                </p>
                <p
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                    color: c.green,
                    marginTop: 4,
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {fmt(cashflow.reduce((s, m) => s + m.income, 0) / 12)}
                </p>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Upcoming maturities */}
      <Card
        title="Próximos vencimientos"
        subtitle="4 préstamos más próximos a vencer"
        pad={24}
        action={
          <button
            onClick={() => setPage('loans')}
            style={{
              background: 'transparent',
              border: `1px solid ${c.border}`,
              borderRadius: 8,
              padding: '6px 12px',
              fontSize: 11,
              color: c.textSecondary,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              fontFamily: 'inherit',
            }}
          >
            Ver todos <ChevronRight size={12} />
          </button>
        }
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '20px 32px',
          }}
          className="two-col"
        >
          {upcoming.map((l) => {
            const totalCuotas = l.cuotasPagadas + l.cuotasRestantes;
            const pct = (l.cuotasPagadas / totalCuotas) * 100;
            return (
              <div key={l.id}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: 6,
                  }}
                >
                  <span style={{ fontSize: 13, fontWeight: 500, color: c.text }}>
                    {l.project}
                  </span>
                  <span
                    style={{
                      fontSize: 11,
                      color: c.textMuted,
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    {l.endDate}
                  </span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: 6,
                    fontSize: 11,
                  }}
                >
                  <span
                    style={{ color: c.textSecondary, fontVariantNumeric: 'tabular-nums' }}
                  >
                    {fmt(l.capitalPending)} pendiente
                  </span>
                  <span style={{ color: c.green, fontVariantNumeric: 'tabular-nums' }}>
                    {pct.toFixed(0)}% amortizado
                  </span>
                </div>
                <ProgressBar
                  value={l.cuotasPagadas}
                  max={totalCuotas}
                  color={c.purple}
                  height={5}
                />
              </div>
            );
          })}
        </div>
      </Card>

      {/* Category cards */}
      <section>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            marginBottom: 14,
          }}
        >
          <h3
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: c.text,
              letterSpacing: '-0.01em',
            }}
          >
            Por categoría
          </h3>
          <p style={{ fontSize: 11, color: c.textMuted }}>
            8 categorías · {fmt(ps.totalInvested)} total
          </p>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 14,
          }}
          className="cat-grid"
        >
          {categoryAllocation.map((cat) => {
            const pct = ((cat.invested / ps.totalInvested) * 100).toFixed(1);
            const ret = cat.return;
            const Ic = iconFor[cat.name];
            const illiquid = cat.name === 'PE' || cat.name === 'VC Startups' || cat.name === 'Real Estate';
            return (
              <Card
                key={cat.name}
                pad={18}
                hover
                onClick={() => setPage(pageFor[cat.name])}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: 14,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 10,
                        background: cat.color + '22',
                        color: cat.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {Ic && <Ic size={17} />}
                    </div>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 600, color: c.text }}>
                        {cat.name}
                      </p>
                      <p style={{ fontSize: 10, color: c.textMuted, marginTop: 1 }}>
                        {pct}% del portfolio
                      </p>
                    </div>
                  </div>
                  <ArrowRight size={14} color={c.textMuted} />
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    justifyContent: 'space-between',
                    marginBottom: 10,
                  }}
                >
                  <span
                    style={{
                      fontSize: 20,
                      fontWeight: 700,
                      color: c.text,
                      fontVariantNumeric: 'tabular-nums',
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {fmt(cat.invested)}
                  </span>
                  {illiquid ? (
                    <Badge color={c.amber} bg={c.amberBg} border={c.amberBorder}>
                      Ilíquido
                    </Badge>
                  ) : (
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: ret >= 0 ? c.green : c.red,
                        fontVariantNumeric: 'tabular-nums',
                      }}
                    >
                      {(ret >= 0 ? '+' : '') + ret.toFixed(2) + '%'}
                    </span>
                  )}
                </div>
                <ProgressBar
                  value={cat.invested}
                  max={ps.totalInvested}
                  color={cat.color}
                  height={4}
                />
              </Card>
            );
          })}
        </div>
      </section>

      {/* Footer note */}
      <div
        style={{
          padding: '14px 16px',
          background: c.amberBg,
          border: `1px solid ${c.amberBorder}`,
          borderRadius: 12,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          fontSize: 12,
          color: c.amber,
        }}
      >
        <AlertTriangle size={14} color={c.amber} />
        PE y VC: solo capital invertido en totales. Múltiplos no realizados como referencia en sus páginas.
      </div>
    </div>
  );
}
