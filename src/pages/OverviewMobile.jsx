import {
  TrendingUp,
  Landmark,
  Bitcoin,
  Shield,
  Handshake,
  Building2,
  Rocket,
  AlertTriangle,
  ChevronRight,
} from 'lucide-react';
import { usePortfolio } from '../hooks/usePortfolioData';
import { useColors } from '../hooks/useColors';
import MobileTopBar from '../components/MobileTopBar';

const eur0 = (n) => '€' + Math.round(n || 0).toLocaleString('es-ES');
const signed = (n, d = 2) => (n >= 0 ? '+' : '') + (n || 0).toFixed(d);

const meta = {
  'ETFs + Fondos':     { page: 'etfs',      Ic: TrendingUp },
  'Fondos Monetarios': { page: 'monetary',  Ic: Landmark },
  'Criptomonedas':     { page: 'crypto',    Ic: Bitcoin },
  'Renta Fija':        { page: 'rentafija', Ic: Shield },
  'Préstamos':         { page: 'loans',     Ic: Handshake },
  'PE':                { page: 'pe',        Ic: Building2 },
  'VC Startups':       { page: 'vc',        Ic: Rocket },
};

export default function OverviewMobile({ setPage }) {
  const { portfolioSummary: ps, categoryAllocation, alerts = [] } = usePortfolio();
  const c = useColors();
  const total = ps.totalValue;

  return (
    <div className="bc-fade" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <MobileTopBar title="Resumen" />

      {/* HERO */}
      <div
        style={{
          background: `linear-gradient(135deg, ${c.goldBg}, ${c.goldBgLight})`,
          border: `1px solid ${c.goldBorder}`,
          borderRadius: 18,
          padding: '22px 20px',
        }}
      >
        <p
          style={{
            fontSize: 11,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: c.gold,
            fontWeight: 500,
          }}
        >
          Patrimonio total
        </p>
        <p
          style={{
            fontSize: 40,
            fontWeight: 800,
            color: c.text,
            letterSpacing: '-0.025em',
            marginTop: 8,
            fontVariantNumeric: 'tabular-nums',
            lineHeight: 1,
          }}
        >
          {eur0(total)}
        </p>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 14 }}>
          <span
            style={{
              background: ps.totalReturnPct >= 0 ? c.greenBg : c.redBg,
              color: ps.totalReturnPct >= 0 ? c.green : c.red,
              border: `1px solid ${ps.totalReturnPct >= 0 ? c.greenBorder : c.redBorder}`,
              padding: '4px 10px',
              borderRadius: 999,
              fontSize: 12,
              fontWeight: 600,
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {signed(ps.totalReturnPct)}%
          </span>
          <span
            style={{
              fontSize: 12,
              color: c.textMuted,
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {(ps.totalReturn >= 0 ? '+' : '−') + eur0(Math.abs(ps.totalReturn))}
          </span>
        </div>
        <div
          style={{
            marginTop: 18,
            paddingTop: 14,
            borderTop: `1px solid ${c.goldBorder}`,
            display: 'flex',
            alignItems: 'baseline',
            gap: 10,
          }}
        >
          <span
            style={{
              fontSize: 11,
              letterSpacing: '0.10em',
              textTransform: 'uppercase',
              color: c.textSecondary,
              fontWeight: 500,
            }}
          >
            CAGR
          </span>
          <span
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: ps.annualizedReturnPct >= 0 ? c.green : c.red,
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {signed(ps.annualizedReturnPct)}%
          </span>
          <span style={{ fontSize: 11, color: c.textMuted }}>anualizado</span>
        </div>
      </div>

      {/* LABEL */}
      <p
        style={{
          fontSize: 11,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: c.textSecondary,
          fontWeight: 500,
          marginTop: 4,
        }}
      >
        Por categoría
      </p>

      {/* 7 CARDS */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {categoryAllocation.map((cat) => {
          const m = meta[cat.name] || {};
          const share = total > 0 ? (cat.value / total) * 100 : 0;
          return (
            <button
              key={cat.name}
              onClick={() => m.page && setPage(m.page)}
              style={{
                background: c.card,
                border: `1px solid ${c.border}`,
                borderRadius: 12,
                padding: '14px 14px',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                cursor: 'pointer',
                fontFamily: 'inherit',
                textAlign: 'left',
                width: '100%',
              }}
            >
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 10,
                  background: cat.color + '22',
                  color: cat.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {m.Ic && <m.Ic size={16} />}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p
                  style={{
                    fontSize: 13,
                    fontWeight: 500,
                    color: c.text,
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                  }}
                >
                  {cat.name}
                </p>
                <p
                  style={{
                    fontSize: 11,
                    color: c.textMuted,
                    marginTop: 2,
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {share.toFixed(1)}% del portfolio
                </p>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <p
                  style={{
                    fontSize: 15,
                    fontWeight: 700,
                    color: c.text,
                    fontVariantNumeric: 'tabular-nums',
                    letterSpacing: '-0.01em',
                  }}
                >
                  {eur0(cat.value)}
                </p>
                <ChevronRight size={13} color={c.textMuted} style={{ marginTop: 4 }} />
              </div>
            </button>
          );
        })}
      </div>

      {/* Alertas card */}
      {alerts.length > 0 && (
        <button
          onClick={() => setPage('loans')}
          style={{
            background: c.redBg,
            border: `1px solid ${c.redBorder}`,
            borderRadius: 12,
            padding: '13px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            cursor: 'pointer',
            textAlign: 'left',
            fontFamily: 'inherit',
            width: '100%',
            marginTop: 8,
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: c.red + '22',
              color: c.red,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <AlertTriangle size={15} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 13, color: c.red, fontWeight: 600 }}>
              {alerts.length} {alerts.length === 1 ? 'alerta activa' : 'alertas activas'}
            </p>
            <p style={{ fontSize: 11, color: c.textMuted, marginTop: 2 }}>
              Vencimientos en &lt;60 días
            </p>
          </div>
          <ChevronRight size={14} color={c.red} />
        </button>
      )}
    </div>
  );
}
