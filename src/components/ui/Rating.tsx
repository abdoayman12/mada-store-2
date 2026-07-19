import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

export default function Rating({ value, count, size = 13 }: { value: number; count?: number; size?: number }) {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);

  return (
    <div className="flex items-center gap-1.5" aria-label={`التقييم ${value} من 5`}>
      <div className="flex items-center gap-0.5 text-clay-400">
        {Array.from({ length: full }).map((_, i) => (
          <FaStar key={`f${i}`} size={size} />
        ))}
        {half && <FaStarHalfAlt size={size} />}
        {Array.from({ length: empty }).map((_, i) => (
          <FaRegStar key={`e${i}`} size={size} />
        ))}
      </div>
      {count !== undefined && <span className="text-xs text-ink-soft">({count})</span>}
    </div>
  );
}
