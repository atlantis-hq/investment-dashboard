import { useEffect } from 'react';
import { X } from 'lucide-react';
import { useColors } from '../hooks/useColors';

export default function Sheet({ open, onClose, title, children }) {
  const c = useColors();

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(5,8,14,0.72)',
        zIndex: 40,
        display: 'flex',
        alignItems: 'flex-end',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: c.bg,
          borderTop: `1px solid ${c.border}`,
          borderRadius: '18px 18px 0 0',
          width: '100%',
          maxHeight: '85vh',
          overflowY: 'auto',
          padding: '10px 16px 28px',
          boxShadow: '0 -10px 40px rgba(0,0,0,0.5)',
        }}
      >
        <div
          style={{
            height: 4,
            width: 40,
            background: c.border,
            borderRadius: 999,
            margin: '6px auto 14px',
          }}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <h3
            style={{
              flex: 1,
              fontSize: 16,
              fontWeight: 700,
              color: c.text,
              letterSpacing: '-0.01em',
            }}
          >
            {title}
          </h3>
          <button
            onClick={onClose}
            style={{
              width: 30,
              height: 30,
              borderRadius: 999,
              background: c.card,
              border: `1px solid ${c.border}`,
              color: c.textSecondary,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={13} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function SheetRow({ label, value, color }) {
  const c = useColors();
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        padding: '11px 0',
        borderBottom: `1px solid ${c.border}`,
      }}
    >
      <span style={{ fontSize: 12, color: c.textSecondary }}>{label}</span>
      <span
        style={{
          fontSize: 14,
          fontWeight: 600,
          color: color || c.text,
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {value}
      </span>
    </div>
  );
}
