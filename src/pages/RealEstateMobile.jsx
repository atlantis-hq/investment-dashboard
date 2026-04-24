import { useState } from 'react';
import { Home, Building, ChevronRight } from 'lucide-react';
import { usePortfolio } from '../hooks/usePortfolioData';
import { useColors } from '../hooks/useColors';
import MobileTopBar from '../components/MobileTopBar';
import Sheet, { SheetRow } from '../components/Sheet';

const TEAL = '#14b8a6';

const eur0 = (n) => '€' + Math.round(n || 0).toLocaleString('es-ES');
const signed = (n, d = 2) => (n >= 0 ? '+' : '') + (n || 0).toFixed(d);

export default function RealEstateMobile({ setPage }) {
  const { realEstate } = usePortfolio();
  const c = useColors();
  const s = realEstate.summary;
  const [sel, setSel] = useState(null);

  return (
    <div className="bc-fade">
      <MobileTopBar
        title="Inmuebles"
        back
        onBack={() => setPage('overview')}
      />

      {/* Hero: valor total + yield neto */}
      <div
        style={{
          background: c.card,
          border: `1px solid ${c.border}`,
          borderRadius: 14,
          padding: '18px 16px',
          marginBottom: 16,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: 8,
              background: TEAL + '22',
              color: TEAL,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Home size={14} />
          </div>
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
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            gap: 12,
          }}
        >
          <p
            style={{
              fontSize: 28,
              fontWeight: 800,
              color: c.text,
              letterSpacing: '-0.02em',
              fontVariantNumeric: 'tabular-nums',
              lineHeight: 1,
            }}
          >
            {eur0(s.totalValue)}
          </p>
          <div style={{ textAlign: 'right' }}>
            <p
              style={{
                fontSize: 10,
                letterSpacing: '0.10em',
                textTransform: 'uppercase',
                color: c.textSecondary,
              }}
            >
              Yield neto
            </p>
            <p
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: s.avgYieldNet >= 0 ? c.green : c.red,
                fontVariantNumeric: 'tabular-nums',
                marginTop: 2,
              }}
            >
              {s.avgYieldNet.toFixed(2)}%
            </p>
          </div>
        </div>
        <div
          style={{
            marginTop: 14,
            paddingTop: 12,
            borderTop: `1px solid ${c.border}`,
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: 11,
            color: c.textMuted,
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          <span>{eur0(s.rentMonth)}/mes brutos</span>
          <span>
            Cashflow {(s.cashflowMonth >= 0 ? '+' : '−') + eur0(Math.abs(s.cashflowMonth))}/mes
          </span>
        </div>
      </div>

      <p
        style={{
          fontSize: 11,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: c.textSecondary,
          fontWeight: 500,
          margin: '16px 0 8px',
        }}
      >
        {s.properties} propiedades
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {realEstate.properties.map((p) => {
          const Ic = p.type === 'Residencial' ? Home : Building;
          return (
            <button
              key={p.id}
              onClick={() => setSel(p)}
              style={{
                background: c.card,
                border: `1px solid ${c.border}`,
                borderRadius: 14,
                padding: '14px 14px',
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
                cursor: 'pointer',
                fontFamily: 'inherit',
                textAlign: 'left',
                width: '100%',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 10,
                    background: TEAL + '22',
                    color: TEAL,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Ic size={16} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: c.text,
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                    }}
                  >
                    {p.name}
                  </p>
                  <p style={{ fontSize: 11, color: c.textMuted, marginTop: 2 }}>
                    {p.type} · {p.city}
                  </p>
                </div>
                <ChevronRight size={14} color={c.textMuted} />
              </div>
              <div
                style={{
                  display: 'flex',
                  gap: 16,
                  paddingTop: 10,
                  borderTop: `1px solid ${c.border}`,
                }}
              >
                <div style={{ flex: 1 }}>
                  <p
                    style={{
                      fontSize: 10,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      color: c.textSecondary,
                    }}
                  >
                    Renta/mes
                  </p>
                  <p
                    style={{
                      fontSize: 16,
                      fontWeight: 700,
                      color: c.green,
                      marginTop: 3,
                      fontVariantNumeric: 'tabular-nums',
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {eur0(p.income.rent)}
                  </p>
                </div>
                <div style={{ flex: 1 }}>
                  <p
                    style={{
                      fontSize: 10,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      color: c.textSecondary,
                    }}
                  >
                    Cash-on-cash
                  </p>
                  <p
                    style={{
                      fontSize: 16,
                      fontWeight: 700,
                      color: p.calc.cashOnCash >= 0 ? c.green : c.red,
                      marginTop: 3,
                      fontVariantNumeric: 'tabular-nums',
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {signed(p.calc.cashOnCash, 2)}%
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <Sheet
        open={!!sel}
        onClose={() => setSel(null)}
        title={sel ? sel.name : ''}
      >
        {sel && (
          <div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12 }}>
              <span
                style={{
                  fontSize: 10,
                  padding: '3px 8px',
                  borderRadius: 999,
                  background: TEAL + '22',
                  color: TEAL,
                  fontWeight: 600,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                }}
              >
                {sel.type}
              </span>
              <span style={{ fontSize: 12, color: c.textMuted }}>
                {sel.city} · {sel.purchase.date}
              </span>
            </div>

            <p
              style={{
                fontSize: 10,
                letterSpacing: '0.10em',
                textTransform: 'uppercase',
                color: TEAL,
                fontWeight: 600,
                margin: '14px 0 6px',
              }}
            >
              Adquisición
            </p>
            <SheetRow label="Precio compra" value={eur0(sel.purchase.price)} />
            <SheetRow label="Gastos (~10%)" value={eur0(sel.purchase.fees)} />
            <SheetRow label="Total invertido" value={eur0(sel.calc.acqTotal)} />
            <SheetRow label="Valor actual est." value={eur0(sel.purchase.currentValue)} />
            <SheetRow
              label="Revalorización"
              value={signed(sel.calc.appreciation, 1) + '%'}
              color={sel.calc.appreciation >= 0 ? c.green : c.red}
            />

            <p
              style={{
                fontSize: 10,
                letterSpacing: '0.10em',
                textTransform: 'uppercase',
                color: TEAL,
                fontWeight: 600,
                margin: '18px 0 6px',
              }}
            >
              Financiación
            </p>
            {sel.financing.cash ? (
              <SheetRow label="Modalidad" value="Compra al contado" color={c.gold} />
            ) : (
              <>
                <SheetRow label="Capital aportado" value={eur0(sel.financing.equity)} />
                <SheetRow label="Préstamo" value={eur0(sel.financing.loan)} />
                <SheetRow label="TIN" value={sel.financing.tin.toFixed(2) + '%'} />
                <SheetRow label="Plazo" value={sel.financing.years + ' años'} />
                <SheetRow
                  label="Cuota mensual"
                  value={eur0(sel.financing.monthlyPayment)}
                />
                <SheetRow label="LTV actual" value={sel.calc.ltv.toFixed(1) + '%'} />
              </>
            )}

            <p
              style={{
                fontSize: 10,
                letterSpacing: '0.10em',
                textTransform: 'uppercase',
                color: TEAL,
                fontWeight: 600,
                margin: '18px 0 6px',
              }}
            >
              Ingresos / Gastos
            </p>
            <SheetRow label="Renta mensual" value={eur0(sel.income.rent)} color={c.green} />
            <SheetRow label="Vacancia est." value={sel.income.vacancyPct + '%'} />
            <SheetRow label="Comunidad/mes" value={eur0(sel.expenses.community)} />
            <SheetRow label="IBI/año" value={eur0(sel.expenses.ibiYear)} />
            <SheetRow label="Seguro/año" value={eur0(sel.expenses.insuranceYear)} />
            {sel.expenses.mgmtPct > 0 && (
              <SheetRow label="Gestión" value={sel.expenses.mgmtPct + '%'} />
            )}
            <SheetRow label="Mantenimiento" value={sel.expenses.maintenancePct + '%'} />

            <p
              style={{
                fontSize: 10,
                letterSpacing: '0.10em',
                textTransform: 'uppercase',
                color: TEAL,
                fontWeight: 600,
                margin: '18px 0 6px',
              }}
            >
              Rentabilidad
            </p>
            <SheetRow
              label="Yield bruto"
              value={signed(sel.calc.yieldGross, 2) + '%'}
            />
            <SheetRow
              label="Yield neto"
              value={signed(sel.calc.yieldNet, 2) + '%'}
              color={sel.calc.yieldNet >= 0 ? c.green : c.red}
            />
            <SheetRow
              label="Cashflow mensual"
              value={eur0(sel.calc.cashflowMonth)}
              color={sel.calc.cashflowMonth >= 0 ? c.green : c.red}
            />
            <SheetRow
              label="Cashflow anual"
              value={eur0(sel.calc.cashflowYear)}
              color={sel.calc.cashflowYear >= 0 ? c.green : c.red}
            />
            <SheetRow
              label="Cash-on-cash"
              value={signed(sel.calc.cashOnCash, 2) + '%'}
              color={sel.calc.cashOnCash >= 0 ? c.green : c.red}
            />
          </div>
        )}
      </Sheet>
    </div>
  );
}
