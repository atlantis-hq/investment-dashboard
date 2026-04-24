import { useState } from 'react';
import {
  ArrowLeft,
  Home,
  Building,
  Wallet,
  TrendingUp,
  Percent,
  Activity,
  MapPin,
  ChevronDown,
} from 'lucide-react';
import { usePortfolio } from '../hooks/usePortfolioData';
import { useColors } from '../hooks/useColors';
import Card from '../components/Card';
import KPI from '../components/KPI';
import Badge from '../components/Badge';

const TEAL = '#14b8a6';
const TEAL_BG = 'rgba(20,184,166,0.12)';
const TEAL_BORDER = 'rgba(20,184,166,0.3)';

const fmt = (v) => '€' + Math.round(v || 0).toLocaleString('es-ES');
const fmtPct = (v, d = 2) => (v >= 0 ? '+' : '') + (v || 0).toFixed(d) + '%';

function BigNum({ label, value, color }) {
  const c = useColors();
  return (
    <div>
      <p
        style={{
          fontSize: 10,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: c.textSecondary,
          fontWeight: 500,
        }}
      >
        {label}
      </p>
      <p
        style={{
          fontSize: 18,
          fontWeight: 700,
          color: color || c.text,
          marginTop: 4,
          fontVariantNumeric: 'tabular-nums',
          letterSpacing: '-0.01em',
        }}
      >
        {value}
      </p>
    </div>
  );
}

function DetailRow({ label, value, color, bold }) {
  const c = useColors();
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        gap: 10,
      }}
    >
      <span style={{ fontSize: 12, color: c.textMuted }}>{label}</span>
      <span
        style={{
          fontSize: 13,
          fontWeight: bold ? 700 : 500,
          color: color || c.text,
          fontVariantNumeric: 'tabular-nums',
          textAlign: 'right',
        }}
      >
        {value}
      </span>
    </div>
  );
}

function PropertyCard({ prop }) {
  const c = useColors();
  const [open, setOpen] = useState(false);
  const calc = prop.calc;
  const isResid = prop.type === 'Residencial';
  const Ic = isResid ? Home : Building;

  // Distribution bar: opex (amber) + mortgage (red) + net (green) = 100% of gross rent
  const barTotal = Math.max(calc.incomeMonth, 1);
  const opexPct = (calc.opexMonth / barTotal) * 100;
  const mortPct = (calc.mortgageMonth / barTotal) * 100;
  const netPct = Math.max(0, 100 - opexPct - mortPct);

  return (
    <div
      style={{
        background: c.card,
        border: `1px solid ${c.border}`,
        borderRadius: 16,
        overflow: 'hidden',
        transition: 'border-color .15s',
      }}
    >
      {/* Collapsed header */}
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          width: '100%',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          padding: '20px 24px',
          display: 'grid',
          gridTemplateColumns: '44px 1.3fr repeat(4, 1fr) 24px',
          gap: 18,
          alignItems: 'center',
          textAlign: 'left',
          fontFamily: 'inherit',
        }}
        className="re-row"
      >
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: TEAL_BG,
            border: `1px solid ${TEAL_BORDER}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Ic size={20} color={TEAL} />
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <p
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: c.text,
                letterSpacing: '-0.01em',
              }}
            >
              {prop.name}
            </p>
            <Badge color={TEAL}>{prop.type}</Badge>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 12,
              color: c.textMuted,
            }}
          >
            <MapPin size={11} />
            <span>{prop.city}</span>
            <span>·</span>
            <span style={{ fontVariantNumeric: 'tabular-nums' }}>{prop.purchase.date}</span>
          </div>
        </div>

        <BigNum label="Precio compra" value={fmt(prop.purchase.price)} />
        <BigNum label="Alquiler/mes" value={fmt(prop.income.rent)} color={c.green} />
        <BigNum
          label="Cash-on-cash"
          value={fmtPct(calc.cashOnCash, 2)}
          color={calc.cashOnCash >= 0 ? c.green : c.red}
        />
        <BigNum
          label="Cashflow/mes"
          value={fmt(calc.cashflowMonth)}
          color={calc.cashflowMonth >= 0 ? c.green : c.red}
        />

        <div
          style={{
            transition: 'transform .2s',
            transform: open ? 'rotate(180deg)' : 'rotate(0)',
            color: c.textMuted,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ChevronDown size={18} />
        </div>
      </button>

      {/* Always-visible cashflow distribution bar */}
      <div style={{ padding: '0 24px 18px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            fontSize: 10,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: c.textMuted,
            marginBottom: 6,
          }}
        >
          <span>Distribución alquiler mensual</span>
          <span style={{ flex: 1 }} />
          <span
            style={{
              color: c.textSecondary,
              fontVariantNumeric: 'tabular-nums',
              textTransform: 'none',
              letterSpacing: 0,
              fontSize: 11,
            }}
          >
            {fmt(calc.incomeMonth)} esperado
          </span>
        </div>
        <div
          style={{
            height: 8,
            background: c.barTrack,
            borderRadius: 999,
            overflow: 'hidden',
            display: 'flex',
          }}
        >
          <div style={{ width: opexPct + '%', background: c.amber, transition: 'width .2s' }} />
          <div style={{ width: mortPct + '%', background: c.red, transition: 'width .2s' }} />
          <div style={{ width: netPct + '%', background: c.green, transition: 'width .2s' }} />
        </div>
        <div
          style={{
            display: 'flex',
            gap: 16,
            marginTop: 8,
            fontSize: 11,
            color: c.textSecondary,
            fontVariantNumeric: 'tabular-nums',
            flexWrap: 'wrap',
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 8, height: 8, borderRadius: 2, background: c.amber }} />
            Costes {fmt(calc.opexMonth)}
          </span>
          {calc.mortgageMonth > 0 && (
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 8, height: 8, borderRadius: 2, background: c.red }} />
              Hipoteca {fmt(calc.mortgageMonth)}
            </span>
          )}
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 8, height: 8, borderRadius: 2, background: c.green }} />
            Neto {fmt(calc.cashflowMonth)}
          </span>
        </div>
      </div>

      {/* Expanded details */}
      {open && (
        <div
          style={{
            borderTop: `1px solid ${c.border}`,
            padding: '22px 24px',
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 28,
            background: 'rgba(255,255,255,0.015)',
          }}
          className="re-detail"
        >
          {/* Adquisición */}
          <div>
            <p
              style={{
                fontSize: 10,
                letterSpacing: '0.10em',
                textTransform: 'uppercase',
                color: TEAL,
                fontWeight: 600,
                marginBottom: 12,
              }}
            >
              Adquisición
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <DetailRow label="Precio compra" value={fmt(prop.purchase.price)} />
              <DetailRow label="Gastos (~10%)" value={fmt(prop.purchase.fees)} />
              <DetailRow
                label="Total invertido"
                value={fmt(calc.acqTotal)}
                color={c.text}
                bold
              />
              <DetailRow label="Fecha compra" value={prop.purchase.date} />
              <DetailRow
                label="Valor actual est."
                value={fmt(prop.purchase.currentValue)}
              />
              <DetailRow
                label="Revalorización"
                value={fmtPct(calc.appreciation, 1)}
                color={calc.appreciation >= 0 ? c.green : c.red}
              />
            </div>
          </div>

          {/* Financiación */}
          <div>
            <p
              style={{
                fontSize: 10,
                letterSpacing: '0.10em',
                textTransform: 'uppercase',
                color: TEAL,
                fontWeight: 600,
                marginBottom: 12,
              }}
            >
              Financiación
            </p>
            {prop.financing.cash ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div
                  style={{
                    padding: '10px 12px',
                    background: c.goldBgLight,
                    border: `1px solid ${c.goldBorder}`,
                    borderRadius: 8,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <Wallet size={13} color={c.gold} />
                  <span style={{ fontSize: 12, color: c.gold, fontWeight: 600 }}>
                    Compra al contado
                  </span>
                </div>
                <DetailRow
                  label="Capital aportado"
                  value={fmt(calc.equityInvested)}
                  bold
                />
                <DetailRow label="Préstamo" value="—" />
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <DetailRow label="Capital aportado" value={fmt(prop.financing.equity)} />
                <DetailRow label="Importe préstamo" value={fmt(prop.financing.loan)} />
                <DetailRow label="TIN" value={prop.financing.tin.toFixed(2) + '%'} />
                <DetailRow label="Plazo" value={prop.financing.years + ' años'} />
                <DetailRow
                  label="Cuota mensual"
                  value={fmt(prop.financing.monthlyPayment)}
                  bold
                />
                <DetailRow label="LTV actual" value={calc.ltv.toFixed(1) + '%'} />
              </div>
            )}
          </div>

          {/* Ingresos / Gastos */}
          <div>
            <p
              style={{
                fontSize: 10,
                letterSpacing: '0.10em',
                textTransform: 'uppercase',
                color: TEAL,
                fontWeight: 600,
                marginBottom: 12,
              }}
            >
              Ingresos / Gastos
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <DetailRow
                label="Renta mensual"
                value={fmt(prop.income.rent)}
                color={c.green}
              />
              <DetailRow label="Vacancia est." value={prop.income.vacancyPct + '%'} />
              <DetailRow label="Comunidad/mes" value={fmt(prop.expenses.community)} />
              <DetailRow label="IBI/año" value={fmt(prop.expenses.ibiYear)} />
              <DetailRow label="Seguro/año" value={fmt(prop.expenses.insuranceYear)} />
              {prop.expenses.mgmtPct > 0 && (
                <DetailRow label="Gestión" value={prop.expenses.mgmtPct + '%'} />
              )}
              <DetailRow
                label="Mantenimiento"
                value={prop.expenses.maintenancePct + '%'}
              />
            </div>
          </div>

          {/* Rentabilidad */}
          <div>
            <p
              style={{
                fontSize: 10,
                letterSpacing: '0.10em',
                textTransform: 'uppercase',
                color: TEAL,
                fontWeight: 600,
                marginBottom: 12,
              }}
            >
              Rentabilidad
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <DetailRow label="Yield bruto" value={fmtPct(calc.yieldGross, 2)} />
              <DetailRow
                label="Yield neto"
                value={fmtPct(calc.yieldNet, 2)}
                color={calc.yieldNet >= 0 ? c.green : c.red}
              />
              <DetailRow
                label="Cashflow anual"
                value={fmt(calc.cashflowYear)}
                color={calc.cashflowYear >= 0 ? c.green : c.red}
                bold
              />
              <DetailRow
                label="Cashflow mensual"
                value={fmt(calc.cashflowMonth)}
                color={calc.cashflowMonth >= 0 ? c.green : c.red}
              />
              <DetailRow
                label="Cash-on-cash"
                value={fmtPct(calc.cashOnCash, 2)}
                color={calc.cashOnCash >= 0 ? c.green : c.red}
                bold
              />
              <DetailRow
                label="Revalorización"
                value={fmtPct(calc.appreciation, 1)}
                color={calc.appreciation >= 0 ? c.green : c.red}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function RealEstatePage({ setPage }) {
  const { realEstate } = usePortfolio();
  const c = useColors();
  const s = realEstate.summary;

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
              color: TEAL,
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
              {s.properties} propiedades · {fmt(s.rentMonth)}/mes brutos
            </span>
          </div>
        </div>
      </div>

      {/* KPIs — 4 tiles */}
      <div
        style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}
        className="kpi-grid"
      >
        <KPI
          label="Capital aportado"
          value={fmt(s.totalEquity)}
          sub="Equity real invertido"
          icon={Wallet}
          iconColor={TEAL}
        />
        <KPI
          label="Renta mensual bruta"
          value={fmt(s.rentMonth)}
          sub={fmt(s.rentMonth * 12) + ' anual'}
          icon={TrendingUp}
          iconColor={c.green}
        />
        <KPI
          label="Yield neto medio"
          value={s.avgYieldNet.toFixed(2) + '%'}
          sub="Tras costes, antes de hipoteca"
          icon={Percent}
          iconColor={c.gold}
          valueColor={s.avgYieldNet >= 0 ? c.green : c.red}
        />
        <KPI
          label="Cash-on-cash medio"
          value={s.avgCoC.toFixed(2) + '%'}
          sub="Retorno sobre equity"
          icon={Activity}
          iconColor={TEAL}
          valueColor={s.avgCoC >= 0 ? c.green : c.red}
        />
      </div>

      {/* Cashflow consolidado */}
      <Card title="Cashflow consolidado" subtitle="Vista mensual agregada" pad={26}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 24,
          }}
          className="two-col"
        >
          {/* Ingresos */}
          <div
            style={{
              padding: '18px 20px',
              background: 'rgba(16,185,129,0.07)',
              border: `1px solid ${c.greenBorder}`,
              borderRadius: 12,
            }}
          >
            <p
              style={{
                fontSize: 10,
                letterSpacing: '0.10em',
                textTransform: 'uppercase',
                color: c.green,
                fontWeight: 600,
              }}
            >
              Ingresos / mes
            </p>
            <p
              style={{
                fontSize: 28,
                fontWeight: 800,
                color: c.text,
                marginTop: 10,
                letterSpacing: '-0.02em',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {fmt(s.rentMonth)}
            </p>
            <p style={{ fontSize: 12, color: c.textMuted, marginTop: 6 }}>
              Alquiler bruto agregado
            </p>
          </div>

          {/* Cashflow neto */}
          <div
            style={{
              padding: '18px 20px',
              background: s.cashflowMonth >= 0 ? TEAL_BG : c.redBg,
              border: `1px solid ${s.cashflowMonth >= 0 ? TEAL_BORDER : c.redBorder}`,
              borderRadius: 12,
            }}
          >
            <p
              style={{
                fontSize: 10,
                letterSpacing: '0.10em',
                textTransform: 'uppercase',
                color: s.cashflowMonth >= 0 ? TEAL : c.red,
                fontWeight: 600,
              }}
            >
              Cashflow neto / mes
            </p>
            <p
              style={{
                fontSize: 28,
                fontWeight: 800,
                color: s.cashflowMonth >= 0 ? c.text : c.red,
                marginTop: 10,
                letterSpacing: '-0.02em',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {(s.cashflowMonth >= 0 ? '' : '') + fmt(s.cashflowMonth)}
            </p>
            <p style={{ fontSize: 12, color: c.textMuted, marginTop: 6 }}>
              {fmt(s.cashflowMonth * 12)} anual tras gastos e hipoteca
            </p>
          </div>

          {/* Equity vs hipotecas */}
          <div
            style={{
              padding: '18px 20px',
              background: c.card,
              border: `1px solid ${c.border}`,
              borderRadius: 12,
            }}
          >
            <p
              style={{
                fontSize: 10,
                letterSpacing: '0.10em',
                textTransform: 'uppercase',
                color: c.textSecondary,
                fontWeight: 600,
              }}
            >
              Equity vs hipotecas
            </p>
            <div style={{ display: 'flex', gap: 14, marginTop: 10, alignItems: 'baseline' }}>
              <p
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  color: c.text,
                  fontVariantNumeric: 'tabular-nums',
                  letterSpacing: '-0.01em',
                }}
              >
                {fmt(s.totalEquity)}
              </p>
              <span style={{ fontSize: 12, color: c.textMuted }}>equity</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 10 }}>
              <div
                style={{
                  flex: 1,
                  height: 6,
                  background: c.barTrack,
                  borderRadius: 999,
                  overflow: 'hidden',
                  display: 'flex',
                }}
              >
                <div style={{ width: 100 - s.ltv + '%', background: TEAL }} />
                <div style={{ width: s.ltv + '%', background: c.red }} />
              </div>
              <span
                style={{
                  fontSize: 11,
                  color: c.textSecondary,
                  fontWeight: 600,
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                LTV {s.ltv.toFixed(1)}%
              </span>
            </div>
            <p
              style={{
                fontSize: 11,
                color: c.textMuted,
                marginTop: 8,
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {fmt(s.totalLoans)} en hipotecas · {fmt(s.totalValue)} valor total
            </p>
          </div>
        </div>
      </Card>

      {/* Property cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <p
          style={{
            fontSize: 11,
            letterSpacing: '0.10em',
            textTransform: 'uppercase',
            color: c.textSecondary,
            fontWeight: 600,
          }}
        >
          Propiedades · click para expandir
        </p>
        {realEstate.properties.map((p) => (
          <PropertyCard key={p.id} prop={p} />
        ))}
      </div>

      {/* Fictitious banner */}
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
        <strong>⚠️ Datos ficticios:</strong> financiación, costes y valor actual son
        estimativos. Reemplázalos en{' '}
        <code style={{ fontFamily: 'ui-monospace, Menlo, monospace' }}>
          src/data/portfolio.js → _properties
        </code>
        .
      </div>
    </div>
  );
}
