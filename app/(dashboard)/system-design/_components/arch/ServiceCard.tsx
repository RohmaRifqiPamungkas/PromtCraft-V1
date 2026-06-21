import { Box, Trash2 } from "lucide-react"
import { Field } from "../shared/Field"
import type { ArchService } from "./archData"

export function ServiceCard({
  service, index, onUpdate, onRemove, canRemove,
}: {
  service: ArchService
  index: number
  onUpdate: (s: ArchService) => void
  onRemove: () => void
  canRemove: boolean
}) {
  return (
    <div className="rounded-lg border border-outline-variant bg-surface-container-low p-3 space-y-2">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-secondary/10 border border-secondary/20 flex items-center justify-center shrink-0">
            <Box className="w-3 h-3 text-secondary/70" />
          </div>
          <span className="text-[11px] font-mono text-on-surface-variant/60">Service {index + 1}</span>
        </div>
        {canRemove && (
          <button
            onClick={onRemove}
            className="w-5 h-5 flex items-center justify-center text-on-surface-variant/30 hover:text-error/60 transition-colors"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Field
          value={service.name}
          placeholder="Service name"
          onChange={(v) => onUpdate({ ...service, name: v })}
        />
        <Field
          value={service.technology}
          placeholder="Technology used"
          onChange={(v) => onUpdate({ ...service, technology: v })}
        />
      </div>
      <Field
        value={service.responsibility}
        placeholder="What this service is responsible for"
        onChange={(v) => onUpdate({ ...service, responsibility: v })}
      />
      <Field
        value={service.communicatesWith}
        placeholder="Communicates with (other services, DBs)"
        onChange={(v) => onUpdate({ ...service, communicatesWith: v })}
      />
      <Field
        value={service.notes}
        placeholder="Notes, patterns, constraints (optional)"
        onChange={(v) => onUpdate({ ...service, notes: v })}
      />
    </div>
  )
}
