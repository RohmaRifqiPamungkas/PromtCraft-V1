import { Label } from "@/components/ui/label"

export const fieldClass =
  "w-full rounded-lg border border-outline-variant bg-surface-container px-3 py-2 text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-colors"

export function Field({
  label, value, placeholder, onChange, hint,
}: {
  label?: string
  value: string
  placeholder?: string
  onChange: (v: string) => void
  hint?: string
}) {
  return (
    <div className="space-y-1.5">
      {label && (
        <Label className="text-[11px] font-mono uppercase tracking-wider text-on-surface-variant/70">
          {label}
        </Label>
      )}
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={fieldClass}
      />
      {hint && <p className="text-[11px] text-on-surface-variant/50 pl-0.5">{hint}</p>}
    </div>
  )
}
