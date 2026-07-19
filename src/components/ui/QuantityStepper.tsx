"use client";

import { FiMinus, FiPlus } from "react-icons/fi";

export default function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 99,
}: {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
}) {
  return (
    <div className="inline-flex items-center rounded-full border border-line bg-cream-soft">
      <button
        type="button"
        aria-label="إنقاص الكمية"
        onClick={() => onChange(Math.max(min, value - 1))}
        className="flex h-9 w-9 items-center justify-center rounded-full text-ink-soft transition hover:bg-sage-50 hover:text-sage-700 disabled:opacity-30"
        disabled={value <= min}
      >
        <FiMinus size={14} />
      </button>
      <span className="w-8 text-center text-sm font-bold text-ink">{value}</span>
      <button
        type="button"
        aria-label="زيادة الكمية"
        onClick={() => onChange(Math.min(max, value + 1))}
        className="flex h-9 w-9 items-center justify-center rounded-full text-ink-soft transition hover:bg-sage-50 hover:text-sage-700 disabled:opacity-30"
        disabled={value >= max}
      >
        <FiPlus size={14} />
      </button>
    </div>
  );
}
