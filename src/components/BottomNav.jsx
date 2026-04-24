import { LayoutDashboard, Handshake, Bitcoin, Menu } from 'lucide-react';
import { useColors } from '../hooks/useColors';

const items = [
  { id: 'overview', label: 'Resumen', icon: LayoutDashboard },
  { id: 'loans', label: 'Préstamos', icon: Handshake },
  { id: 'crypto', label: 'Crypto', icon: Bitcoin },
  { id: 'more', label: 'Más', icon: Menu },
];

export default function BottomNav({ page, setPage, openMenu }) {
  const c = useColors();
  const moreActive = !['overview', 'loans', 'crypto'].includes(page);

  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 30,
        background: 'rgba(10,14,23,0.92)',
        borderTop: `1px solid ${c.border}`,
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        display: 'flex',
        padding: '8px 8px 10px',
        paddingBottom: 'max(10px, env(safe-area-inset-bottom, 10px))',
      }}
    >
      {items.map(({ id, label, icon: Icon }) => {
        const active = id === 'more' ? moreActive : page === id;
        return (
          <button
            key={id}
            onClick={() => (id === 'more' ? openMenu() : setPage(id))}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'inherit',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 3,
              padding: 6,
              color: active ? c.gold : c.textSecondary,
            }}
          >
            <Icon size={20} />
            <span style={{ fontSize: 10, fontWeight: 500 }}>{label}</span>
          </button>
        );
      })}
    </nav>
  );
}
