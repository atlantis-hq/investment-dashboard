import { useState } from 'react';
import { useColors } from '../hooks/useColors';

export default function Card({
  children,
  className = '',
  title,
  subtitle,
  action,
  pad = 20,
  hover = false,
  onClick,
  style,
}) {
  const c = useColors();
  const [h, setH] = useState(false);
  const interactive = hover || !!onClick;

  return (
    <div
      onClick={onClick}
      onMouseEnter={interactive ? () => setH(true) : undefined}
      onMouseLeave={interactive ? () => setH(false) : undefined}
      className={className}
      style={{
        background: interactive && h ? c.cardHover : c.card,
        border: `1px solid ${interactive && h ? c.borderHover : c.border}`,
        borderRadius: 16,
        padding: pad,
        transition: 'all .15s ease',
        cursor: onClick ? 'pointer' : 'default',
        ...style,
      }}
    >
      {(title || subtitle || action) && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: 16,
          }}
        >
          <div>
            {title && (
              <h3 style={{ fontSize: 14, fontWeight: 600, color: c.text }}>{title}</h3>
            )}
            {subtitle && (
              <p style={{ fontSize: 12, color: c.textMuted, marginTop: 2 }}>{subtitle}</p>
            )}
          </div>
          {action}
        </div>
      )}
      {children}
    </div>
  );
}
