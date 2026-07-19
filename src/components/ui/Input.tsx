import { InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface FieldWrapperProps {
  label?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  hint?: string;
}

export function FieldWrapper({ label, error, required, children, hint }: FieldWrapperProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-semibold text-ink">
          {label} {required && <span className="text-clay-500">*</span>}
        </label>
      )}
      {children}
      {hint && !error && <span className="text-xs text-ink-soft">{hint}</span>}
      {error && <span className="text-xs font-medium text-red-600">{error}</span>}
    </div>
  );
}

const baseFieldStyles =
  "w-full rounded-xl border bg-cream-soft px-4 py-2.5 text-sm text-ink placeholder:text-ink-faint transition-colors focus:outline-none focus:ring-2 focus:ring-sage-500/30";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({ className, error, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(baseFieldStyles, error ? "border-red-400" : "border-line focus:border-sage-500", className)}
    {...props}
  />
));
Input.displayName = "Input";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, error, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(baseFieldStyles, "min-h-[120px] resize-y", error ? "border-red-400" : "border-line focus:border-sage-500", className)}
    {...props}
  />
));
Textarea.displayName = "Textarea";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(({ className, error, children, ...props }, ref) => (
  <select
    ref={ref}
    className={cn(baseFieldStyles, "appearance-none bg-no-repeat", error ? "border-red-400" : "border-line focus:border-sage-500", className)}
    {...props}
  >
    {children}
  </select>
));
Select.displayName = "Select";
