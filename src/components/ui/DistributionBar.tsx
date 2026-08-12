import { FaStar } from "react-icons/fa";

/** شريط توزيع النجوم */
function DistributionBar({
    star,
    count,
    total,
}: {
    star: number;
    count: number;
    total: number;
}) {
    const pct = total > 0 ? Math.round((count / total) * 100) : 0;
    return (
        <div className="flex items-center gap-2 text-sm">
            <span className="w-4 text-left text-xs font-bold text-ink-soft">
                {star}
            </span>
            <FaStar size={12} className="text-clay-400 shrink-0" />
            <div className="flex-1 h-2 rounded-full bg-line overflow-hidden">
                <div
                    className="h-full rounded-full bg-clay-400 transition-all duration-700"
                    style={{ width: `${pct}%` }}
                />
            </div>
            <span className="w-6 text-xs text-ink-soft text-left">{count}</span>
        </div>
    );
}

export default DistributionBar