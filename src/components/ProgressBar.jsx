import { useColors } from '../hooks/useColors';

export default function ProgressBar({ value, max = 100, color, height = 6 }) {
  const c = useColors();
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  return (
    <div
      style={{
        height,
        background: c.barTrack,
        borderRadius: 999,
        overflow: 'hidden',
        width: '100%',
      }}
    >
      <div
        style={{
          height: '100%',
          width: pct + '%',
          background: color || c.gold,
          transition: 'width .4s cubic-bezier(0.22,0.61,0.36,1)',
        }}
      />
    </div>
  );
}
