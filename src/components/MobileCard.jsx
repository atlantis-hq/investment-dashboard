import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { useColors } from '../hooks/useColors';

export function semaforoColor(value) {
  if (value > 0.5) return 'text-[#10b981]';
  if (value < -0.5) return 'text-[#ef4444]';
  return 'text-[#f59e0b]';
}

export function useSemaforo() {
  const c = useColors();
  return (value) => {
    if (value > 0.5) return c.green;
    if (value < -0.5) return c.red;
    return c.amber;
  };
}

export default function MobileCard({ title, subtitle, fields = [], accent = '#c8a97e', badge, badgeColor, children }) {
  const c = useColors();
  return (
    <div className="rounded-xl overflow-hidden" style={{ background: c.card, border: `1px solid ${c.border}` }}>
      <div className="border-l-4 p-4" style={{ borderLeftColor: accent }}>
        <div className="flex items-center justify-between mb-1">
          <h4 className="text-sm font-semibold" style={{ color: c.text }}>{title}</h4>
          {badge && <span className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ background: `${accent}22`, color: accent }}>{badge}</span>}
        </div>
        {subtitle && <p className="text-xs mb-3" style={{ color: c.textSecondary }}>{subtitle}</p>}
        {fields.length > 0 && (
          <div className="space-y-2 mt-3">
            {fields.map((f, i) => (
              <div key={i} className="flex justify-between items-center">
                <span className="text-xs" style={{ color: c.textSecondary }}>{f.label}</span>
                <span className={`text-sm font-medium ${f.color || ''}`} style={f.color ? {} : { color: c.text }}>{f.value}</span>
              </div>
            ))}
          </div>
        )}
        {children}
      </div>
    </div>
  );
}

export function AccordionCard({ title, subtitle, fields = [], accent = '#c8a97e', badge, badgeColor, summaryFields = [] }) {
  const [open, setOpen] = useState(false);
  const c = useColors();

  return (
    <div className="rounded-xl overflow-hidden" style={{ background: c.card, border: `1px solid ${c.border}` }}>
      <button onClick={() => setOpen(!open)} className="w-full border-l-4 p-4 text-left" style={{ borderLeftColor: accent }}>
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-semibold truncate" style={{ color: c.text }}>{title}</h4>
              {badge && <span className="text-[10px] px-2 py-0.5 rounded-full font-medium shrink-0" style={{ background: `${c.amber}22`, color: c.amber }}>{badge}</span>}
            </div>
          </div>
          <div className="ml-2" style={{ color: c.textSecondary }}>
            {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
        </div>
        {summaryFields.length > 0 && (
          <div className="flex gap-4 mt-2">
            {summaryFields.map((f, i) => (
              <div key={i} className="text-xs">
                <span style={{ color: c.textMuted }}>{f.label}: </span>
                <span className={f.color || ''} style={f.color ? {} : { color: c.text }}>{f.value}</span>
              </div>
            ))}
          </div>
        )}
      </button>
      {open && (
        <div className="px-4 py-3 space-y-2" style={{ borderTop: `1px solid ${c.border}` }}>
          {fields.map((f, i) => (
            <div key={i} className="flex justify-between items-center">
              <span className="text-xs" style={{ color: c.textSecondary }}>{f.label}</span>
              <span className={`text-sm font-medium ${f.color || ''}`} style={f.color ? {} : { color: c.text }}>{f.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
