import { TrendingUp, TrendingDown } from 'lucide-react';
import { useColors } from '../hooks/useColors';

export default function KPI({ label, value, change, sub, icon: Icon, iconColor, valueColor, prefix = '€' }) {
  const c = useColors();
  const hasChange = change !== undefined && change !== null;
  const positive = hasChange ? change >= 0 : null;

  const displayValue = typeof value === 'number'
    ? prefix + value.toLocaleString('es-ES')
    : value;

  return (
    <div
      style={{
        background: c.card,
        border: `1px solid ${c.border}`,
        borderRadius: 16,
        padding: 20,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
        {Icon && <Icon size={14} color={iconColor || c.textSecondary} />}
        <span
          style={{
            fontSize: 10,
            fontWeight: 500,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: c.textSecondary,
          }}
        >
          {label}
        </span>
      </div>
      <p
        style={{
          fontSize: 24,
          fontWeight: 700,
          letterSpacing: '-0.01em',
          color: valueColor || c.text,
          fontVariantNumeric: 'tabular-nums',
          lineHeight: 1.1,
        }}
      >
        {displayValue}
      </p>
      {hasChange && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            marginTop: 8,
            fontSize: 11,
            fontWeight: 500,
            color: positive ? c.green : c.red,
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {positive ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
          {(positive ? '+' : '') + change + '%'}
        </div>
      )}
      {sub && (
        <p style={{ fontSize: 11, color: c.textMuted, marginTop: 8 }}>{sub}</p>
      )}
    </div>
  );
}
