import { useColors } from '../hooks/useColors';

export default function DataTable({ columns, data, className = '' }) {
  const c = useColors();
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full text-sm">
        <thead>
          <tr style={{ borderBottom: `1px solid ${c.border}` }}>
            {columns.map((col) => (
              <th key={col.key} className={`py-3 px-3 text-left text-xs font-medium uppercase tracking-wider ${col.align === 'right' ? 'text-right' : ''}`} style={{ color: c.textSecondary }}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i} className="transition-colors" style={{ borderBottom: `1px solid ${c.border}40` }}
              onMouseEnter={(e) => e.currentTarget.style.background = `${c.border}30`}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              {columns.map((col) => (
                <td key={col.key} className={`py-3 px-3 ${col.align === 'right' ? 'text-right' : ''} ${col.className || ''}`}>
                  {col.render ? col.render(row[col.key], row, c) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
