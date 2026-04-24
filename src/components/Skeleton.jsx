import { useColors } from '../hooks/useColors';

export default function Skeleton({ w = '100%', h = 16, radius = 8, style }) {
  const c = useColors();
  return (
    <div
      className="bc-skel"
      style={{
        width: w,
        height: h,
        borderRadius: radius,
        background: c.card,
        ...style,
      }}
    />
  );
}
