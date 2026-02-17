import { TrendingUp, TrendingDown } from 'lucide-react';

export default function KPI({ label, value, change, icon: Icon, prefix = '€' }) {
  const isPositive = change >= 0;
  return (
    <div className="bg-[#1a2035] border border-[#1e293b] rounded-xl p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-[#94a3b8] uppercase tracking-wider">{label}</span>
        {Icon && <Icon size={18} className="text-[#64748b]" />}
      </div>
      <p className="text-2xl font-bold text-white">{prefix}{typeof value === 'number' ? value.toLocaleString('es-ES') : value}</p>
      {change !== undefined && (
        <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${isPositive ? 'text-[#10b981]' : 'text-[#ef4444]'}`}>
          {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          {isPositive ? '+' : ''}{change}%
        </div>
      )}
    </div>
  );
}
