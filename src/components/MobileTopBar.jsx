import { ArrowLeft } from 'lucide-react';
import { useColors } from '../hooks/useColors';

export default function MobileTopBar({ title, back, onBack }) {
  const c = useColors();
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 0 14px' }}>
      {back && (
        <button
          onClick={onBack}
          style={{
            width: 36,
            height: 36,
            borderRadius: 999,
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
          <ArrowLeft size={15} />
        </button>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <h1
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: c.text,
            letterSpacing: '-0.01em',
          }}
        >
          {title}
        </h1>
      </div>
      {!back && (
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: 8,
            background: c.goldBg,
            border: `1px solid ${c.goldBorder}`,
            color: c.gold,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: 12,
          }}
        >
          BC
        </div>
      )}
    </div>
  );
}
