import { cn } from "@/lib/utils";

export default function SectionDivider({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center justify-center py-2", className)} aria-hidden="true">
      <svg width="160" height="24" viewBox="0 0 160 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M2 18C20 18 26 4 40 4C52 4 54 16 66 16C76 16 80 6 92 6"
          stroke="#A2B79B"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="118" cy="12" r="3" fill="#C9925E" />
        <circle cx="134" cy="12" r="3" fill="#C9925E" />
        <path d="M96 6L108 6L118 12" stroke="#A2B79B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}
