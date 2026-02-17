export default function DataTable({ columns, data, className = '' }) {
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[#1e293b]">
            {columns.map((col) => (
              <th key={col.key} className={`py-3 px-3 text-left text-xs font-medium text-[#94a3b8] uppercase tracking-wider ${col.align === 'right' ? 'text-right' : ''}`}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i} className="border-b border-[#1e293b]/50 hover:bg-white/[0.02] transition-colors">
              {columns.map((col) => (
                <td key={col.key} className={`py-3 px-3 ${col.align === 'right' ? 'text-right' : ''} ${col.className || ''}`}>
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
