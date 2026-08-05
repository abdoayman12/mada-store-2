"use client";

import { useState } from "react";
import { FaStar } from "react-icons/fa";
import { FiStar } from "react-icons/fi";

type StarSelectorProps = {
    value: number; // التقييم الحالي المختار (0 = مش مختار)
    onChange: (rating: number) => void;
    size?: number;
    readonly?: boolean; // عرض فقط بدون تفاعل
};

export default function StarSelector({
    value,
    onChange,
    size = 26,
    readonly = false,
}: StarSelectorProps) {
    const [hovered, setHovered] = useState(0);
    const active = hovered || value;

    const labels: Record<number, string> = {
        1: "سيء",
        2: "مقبول",
        3: "جيد",
        4: "جيد جدًا",
        5: "ممتاز",
    };

    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        disabled={readonly}
                        onClick={() => !readonly && onChange(star)}
                        onMouseEnter={() => !readonly && setHovered(star)}
                        onMouseLeave={() => !readonly && setHovered(0)}
                        className={`transition-transform ${!readonly ? "hover:scale-110 cursor-pointer" : "cursor-default"}`}
                        aria-label={`${star} نجوم`}
                    >
                        {star <= active ? (
                            <FaStar
                                size={size}
                                className="text-clay-400 drop-shadow-sm"
                            />
                        ) : (
                            <FiStar size={size} className="text-ink-faint" />
                        )}
                    </button>
                ))}
            </div>
            {/* label نصي يظهر تحت النجوم عند التفاعل */}
            {!readonly && (
                <span className="h-5 text-sm font-semibold text-clay-500">
                    {hovered ? labels[hovered] : value ? labels[value] : ""}
                </span>
            )}
        </div>
    );
}
