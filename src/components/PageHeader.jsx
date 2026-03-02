import { ArrowLeft } from 'lucide-react';
import { useColors } from '../hooks/useColors';

export default function PageHeader({ title, subtitle, icon, setPage }) {
  const c = useColors();
  return (
    <div className="flex items-center gap-4 mb-8">
      <button
        onClick={() => setPage('overview')}
        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all"
        style={{ background: c.card, border: `1px solid ${c.border}`, color: c.textSecondary }}
        onMouseEnter={(e) => { e.currentTarget.style.color = c.gold; e.currentTarget.style.borderColor = c.goldBorder; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = c.textSecondary; e.currentTarget.style.borderColor = c.border; }}
      >
        <ArrowLeft size={18} />
      </button>
      <div className="flex items-center gap-3">
        {icon && <span className="text-3xl">{icon}</span>}
        <div>
          <h2 className="text-2xl font-bold" style={{ color: c.text }}>{title}</h2>
          {subtitle && <p className="text-sm mt-0.5" style={{ color: c.textMuted }}>{subtitle}</p>}
        </div>
      </div>
    </div>
  );
}
