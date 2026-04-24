import { useState } from 'react';
import {
  ArrowLeft,
  Home,
  Building,
  Wallet,
  TrendingUp,
  Percent,
  ChevronDown,
  ChevronUp,
  Banknote,
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
const pct = (v, d = 2) => (v >= 0 ? '+' : '') + (v || 0).toFixed(d) + '%';

function PropertyRow({ property, c, computeMetrics }) {
  const [expanded, setExpanded] = useState(false);
  const m = computeMetrics(property);
  const f = property.financing;
  const isIndustrial = property.type === 'Industrial';
  const Ic = isIndustrial ? Building : Home;

  const principalPaid = 0; // mostrable como progreso de amortización (aprox simple)
  const loanProgress =
    f.loanAmount > 0
      ? Math.min((principalPaid / f.loanAmount) * 100, 100)
      : 100;

  return (
    <div
      style={{
        background: c.card,
        border: `1px solid ${c.border}`,
        borderRadius: 14,
        padding: 0,
        overflow: 'hidden',
        transition: 'all .15s ease',
      }}
    >
      {/* Header row */}
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          width: '100%',
          background: 'transparent',
          border: 'none',
          padding: '16px 20px',
          cursor: 'pointer',
          fontFamily: 'inherit',
          textAlign: 'left',
          display: 'grid',
          gridTemplateColumns: '52px 1.6fr 1fr 1fr 1fr 120px 22px',
          gap: 16,
          alignItems: 'center',
        }}
        className="re-row"
      >
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: '#14b8a622',
            color: '#14b8a6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Ic size={20} />
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: c.text }}>
              {property.name}
            </span>
            <Badge color={'#14b8a6'} bg={'#14b8a622'} border={'#14b8a655'}>
              {property.type}
            </Badge>
          </div>
          <p style={{ fontSize: 11, color: c.textMuted, marginTop: 3 }}>
            {property.city} · comprado {property.purchaseDate}
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
            Precio compra
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
            {fmt(property.purchasePrice)}
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
            Alquiler/mes
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
            {fmt(property.monthlyRent)}
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
            Cash-on-cash
          </p>
          <p
            style={{
              fontSize: 13,
              color: m.cashOnCash >= 0 ? c.green : c.red,
              marginTop: 2,
              fontVariantNumeric: 'tabular-nums',
              fontWeight: 600,
            }}
          >
            {pct(m.cashOnCash)}
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
            Cashflow/mes
          </p>
          <p
            style={{
              fontSize: 13,
              color: m.monthlyCashflow >= 0 ? c.green : c.red,
              marginTop: 2,
              fontVariantNumeric: 'tabular-nums',
              fontWeight: 600,
            }}
          >
            {(m.monthlyCashflow >= 0 ? '+' : '') + fmt(m.monthlyCashflow)}
          </p>
        </div>

        <div style={{ color: c.textMuted, display: 'flex', justifyContent: 'center' }}>
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </button>

      {/* Expanded detail */}
      {expanded && (
        <div
          style={{
            borderTop: `1px solid ${c.border}`,
            background: c.bg,
            padding: '20px 20px 24px',
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 20,
          }}
          className="re-detail"
        >
          {/* Adquisición */}
          <div>
            <p
              style={{
                fontSize: 10,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: c.gold,
                fontWeight: 500,
                marginBottom: 10,
              }}
            >
              Adquisición
            </p>
            <Line label="Precio" value={fmt(property.purchasePrice)} c={c} />
            <Line label="Gastos" value={fmt(property.acquisitionCosts)} c={c} />
            <Line
              label="Total"
              value={fmt(property.purchasePrice + property.acquisitionCosts)}
              c={c}
              bold
            />
            <Line
              label="Valor actual"
              value={fmt(property.currentValue)}
              c={c}
              color={m.appreciation >= 0 ? c.green : c.red}
            />
            <Line
              label="Revalorización"
              value={pct(m.appreciationPct)}
              c={c}
              color={m.appreciation >= 0 ? c.green : c.red}
            />
          </div>

          {/* Financiación */}
          <div>
            <p
              style={{
                fontSize: 10,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: c.gold,
                fontWeight: 500,
                marginBottom: 10,
              }}
            >
              Financiación
            </p>
            {f.type === 'mortgage' ? (
              <>
                <Line label="Capital aportado" value={fmt(f.equity)} c={c} />
                <Line label="Hipoteca" value={fmt(f.loanAmount)} c={c} />
                <Line label="TIN" value={f.rate.toFixed(2) + '%'} c={c} />
                <Line
                  label="Plazo"
                  value={Math.round(f.termMonths / 12) + ' años'}
                  c={c}
                />
                <Line
                  label="Cuota/mes"
                  value={fmtDec(f.monthlyPayment)}
                  c={c}
                  bold
                />
              </>
            ) : (
              <>
                <Line label="Modalidad" value="Contado" c={c} bold />
                <Line label="Capital aportado" value={fmt(f.equity)} c={c} />
              </>
            )}
          </div>

          {/* Ingresos / costes */}
          <div>
            <p
              style={{
                fontSize: 10,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: c.gold,
                fontWeight: 500,
                marginBottom: 10,
              }}
            >
              Ingresos / Gastos
            </p>
            <Line
              label="Renta bruta"
              value={fmt(property.monthlyRent)}
              c={c}
              color={c.green}
            />
            <Line
              label="Vacancia"
              value={'-' + (property.vacancyRate * 100).toFixed(1) + '%'}
              c={c}
              color={c.textMuted}
            />
            <Line label="Comunidad" value={fmt(property.monthlyCosts.community)} c={c} />
            <Line label="IBI (mes)" value={fmtDec(property.monthlyCosts.ibi)} c={c} />
            <Line
              label="Seguro (mes)"
              value={fmtDec(property.monthlyCosts.insurance)}
              c={c}
            />
            <Line
              label="Mantenimiento"
              value={fmt(property.monthlyCosts.maintenance)}
              c={c}
            />
          </div>

          {/* Rentabilidad */}
          <div>
            <p
              style={{
                fontSize: 10,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: c.gold,
                fontWeight: 500,
                marginBottom: 10,
              }}
            >
              Rentabilidad
            </p>
            <Line label="Yield bruto" value={pct(m.grossYield)} c={c} />
            <Line label="Yield neto" value={pct(m.netYield)} c={c} />
            <Line
              label="Cashflow/mes"
              value={(m.monthlyCashflow >= 0 ? '+' : '') + fmt(m.monthlyCashflow)}
              c={c}
              color={m.monthlyCashflow >= 0 ? c.green : c.red}
            />
            <Line
              label="Cashflow/año"
              value={(m.annualCashflow >= 0 ? '+' : '') + fmt(m.annualCashflow)}
              c={c}
              color={m.annualCashflow >= 0 ? c.green : c.red}
            />
            <Line
              label="Cash-on-cash"
              value={pct(m.cashOnCash)}
              c={c}
              color={m.cashOnCash >= 0 ? c.green : c.red}
              bold
            />
          </div>
        </div>
      )}
    </div>
  );
}

function Line({ label, value, c, color, bold }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        padding: '6px 0',
        fontSize: 12,
      }}
    >
      <span style={{ color: c.textSecondary }}>{label}</span>
      <span
        style={{
          color: color || c.text,
          fontWeight: bold ? 700 : 500,
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {value}
      </span>
    </div>
  );
}

export default function RealEstatePage({ setPage }) {
  const { realEstate, realEstateSummary: rs, computeRealEstateMetrics } = usePortfolio();
  const c = useColors();

  const teal = '#14b8a6';

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
              color: teal,
              fontWeight: 500,
            }}
          >
            Real Estate
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
              Inmuebles
            </h1>
            <span style={{ fontSize: 13, color: c.textMuted }}>
              {rs.totalProperties} propiedades · {fmt(rs.totalCurrentValue)} valor actual
            </span>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div
        style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}
        className="kpi-grid"
      >
        <KPI
          label="Capital aportado"
          value={fmt(rs.totalEquity)}
          sub={'Equity real · ' + rs.totalProperties + ' inmuebles'}
          icon={Wallet}
          iconColor={teal}
          valueColor={teal}
        />
        <KPI
          label="Renta mensual"
          value={fmt(rs.totalMonthlyRent)}
          sub={'Bruta · ' + fmt(rs.totalMonthlyRent * 12) + ' anual'}
          icon={Banknote}
          iconColor={c.green}
          valueColor={c.green}
        />
        <KPI
          label="Yield neto medio"
          value={rs.avgNetYield.toFixed(2) + '%'}
          sub="Tras costes, sin hipoteca"
          icon={Percent}
          iconColor={c.gold}
          valueColor={c.gold}
        />
        <KPI
          label="Cash-on-cash medio"
          value={rs.avgCashOnCash.toFixed(2) + '%'}
          sub="Rentabilidad sobre equity"
          icon={TrendingUp}
          iconColor={rs.avgCashOnCash >= 0 ? c.green : c.red}
          valueColor={rs.avgCashOnCash >= 0 ? c.green : c.red}
        />
      </div>

      {/* Cashflow summary */}
      <Card title="Cashflow consolidado" subtitle="Ingresos y gastos mensuales agregados" pad={24}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 20,
          }}
          className="two-col"
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
              Ingresos/mes
            </p>
            <p
              style={{
                fontSize: 26,
                fontWeight: 700,
                color: c.green,
                marginTop: 6,
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              +{fmt(rs.totalMonthlyRent)}
            </p>
            <p style={{ fontSize: 11, color: c.textMuted, marginTop: 4 }}>
              Alquileres consolidados
            </p>
          </div>
          <div>
            <p
              style={{
                fontSize: 10,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: c.textSecondary,
              }}
            >
              Cashflow neto/mes
            </p>
            <p
              style={{
                fontSize: 26,
                fontWeight: 700,
                color: rs.totalMonthlyCashflow >= 0 ? c.green : c.red,
                marginTop: 6,
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {(rs.totalMonthlyCashflow >= 0 ? '+' : '') +
                fmt(rs.totalMonthlyCashflow)}
            </p>
            <p style={{ fontSize: 11, color: c.textMuted, marginTop: 4 }}>
              Tras costes e hipotecas
            </p>
          </div>
          <div>
            <p
              style={{
                fontSize: 10,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: c.textSecondary,
              }}
            >
              Equity / Apalancamiento
            </p>
            <p
              style={{
                fontSize: 26,
                fontWeight: 700,
                color: c.text,
                marginTop: 6,
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {fmt(rs.totalEquity)}
            </p>
            <p style={{ fontSize: 11, color: c.textMuted, marginTop: 4 }}>
              {fmt(rs.totalLoan)} en hipotecas ·{' '}
              {((rs.totalLoan / (rs.totalEquity + rs.totalLoan)) * 100).toFixed(0)}% LTV
            </p>
          </div>
        </div>
      </Card>

      {/* Property rows */}
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
            Propiedades
          </h3>
          <p style={{ fontSize: 11, color: c.textMuted }}>
            Click para desplegar detalle
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {realEstate.map((property) => (
            <PropertyRow
              key={property.id}
              property={property}
              c={c}
              computeMetrics={computeRealEstateMetrics}
            />
          ))}
        </div>
      </section>

      {/* Footer note */}
      <div
        style={{
          padding: '14px 16px',
          background: c.amberBg,
          border: `1px solid ${c.amberBorder}`,
          borderRadius: 12,
          fontSize: 12,
          color: c.amber,
          lineHeight: 1.5,
        }}
      >
        <strong>⚠️ Datos ficticios:</strong> los importes de financiación, costes y valor
        actual son estimativos para visualizar el modelo. Reemplázalos con números reales en{' '}
        <code style={{ fontFamily: 'ui-monospace, Menlo, monospace' }}>
          src/data/portfolio.js → realEstate
        </code>
        .
      </div>
    </div>
  );
}
