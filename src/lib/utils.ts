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
