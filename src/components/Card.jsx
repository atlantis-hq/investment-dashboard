export default function Card({ children, className = '', title, subtitle }) {
  return (
    <div className={`bg-[#1a2035] border border-[#1e293b] rounded-xl p-5 ${className}`}>
      {title && (
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-white">{title}</h3>
          {subtitle && <p className="text-xs text-[#94a3b8] mt-0.5">{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  );
}
