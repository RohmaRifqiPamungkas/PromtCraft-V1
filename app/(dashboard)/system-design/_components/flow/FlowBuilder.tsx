"use client"

import { useCallback } from "react"
import { GitBranch, User, Layers, Zap, Plus, ArrowDown, ChevronRight, AlertCircle } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import type { BusinessFlowData, FlowActor, FlowStep } from "@/lib/business-flow-compiler"
import { SectionHeader } from "../shared/SectionHeader"
import { Field, fieldClass } from "../shared/Field"
import { uid } from "../shared/uid"
import { ActorCard } from "./ActorCard"
import { StepCard } from "./StepCard"
import { FLOW_CATEGORIES, FLOW_OUTPUT_GOALS } from "./flowData"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function FlowBuilder({
  data, onChange,
}: {
  data: BusinessFlowData
  onChange: (patch: Partial<BusinessFlowData>) => void
}) {
  const updateActor = useCallback((id: string, a: FlowActor) => {
    onChange({ actors: data.actors.map((x) => (x.id === id ? a : x)) })
  }, [data.actors, onChange])

  const removeActor = useCallback((id: string) => {
    onChange({
      actors: data.actors.filter((a) => a.id !== id),
      steps: data.steps.map((s) => s.actorId === id ? { ...s, actorId: "" } : s),
    })
  }, [data.actors, data.steps, onChange])

  const addActor = useCallback(() => {
    onChange({ actors: [...data.actors, { id: uid(), name: "", role: "" }] })
  }, [data.actors, onChange])

  const updateStep = useCallback((id: string, s: FlowStep) => {
    onChange({ steps: data.steps.map((x) => (x.id === id ? s : x)) })
  }, [data.steps, onChange])

  const removeStep = useCallback((id: string) => {
    onChange({ steps: data.steps.filter((s) => s.id !== id) })
  }, [data.steps, onChange])

  const addStep = useCallback(() => {
    onChange({ steps: [...data.steps, { id: uid(), name: "", actorId: "", action: "", inputData: "", outputData: "", notes: "" }] })
  }, [data.steps, onChange])

  return (
    <div className="space-y-7">
      {/* Flow Details */}
      <div className="space-y-4">
        <SectionHeader icon={GitBranch} title="Flow Details" />
        <Field
          label="Flow Name"
          value={data.name}
          placeholder="e.g. User Authentication, Order Checkout"
          onChange={(v) => onChange({ name: v })}
        />
        <div className="space-y-1.5">
          <Label className="text-[11px] font-mono uppercase tracking-wider text-on-surface-variant/70">
            Category
          </Label>
          <Select value={data.category} onValueChange={(value) => onChange({ category: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select project type" />
            </SelectTrigger>
            <SelectContent>
              {FLOW_CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-[11px] font-mono uppercase tracking-wider text-on-surface-variant/70">
            Description
          </Label>
          <Textarea
            value={data.description}
            onChange={(e) => onChange({ description: e.target.value })}
            placeholder="Briefly describe what this business flow accomplishes…"
            rows={3}
            className="resize-none leading-relaxed"
          />
        </div>
      </div>

      {/* Actors */}
      <div className="space-y-3">
        <SectionHeader icon={User} title="Actors / Stakeholders" />
        <div className="space-y-2">
          {data.actors.map((a, i) => (
            <ActorCard
              key={a.id}
              actor={a}
              index={i}
              onUpdate={(u) => updateActor(a.id, u)}
              onRemove={() => removeActor(a.id)}
              canRemove={data.actors.length > 1}
            />
          ))}
        </div>
        <button
          onClick={addActor}
          className="flex items-center gap-2 text-[11px] font-mono text-primary/70 hover:text-primary transition-colors"
        >
          <Plus className="w-3.5 h-3.5" /> Add actor
        </button>
      </div>

      {/* Steps */}
      <div className="space-y-3">
        <SectionHeader icon={Layers} title="Flow Steps" />
        <div className="space-y-2">
          {data.steps.map((s, i) => (
            <div key={s.id}>
              <StepCard
                step={s}
                index={i}
                actors={data.actors}
                onUpdate={(u) => updateStep(s.id, u)}
                onRemove={() => removeStep(s.id)}
                canRemove={data.steps.length > 1}
              />
              {i < data.steps.length - 1 && (
                <div className="flex justify-center my-1.5">
                  <ArrowDown className="w-3.5 h-3.5 text-outline-variant" />
                </div>
              )}
            </div>
          ))}
        </div>
        <button
          onClick={addStep}
          className="flex items-center gap-2 text-[11px] font-mono text-primary/70 hover:text-primary transition-colors"
        >
          <Plus className="w-3.5 h-3.5" /> Add step
        </button>
      </div>

      {/* Output goal */}
      <div className="space-y-3">
        <SectionHeader icon={Zap} title="What do you need?" hint="What should the AI help you build?" />
        <div className="grid grid-cols-2 gap-2">
          {FLOW_OUTPUT_GOALS.map((g) => (
            <button
              key={g.label}
              onClick={() => onChange({ outputGoal: data.outputGoal === g.value ? "" : g.value })}
              className={cn(
                "text-left rounded-lg border px-3 py-2.5 transition-all duration-150 text-[11px] font-mono",
                data.outputGoal === g.value
                  ? "border-primary/40 bg-primary/8 text-primary"
                  : "border-outline-variant bg-surface-container text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface",
              )}
            >
              <ChevronRight className={cn("w-3 h-3 inline mr-1 transition-transform", data.outputGoal === g.value && "text-primary rotate-90")} />
              {g.label}
            </button>
          ))}
        </div>
        <Textarea
          value={data.outputGoal}
          onChange={(e) => onChange({ outputGoal: e.target.value })}
          placeholder="Or describe a custom goal…"
          rows={3}
          className="resize-none leading-relaxed text-sm"
        />
      </div>

      <div className="flex gap-2.5 rounded-lg border border-outline-variant/50 bg-surface-container-low px-3.5 py-3">
        <AlertCircle className="w-3.5 h-3.5 text-primary/60 shrink-0 mt-0.5" />
        <p className="text-[11px] text-on-surface-variant/60 leading-relaxed">
          The prompt updates live as you type. Copy it to Claude, ChatGPT, or Gemini to get backend design suggestions tailored to your flow.
        </p>
      </div>
    </div>
  )
}
