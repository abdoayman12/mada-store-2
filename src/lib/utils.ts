import { Category } from "@/generated/prisma/client";

export function cn(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(" ");
}

export function formatPrice(value: number) {
    return new Intl.NumberFormat("ar-EG", {
        maximumFractionDigits: 0,
    }).format(value);
}

export function currency(value: number) {
    return `${formatPrice(value)} ج.م`;
}

export function findCategory(id: string, category: Category[]) {
    return category.find((cat) => cat.id === id);
}
