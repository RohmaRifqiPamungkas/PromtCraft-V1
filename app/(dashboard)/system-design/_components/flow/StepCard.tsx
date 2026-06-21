import { Trash2 } from "lucide-react"
import { Field, fieldClass } from "../shared/Field"
import { cn } from "@/lib/utils"
import type { FlowActor, FlowStep } from "./flowData"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function StepCard({
  step, index, actors, onUpdate, onRemove, canRemove,
}: {
  step: FlowStep
  index: number
  actors: FlowActor[]
  onUpdate: (s: FlowStep) => void
  onRemove: () => void
  canRemove: boolean
}) {
  return (
    <div className="rounded-lg border border-outline-variant bg-surface-container-low p-3 space-y-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-secondary/10 border border-secondary/20 flex items-center justify-center shrink-0 text-[10px] font-bold text-secondary/70">
            {index + 1}
          </div>
          <span className="text-[11px] font-mono text-on-surface-variant/60">Step {index + 1}</span>
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
          value={step.name}
          placeholder="Step name"
          onChange={(v) => onUpdate({ ...step, name: v })}
        />
        <select
          value={step.actorId}
          onChange={(e) => onUpdate({ ...step, actorId: e.target.value })}
          className={cn(fieldClass, "cursor-pointer")}
        >
          <option value="">Actor</option>
          {actors.filter((a) => a.name).map((a) => (
            <option key={a.id} value={a.id}>{a.name}</option>
          ))}
        </select>
      </div>

      <Field
        value={step.action}
        placeholder="Action performed in this step"
        onChange={(v) => onUpdate({ ...step, action: v })}
      />

      <div className="grid grid-cols-2 gap-2">
        <Field
          value={step.inputData}
          placeholder="Input data / trigger"
          onChange={(v) => onUpdate({ ...step, inputData: v })}
        />
        <Field
          value={step.outputData}
          placeholder="Output / result"
          onChange={(v) => onUpdate({ ...step, outputData: v })}
        />
      </div>

      <Field
        value={step.notes}
        placeholder="Notes, edge cases, constraints (optional)"
        onChange={(v) => onUpdate({ ...step, notes: v })}
      />
    </div>
  )
}
