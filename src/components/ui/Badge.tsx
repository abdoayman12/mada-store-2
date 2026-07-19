import { cn } from "@/lib/utils";

type Tone = "sage" | "clay" | "ink" | "muted";

export default function Badge({ children, tone = "sage", className }: { children: React.ReactNode; tone?: Tone; className?: string }) {
  const tones: Record<Tone, string> = {
    sage: "bg-sage-600 text-cream-soft",
    clay: "bg-clay-500 text-cream-soft",
    ink: "bg-ink text-cream-soft",
    muted: "bg-ink/10 text-ink-soft",
  };
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold tracking-wide", tones[tone], className)}>
      {children}
    </span>
  );
}
