import { User, Trash2 } from "lucide-react"
import { Field } from "../shared/Field"
import type { FlowActor } from "./flowData"

export function ActorCard({
  actor, index, onUpdate, onRemove, canRemove,
}: {
  actor: FlowActor
  index: number
  onUpdate: (a: FlowActor) => void
  onRemove: () => void
  canRemove: boolean
}) {
  return (
    <div className="rounded-lg border border-outline-variant bg-surface-container-low p-3 space-y-2">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
            <User className="w-3 h-3 text-primary" />
          </div>
          <span className="text-[11px] font-mono text-on-surface-variant/60">Actor {index + 1}</span>
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
          value={actor.name}
          placeholder="Actor name"
          onChange={(v) => onUpdate({ ...actor, name: v })}
        />
        <Field
          value={actor.role}
          placeholder="Role / responsibility"
          onChange={(v) => onUpdate({ ...actor, role: v })}
        />
      </div>
    </div>
  )
}
