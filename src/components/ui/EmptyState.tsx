import { ReactNode } from "react";

export default function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-3xl bg-white px-6 py-16 text-center shadow-soft">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-sage-50 text-sage-600">{icon}</div>
      <div className="space-y-1.5">
        <h3 className="font-display text-xl font-bold text-ink">{title}</h3>
        {description && <p className="text-sm text-ink-soft">{description}</p>}
      </div>
      {action}
    </div>
  );
}
