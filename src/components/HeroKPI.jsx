import { useColors } from '../hooks/useColors';

export default function HeroKPI({ label, value, delta, deltaAbs, icon: Icon, sub }) {
  const c = useColors();
  const positive = delta === undefined ? null : delta >= 0;

  return (
    <div
      style={{
        background: `linear-gradient(135deg, ${c.goldBg}, ${c.goldBgLight})`,
        border: `1px solid ${c.goldBorder}`,
        borderRadius: 20,
        padding: '24px 28px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
        {Icon && <Icon size={16} color={c.gold} />}
        <span
          style={{
            fontSize: 10,
            fontWeight: 500,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: c.gold,
          }}
        >
          {label}
        </span>
      </div>
      <p
        style={{
          fontSize: 44,
          fontWeight: 800,
          letterSpacing: '-0.025em',
          color: c.text,
          lineHeight: 1,
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {value}
      </p>
      {delta !== undefined && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 14 }}>
          <span
            style={{
              background: positive ? c.greenBg : c.redBg,
              color: positive ? c.green : c.red,
              border: `1px solid ${positive ? c.greenBorder : c.redBorder}`,
              padding: '3px 10px',
              borderRadius: 999,
              fontSize: 12,
              fontWeight: 600,
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {(positive ? '▲ +' : '▼ ') + Math.abs(delta).toFixed(2) + '%'}
          </span>
          {deltaAbs !== undefined && (
            <span style={{ fontSize: 12, color: c.textMuted, fontVariantNumeric: 'tabular-nums' }}>
              {(positive ? '+' : '−') + '€' + Math.abs(deltaAbs).toLocaleString('es-ES')}
            </span>
          )}
        </div>
      )}
      {sub && (
        <p style={{ fontSize: 11, color: c.textMuted, marginTop: 8 }}>{sub}</p>
      )}
    </div>
  );
}
