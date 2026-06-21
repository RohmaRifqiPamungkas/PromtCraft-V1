"use client"

import { useCallback } from "react"
import { DatabaseZap, Layers, Server, Settings2, Zap, Plus, ChevronRight, AlertCircle } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import type { ArchitectureData, ArchService, TechStack, ArchNFR } from "@/lib/architecture-compiler"
import { SectionHeader } from "../shared/SectionHeader"
import { Field, fieldClass } from "../shared/Field"
import { uid } from "../shared/uid"
import { ServiceCard } from "./ServiceCard"
import { ARCH_PATTERNS, STACK_FIELDS, ARCH_OUTPUT_GOALS } from "./archData"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function ArchBuilder({
  data, onChange,
}: {
  data: ArchitectureData
  onChange: (patch: Partial<ArchitectureData>) => void
}) {
  const updateService = useCallback((id: string, svc: ArchService) => {
    onChange({ services: data.services.map((x) => (x.id === id ? svc : x)) })
  }, [data.services, onChange])

  const removeService = useCallback((id: string) => {
    onChange({ services: data.services.filter((s) => s.id !== id) })
  }, [data.services, onChange])

  const addService = useCallback(() => {
    onChange({ services: [...data.services, { id: uid(), name: "", responsibility: "", technology: "", communicatesWith: "", notes: "" }] })
  }, [data.services, onChange])

  const updateStack = useCallback((key: keyof TechStack, value: string) => {
    onChange({ stack: { ...data.stack, [key]: value } })
  }, [data.stack, onChange])

  const updateNFR = useCallback((key: keyof ArchNFR, value: string) => {
    onChange({ nfr: { ...data.nfr, [key]: value } })
  }, [data.nfr, onChange])

  return (
    <div className="space-y-7">
      {/* System Overview */}
      <div className="space-y-4">
        <SectionHeader icon={DatabaseZap} title="System Overview" />
        <Field
          label="System Name"
          value={data.name}
          placeholder="e.g. OrderHub Platform, DataSync API"
          onChange={(v) => onChange({ name: v })}
        />
        <div className="space-y-1.5">
          <Label className="text-[11px] font-mono uppercase tracking-wider text-on-surface-variant/70">
            Architecture Pattern
          </Label>
          <Select value={data.pattern} onValueChange={(e) => onChange({ pattern: e })}>
            <SelectTrigger>
              <SelectValue placeholder="Select project type" />
            </SelectTrigger>
            <SelectContent>
              {ARCH_PATTERNS.map((p) => (
                <SelectItem key={p} value={p}>{p}</SelectItem>
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
            placeholder="Briefly describe the system's purpose and key design decisions…"
            rows={3}
            className="resize-none leading-relaxed"
          />
        </div>
      </div>

      {/* Tech Stack */}
      <div className="space-y-3">
        <SectionHeader icon={Layers} title="Tech Stack" hint="Fill only what applies" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {STACK_FIELDS.map(({ key, label, placeholder }) => (
            <Field
              key={key}
              label={label}
              value={data.stack[key]}
              placeholder={placeholder}
              onChange={(v) => updateStack(key, v)}
            />
          ))}
        </div>
      </div>

      {/* Services */}
      <div className="space-y-3">
        <SectionHeader icon={Server} title="Services / Components" />
        <div className="space-y-2">
          {data.services.map((svc, i) => (
            <ServiceCard
              key={svc.id}
              service={svc}
              index={i}
              onUpdate={(u) => updateService(svc.id, u)}
              onRemove={() => removeService(svc.id)}
              canRemove={data.services.length > 1}
            />
          ))}
        </div>
        <button
          onClick={addService}
          className="flex items-center gap-2 text-[11px] font-mono text-primary/70 hover:text-primary transition-colors"
        >
          <Plus className="w-3.5 h-3.5" /> Add service
        </button>
      </div>

      {/* NFR */}
      <div className="space-y-3">
        <SectionHeader icon={Settings2} title="Non-Functional Requirements" hint="Optional but improves output" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <Field label="Target Scale" value={data.nfr.targetScale} placeholder="e.g. 10,000 MAU, 100 RPS peak" onChange={(v) => updateNFR("targetScale", v)} />
          <Field label="Availability SLA" value={data.nfr.availability} placeholder="e.g. 99.9% uptime" onChange={(v) => updateNFR("availability", v)} />
          <Field label="Latency Target" value={data.nfr.latencyTarget} placeholder="e.g. p95 < 200ms" onChange={(v) => updateNFR("latencyTarget", v)} />
          <Field label="Data Retention" value={data.nfr.dataRetention} placeholder="e.g. 7 years for transactions" onChange={(v) => updateNFR("dataRetention", v)} />
          <div className="sm:col-span-2">
            <Field label="Compliance" value={data.nfr.compliance} placeholder="e.g. GDPR, PCI DSS, HIPAA, SOC 2" onChange={(v) => updateNFR("compliance", v)} />
          </div>
        </div>
      </div>

      {/* Output goal */}
      <div className="space-y-3">
        <SectionHeader icon={Zap} title="What do you need?" hint="What should the AI help you with?" />
        <div className="grid grid-cols-2 gap-2">
          {ARCH_OUTPUT_GOALS.map((g) => (
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
          placeholder="Or write a custom request… (leave empty for the default comprehensive review)"
          rows={3}
          className="resize-none leading-relaxed text-sm"
        />
      </div>

      <div className="flex gap-2.5 rounded-lg border border-outline-variant/50 bg-surface-container-low px-3.5 py-3">
        <AlertCircle className="w-3.5 h-3.5 text-primary/60 shrink-0 mt-0.5" />
        <p className="text-[11px] text-on-surface-variant/60 leading-relaxed">
          The prompt is generated live. Paste it into Claude, ChatGPT, or Gemini for a detailed architecture review or IaC code tailored to your system.
        </p>
      </div>
    </div>
  )
}
