import { useState } from 'react';
import { Handshake } from 'lucide-react';
import { usePortfolio } from '../hooks/usePortfolioData';
import { useColors } from '../hooks/useColors';
import MobileTopBar from '../components/MobileTopBar';
import Sheet, { SheetRow } from '../components/Sheet';

const eur0 = (n) => '€' + Math.round(n || 0).toLocaleString('es-ES');
const signed = (n, d = 2) => (n >= 0 ? '+' : '') + (n || 0).toFixed(d);

function CategoryHeader({ setPage, title, value, deltaPct, color, Ic }) {
  const c = useColors();
  return (
    <div>
      <MobileTopBar title={title} back onBack={() => setPage('overview')} />
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
          {Ic && (
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: 8,
                background: color + '22',
                color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ic size={14} />
            </div>
          )}
          <p
            style={{
              fontSize: 11,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color,
              fontWeight: 500,
            }}
          >
            {title}
          </p>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            gap: 12,
            flexWrap: 'wrap',
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
            {eur0(value)}
          </p>
          {deltaPct !== undefined && deltaPct !== null && (
            <span
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: deltaPct >= 0 ? c.green : c.red,
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {signed(deltaPct)}%
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function LoansMobile({ setPage }) {
  const { loans, loansSummary: ls } = usePortfolio();
  const c = useColors();
  const [sel, setSel] = useState(null);

  const sorted = [...loans].sort((a, b) => {
    const toKey = (s) => {
      const [d, m, y] = s.split('/');
      return +y * 10000 + +m * 100 + +d;
    };
    return toKey(a.endDate) - toKey(b.endDate);
  });

  const totalCapital = ls.totalCapital;
  const avgReturn = totalCapital > 0 ? (ls.totalInterestEarned / totalCapital) * 100 : 0;

  return (
    <div className="bc-fade">
      <CategoryHeader
        setPage={setPage}
        title="Préstamos"
        value={totalCapital}
        deltaPct={avgReturn}
        color={c.purple}
        Ic={Handshake}
      />
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
        {loans.length} préstamos
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {sorted.map((l) => {
          const totalCuotas = l.cuotasPagadas + l.cuotasRestantes;
          const pct = (l.cuotasPagadas / totalCuotas) * 100;
          return (
            <button
              key={l.id}
              onClick={() => setSel(l)}
              style={{
                background: c.card,
                border: `1px solid ${c.border}`,
                borderRadius: 12,
                padding: '12px 14px',
                cursor: 'pointer',
                fontFamily: 'inherit',
                textAlign: 'left',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  gap: 10,
                }}
              >
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: c.text,
                    flex: 1,
                    minWidth: 0,
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                  }}
                >
                  {l.project}
                </span>
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: c.text,
                    fontVariantNumeric: 'tabular-nums',
                    flexShrink: 0,
                  }}
                >
                  {eur0(l.capital)}
                </span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: 11,
                  color: c.textMuted,
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                <span>
                  {l.tir.toFixed(2)}% TIR · vence {l.endDate}
                </span>
                <span style={{ color: c.purple }}>
                  {l.cuotasPagadas}/{totalCuotas} cuotas
                </span>
              </div>
              <div
                style={{
                  height: 3,
                  background: c.barTrack,
                  borderRadius: 999,
                  overflow: 'hidden',
                  marginTop: 2,
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: pct + '%',
                    background: c.purple,
                  }}
                />
              </div>
            </button>
          );
        })}
      </div>

      <Sheet
        open={!!sel}
        onClose={() => setSel(null)}
        title={sel ? sel.project : ''}
      >
        {sel && (
          <div>
            <SheetRow label="Capital prestado" value={eur0(sel.capital)} />
            <SheetRow label="TIR" value={sel.tir.toFixed(2) + '%'} color={c.gold} />
            <SheetRow label="Fecha inicio" value={sel.startDate} />
            <SheetRow label="Fecha fin" value={sel.endDate} />
            <SheetRow
              label="Cuotas pagadas"
              value={sel.cuotasPagadas + ' / ' + (sel.cuotasPagadas + sel.cuotasRestantes)}
            />
            <SheetRow label="Capital pendiente" value={eur0(sel.capitalPending)} />
            <SheetRow
              label="Intereses generados"
              value={eur0(sel.interestEarned)}
              color={c.green}
            />
          </div>
        )}
      </Sheet>
    </div>
  );
}
