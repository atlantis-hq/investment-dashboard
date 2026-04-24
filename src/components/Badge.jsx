import { useColors } from '../hooks/useColors';

export default function Badge({ children, color, bg, border, dashed }) {
  const c = useColors();
  const _color = color || c.gold;
  const _bg = bg || _color + '22';
  return (
    <span
      style={{
        background: _bg,
        color: _color,
        border: border ? `1px ${dashed ? 'dashed' : 'solid'} ${border}` : 'none',
        padding: '3px 10px',
        borderRadius: 999,
        fontSize: 10,
        fontWeight: 600,
        letterSpacing: '0.02em',
        whiteSpace: 'nowrap',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
      }}
    >
      {children}
    </span>
  );
}
