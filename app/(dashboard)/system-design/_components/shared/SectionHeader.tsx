export function SectionHeader({
  icon: Icon, title, hint,
}: {
  icon: React.ElementType
  title: string
  hint?: string
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-md bg-surface-container-high border border-outline-variant flex items-center justify-center shrink-0">
          <Icon className="w-3.5 h-3.5 text-on-surface-variant" strokeWidth={1.75} />
        </div>
        <h2 className="text-sm font-semibold text-on-surface">{title}</h2>
      </div>
      {hint && (
        <p className="text-[10px] font-mono text-on-surface-variant/50">{hint}</p>
      )}
    </div>
  )
}
