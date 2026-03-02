import { useColors } from '../hooks/useColors';

export default function Card({ children, className = '', title, subtitle }) {
  const c = useColors();
  return (
    <div className={`rounded-xl p-5 ${className}`} style={{ background: c.card, border: `1px solid ${c.border}` }}>
      {title && (
        <div className="mb-4">
          <h3 className="text-sm font-semibold" style={{ color: c.text }}>{title}</h3>
          {subtitle && <p className="text-xs mt-0.5" style={{ color: c.textSecondary }}>{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  );
}
