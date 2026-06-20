"use client"

import { useState, useMemo, useCallback } from "react"
import {
  GitBranch, Plus, Trash2, Copy, Check, Download,
  ArrowDown, User, Zap, ChevronRight, RotateCcw,
  Layers, AlertCircle,
} from "lucide-react"
import { Sidebar } from "@/components/layout/Sidebar"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  compileBusinessFlow,
  type BusinessFlowData,
  type FlowActor,
  type FlowStep,
} from "@/lib/business-flow-compiler"
import { cn } from "@/lib/utils"

/* ── constants ──────────────────────────────────────────────────── */

const CATEGORIES = [
  "Authentication", "E-commerce", "Content Management",
  "SaaS / Subscription", "Payment Processing", "Notification",
  "Data Pipeline", "Reporting / Analytics", "Custom",
]

const OUTPUT_GOALS = [
  { label: "Full Backend Design", value: "Based on this flow, design the complete backend: database schema, API endpoints, business logic, error handling, and security." },
  { label: "Database Schema Only", value: "Based on this flow, design the optimal database schema with table structures, indexes, and relationships." },
  { label: "API Endpoints Only", value: "Based on this flow, define all REST API endpoints: method, path, request body, response shape, and auth requirements." },
  { label: "System Architecture", value: "Based on this flow, propose the system architecture including services, message queues, caching strategy, and deployment topology." },
]

type FlowTemplateStep = Omit<FlowStep, "id" | "actorId"> & { actorIndex: number }

interface FlowTemplate {
  id: string
  name: string
  category: string
  description: string
  actors: Omit<FlowActor, "id">[]
  steps: FlowTemplateStep[]
}

const TEMPLATES: FlowTemplate[] = [
  {
    id: "user-auth",
    name: "User Authentication",
    category: "Authentication",
    description: "Standard registration, email verification, and login flow with JWT session management.",
    actors: [
      { name: "User", role: "End user performing authentication" },
      { name: "Auth Service", role: "Validates credentials and issues tokens" },
      { name: "Database", role: "Stores user records, hashed passwords, sessions" },
    ],
    steps: [
      { actorIndex: 0, name: "Register", action: "Submit registration form", inputData: "email, password, display name", outputData: "Account created, verification email sent", notes: "Validate email uniqueness before inserting" },
      { actorIndex: 1, name: "Verify Email", action: "Send one-time verification token", inputData: "User email address", outputData: "Verification link via email", notes: "Token expires after 24 hours" },
      { actorIndex: 0, name: "Login", action: "Submit credentials", inputData: "email, password", outputData: "JWT access token + refresh token", notes: "Rate-limit to 5 attempts per minute" },
      { actorIndex: 1, name: "Refresh Token", action: "Exchange refresh token for new access token", inputData: "Refresh token", outputData: "New access token", notes: "Rotate refresh token on each use" },
    ],
  },
  {
    id: "ecommerce-order",
    name: "E-commerce Order",
    category: "E-commerce",
    description: "End-to-end online order flow from cart checkout through fulfillment and delivery.",
    actors: [
      { name: "Customer", role: "Shopper placing the order" },
      { name: "Order Service", role: "Orchestrates order lifecycle" },
      { name: "Payment Gateway", role: "Processes card / wallet payments" },
      { name: "Inventory Service", role: "Manages stock and reservations" },
      { name: "Fulfillment", role: "Picks, packs, and ships orders" },
    ],
    steps: [
      { actorIndex: 0, name: "Add to Cart", action: "Select product and quantity", inputData: "product_id, quantity", outputData: "Updated cart state", notes: "Check soft stock availability" },
      { actorIndex: 0, name: "Checkout", action: "Confirm address and payment method", inputData: "shipping address, payment details", outputData: "Order preview with total", notes: "" },
      { actorIndex: 2, name: "Charge Payment", action: "Authorize and capture payment", inputData: "Amount, card token", outputData: "Payment confirmation ID", notes: "Use idempotency key to prevent double-charge" },
      { actorIndex: 1, name: "Reserve Inventory", action: "Hard-reserve ordered items", inputData: "product_id, quantity", outputData: "Reservation ID", notes: "Roll back if payment fails" },
      { actorIndex: 4, name: "Fulfill Order", action: "Pick, pack, and dispatch", inputData: "Order details, shipping label", outputData: "Tracking number", notes: "" },
      { actorIndex: 0, name: "Delivery Confirmation", action: "Receive delivery notification", inputData: "Tracking event", outputData: "Order marked delivered", notes: "Trigger review request email" },
    ],
  },
  {
    id: "saas-onboarding",
    name: "SaaS Onboarding",
    category: "SaaS / Subscription",
    description: "New team onboarding: sign-up → workspace setup → invite team → billing plan selection.",
    actors: [
      { name: "Admin User", role: "Account owner who starts the trial" },
      { name: "Onboarding Service", role: "Guides setup steps" },
      { name: "Billing Service", role: "Manages plans and subscriptions" },
      { name: "Email Service", role: "Sends transactional emails" },
    ],
    steps: [
      { actorIndex: 0, name: "Sign Up", action: "Create account with email or OAuth", inputData: "email / OAuth token", outputData: "Account created, workspace slug chosen", notes: "" },
      { actorIndex: 1, name: "Setup Workspace", action: "Configure workspace name, logo, timezone", inputData: "Workspace preferences", outputData: "Workspace record saved", notes: "Defaults applied for skipped fields" },
      { actorIndex: 0, name: "Invite Team", action: "Send invites to teammates", inputData: "Email addresses, role assignments", outputData: "Invitation emails dispatched", notes: "Pending invites expire after 7 days" },
      { actorIndex: 2, name: "Select Plan", action: "Choose subscription tier", inputData: "Plan ID, billing cycle", outputData: "Trial or paid subscription activated", notes: "Default 14-day trial on any paid plan" },
    ],
  },
]

/* ── uid helper ─────────────────────────────────────────────────── */

let _uid = 0
function uid() { return `${Date.now()}-${++_uid}` }

/* ── blank state factory ─────────────────────────────────────────── */

function blankFlow(): BusinessFlowData {
  return {
    name: "",
    description: "",
    category: "",
    actors: [{ id: uid(), name: "", role: "" }],
    steps: [{ id: uid(), name: "", actorId: "", action: "", inputData: "", outputData: "", notes: "" }],
    outputGoal: "",
  }
}

function applyTemplate(t: FlowTemplate): BusinessFlowData {
  const actors: FlowActor[] = t.actors.map((a) => ({ id: uid(), name: a.name, role: a.role }))
  const steps: FlowStep[] = t.steps.map((s) => ({
    id: uid(),
    name: s.name,
    actorId: actors[s.actorIndex]?.id ?? "",
    action: s.action,
    inputData: s.inputData,
    outputData: s.outputData,
    notes: s.notes,
  }))
  return {
    name: t.name,
    description: t.description,
    category: t.category,
    actors,
    steps,
    outputGoal: "",
  }
}

/* ── input primitives ───────────────────────────────────────────── */

const fieldClass =
  "w-full rounded-lg border border-outline-variant bg-surface-container px-3 py-2 text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-colors"

function Field({
  label, value, placeholder, onChange, hint,
}: {
  label?: string; value: string; placeholder?: string
  onChange: (v: string) => void; hint?: string
}) {
  return (
    <div className="space-y-1.5">
      {label && <Label className="text-[11px] font-mono uppercase tracking-wider text-on-surface-variant/70">{label}</Label>}
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

/* ── template picker ────────────────────────────────────────────── */

function TemplatePicker({ onPick }: { onPick: (t: FlowTemplate) => void }) {
  return (
    <div className="space-y-2">
      <p className="text-[11px] font-mono uppercase tracking-wider text-on-surface-variant/60">
        Quick start — pick a template
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {TEMPLATES.map((t) => (
          <button
            key={t.id}
            onClick={() => onPick(t)}
            className="group text-left rounded-lg border border-outline-variant bg-surface-container px-3.5 py-3 hover:bg-surface-container-high hover:border-outline transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            <p className="text-[12px] font-semibold text-on-surface group-hover:text-primary transition-colors flex items-center gap-1.5">
              <GitBranch className="w-3 h-3 shrink-0" />
              {t.name}
            </p>
            <p className="text-[10px] font-mono text-on-surface-variant/50 mt-0.5 line-clamp-2">
              {t.description}
            </p>
          </button>
        ))}
      </div>
    </div>
  )
}

/* ── actor card ─────────────────────────────────────────────────── */

function ActorCard({
  actor, index, onUpdate, onRemove, canRemove,
}: {
  actor: FlowActor; index: number
  onUpdate: (a: FlowActor) => void; onRemove: () => void; canRemove: boolean
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

/* ── step card ──────────────────────────────────────────────────── */

function StepCard({
  step, index, actors, onUpdate, onRemove, canRemove,
}: {
  step: FlowStep; index: number; actors: FlowActor[]
  onUpdate: (s: FlowStep) => void; onRemove: () => void; canRemove: boolean
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
        {/* Actor selector */}
        <div>
          <select
            value={step.actorId}
            onChange={(e) => onUpdate({ ...step, actorId: e.target.value })}
            className={cn(fieldClass, "cursor-pointer")}
          >
            <option value="">— Actor —</option>
            {actors.filter((a) => a.name).map((a) => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>
        </div>
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

/* ── preview panel ──────────────────────────────────────────────── */

function FlowPreview({
  prompt, flowName, copied, onCopy, onDownload, onReset,
}: {
  prompt: string; flowName: string; copied: boolean
  onCopy: () => void; onDownload: () => void; onReset: () => void
}) {
  const isEmpty = !prompt.trim()

  return (
    <section className="flex-1 bg-surface-container-lowest flex flex-col overflow-hidden">
      {/* Toolbar */}
      <div className="shrink-0 bg-surface-container-lowest/95 backdrop-blur-sm border-b border-outline-variant px-5 py-3 flex justify-between items-center gap-4">
        <div>
          <h3 className="text-[15px] font-semibold text-on-surface leading-tight">Prompt Preview</h3>
          <p className="text-[10px] font-mono text-on-surface-variant/50 mt-0.5">
            {isEmpty ? "Fill the builder to generate a prompt" : "Live output — ready to copy or save"}
          </p>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <Button variant="outline" size="sm" onClick={onReset} className="gap-1.5 text-xs h-8 px-3">
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </Button>
          <Button
            variant={copied ? "surface" : "outline"}
            size="sm"
            onClick={onCopy}
            disabled={isEmpty}
            className={cn("gap-1.5 text-xs h-8 px-3 transition-all", copied && "border-primary/40 text-primary")}
          >
            {copied
              ? <><Check className="w-3.5 h-3.5" /><span className="hidden sm:inline">Copied!</span></>
              : <><Copy className="w-3.5 h-3.5" /><span className="hidden sm:inline">Copy</span></>
            }
          </Button>
          <div className="w-px h-5 bg-outline-variant mx-0.5" />
          <Button
            variant="outline"
            size="sm"
            onClick={onDownload}
            disabled={isEmpty}
            className="gap-1.5 text-xs h-8 px-3"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Save .md</span>
          </Button>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-5 lg:p-7">
        <div className={cn(
          "rounded-xl border border-outline-variant bg-surface-container flex flex-col min-h-full shadow-lg shadow-black/20 transition-all duration-500",
          !isEmpty && "border-primary/15 shadow-primary/5",
        )}>
          {/* Editor chrome bar */}
          <div className="shrink-0 bg-surface-container-high px-4 py-2.5 border-b border-outline-variant rounded-t-xl flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-error/30" />
              <div className="w-3 h-3 rounded-full bg-primary/20" />
              <div className="w-3 h-3 rounded-full bg-secondary/20" />
            </div>
            <div className="flex items-center gap-2 px-2.5 py-0.5 rounded-md bg-surface-container-highest border border-outline-variant/60">
              <GitBranch className="w-3 h-3 text-on-surface-variant/50" />
              <span className="text-[10px] font-mono font-semibold tracking-[0.1em] text-on-surface-variant/70 uppercase">
                {flowName ? `${flowName.toLowerCase().replace(/\s+/g, "-")}-flow.md` : "business-flow.md"}
              </span>
            </div>
            <span className={cn(
              "text-[10px] font-mono",
              isEmpty ? "text-on-surface-variant/40" : "text-primary",
            )}>
              {isEmpty ? "empty" : (
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block" />
                  ready
                </span>
              )}
            </span>
          </div>

          {/* Content */}
          <div className="flex-1 p-5 overflow-auto">
            {isEmpty ? (
              <div className="h-full flex flex-col items-center justify-center gap-4 py-16 text-center">
                <div className="w-12 h-12 rounded-xl bg-surface-container-high border border-outline-variant flex items-center justify-center">
                  <GitBranch className="w-5 h-5 text-on-surface-variant/30" />
                </div>
                <div>
                  <p className="text-sm font-medium text-on-surface-variant/60">No flow defined yet</p>
                  <p className="text-[11px] font-mono text-on-surface-variant/40 mt-1">
                    Start with a template or fill in the builder
                  </p>
                </div>
              </div>
            ) : (
              <pre className="whitespace-pre-wrap font-mono text-[12px] leading-relaxed text-on-surface-variant">
                {prompt}
              </pre>
            )}
          </div>

          {/* Footer */}
          {!isEmpty && (
            <div className="shrink-0 px-5 py-2.5 border-t border-outline-variant/40 flex items-center justify-end">
              <span className="text-[10px] font-mono text-on-surface-variant/40">
                {prompt.trim().length.toLocaleString()} chars · {prompt.split("\n").length} lines
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

/* ── builder panel ──────────────────────────────────────────────── */

function FlowBuilder({
  data,
  onChange,
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
    onChange({
      steps: [
        ...data.steps,
        { id: uid(), name: "", actorId: "", action: "", inputData: "", outputData: "", notes: "" },
      ],
    })
  }, [data.steps, onChange])

  return (
    <div className="space-y-7">
      {/* Flow metadata */}
      <div className="space-y-4">
        <SectionHeader icon={GitBranch} title="Flow Details" />
        <Field
          label="Flow Name"
          value={data.name}
          placeholder="e.g. User Authentication, Order Checkout"
          onChange={(v) => onChange({ name: v })}
        />
        <div className="space-y-1.5">
          <Label className="text-[11px] font-mono uppercase tracking-wider text-on-surface-variant/70">Category</Label>
          <select
            value={data.category}
            onChange={(e) => onChange({ category: e.target.value })}
            className={cn(fieldClass, "cursor-pointer")}
          >
            <option value="">— Select category —</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-[11px] font-mono uppercase tracking-wider text-on-surface-variant/70">Description</Label>
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
              onUpdate={(updated) => updateActor(a.id, updated)}
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
                onUpdate={(updated) => updateStep(s.id, updated)}
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
        <SectionHeader icon={Zap} title="What do you need?" hint="What should the AI help you build from this flow?" />
        <div className="grid grid-cols-2 gap-2">
          {OUTPUT_GOALS.map((g) => (
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
          placeholder="Or describe a custom goal… (leave empty for default full backend design request)"
          rows={3}
          className="resize-none leading-relaxed text-sm"
        />
      </div>

      {/* Tip */}
      <div className="flex gap-2.5 rounded-lg border border-outline-variant/50 bg-surface-container-low px-3.5 py-3">
        <AlertCircle className="w-3.5 h-3.5 text-primary/60 shrink-0 mt-0.5" />
        <p className="text-[11px] text-on-surface-variant/60 leading-relaxed">
          The prompt updates live as you type. Copy it to any AI assistant (Claude, ChatGPT, Gemini) and paste it to get architecture suggestions tailored to your flow.
        </p>
      </div>
    </div>
  )
}

/* ── section header ─────────────────────────────────────────────── */

function SectionHeader({
  icon: Icon, title, hint,
}: {
  icon: React.ElementType; title: string; hint?: string
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-md bg-surface-container-high border border-outline-variant flex items-center justify-center shrink-0">
          <Icon className="w-3.5 h-3.5 text-on-surface-variant" strokeWidth={1.75} />
        </div>
        <h2 className="text-sm font-semibold text-on-surface">{title}</h2>
      </div>
      {hint && <p className="text-[10px] font-mono text-on-surface-variant/50">{hint}</p>}
    </div>
  )
}

/* ── root client component ──────────────────────────────────────── */

export function BusinessFlowClient() {
  const [flow, setFlow]       = useState<BusinessFlowData>(blankFlow)
  const [copied, setCopied]   = useState(false)
  const [showTpl, setShowTpl] = useState(true)

  const prompt = useMemo(() => compileBusinessFlow(flow), [flow])

  const handleChange = useCallback((patch: Partial<BusinessFlowData>) => {
    setFlow((prev) => ({ ...prev, ...patch }))
  }, [])

  const handlePickTemplate = useCallback((t: FlowTemplate) => {
    setFlow(applyTemplate(t))
    setShowTpl(false)
  }, [])

  const handleReset = useCallback(() => {
    setFlow(blankFlow())
    setShowTpl(true)
    setCopied(false)
  }, [])

  const handleCopy = useCallback(async () => {
    if (!prompt) return
    await navigator.clipboard.writeText(prompt)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [prompt])

  const handleDownload = useCallback(() => {
    if (!prompt) return
    const slug = flow.name.toLowerCase().replace(/\s+/g, "-") || "business-flow"
    const blob = new Blob([prompt], { type: "text/markdown;charset=utf-8" })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement("a")
    a.href     = url
    a.download = `${slug}-prompt.md`
    a.click()
    URL.revokeObjectURL(url)
  }, [prompt, flow.name])

  return (
    <div className="bg-background text-on-surface h-screen flex overflow-hidden">
      <Sidebar />

      <main className="md:ml-[280px] flex-1 flex flex-col h-full overflow-hidden">

        {/* Mobile header */}
        <header className="flex md:hidden justify-between items-center px-6 h-16 bg-surface border-b border-outline-variant sticky top-0 z-10 shrink-0">
          <span className="text-xl font-bold text-primary tracking-tight">PromptCraft AI</span>
        </header>

        <div className="flex-1 flex flex-col xl:flex-row overflow-hidden">

          {/* ── Left: builder ─────────────────────────────────────── */}
          <section className="flex-1 xl:max-w-[560px] shrink-0 overflow-y-auto border-b xl:border-b-0 xl:border-r border-outline-variant bg-surface">
            <div className="p-6 lg:p-8 max-w-xl mx-auto space-y-6">

              {/* Page header */}
              <div>
                <h1 className="text-2xl font-bold text-on-surface tracking-tight">Business Flow</h1>
                <p className="text-sm text-on-surface-variant mt-0.5">
                  Map your process, then generate a structured AI prompt for backend design.
                </p>
              </div>

              {/* Template picker */}
              {showTpl ? (
                <div className="space-y-3">
                  <TemplatePicker onPick={handlePickTemplate} />
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-px bg-outline-variant/50" />
                    <span className="text-[10px] font-mono text-on-surface-variant/40 uppercase tracking-widest">or build from scratch</span>
                    <div className="flex-1 h-px bg-outline-variant/50" />
                  </div>
                  <button
                    onClick={() => setShowTpl(false)}
                    className="w-full flex items-center justify-center gap-2 rounded-lg border border-outline-variant bg-surface-container py-2.5 text-[12px] font-mono text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all duration-150"
                  >
                    <Plus className="w-3.5 h-3.5" /> Start empty
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setShowTpl(true)}
                    className="text-[11px] font-mono text-on-surface-variant/60 hover:text-primary transition-colors flex items-center gap-1"
                  >
                    <ChevronRight className="w-3 h-3 rotate-180" /> Templates
                  </button>
                </div>
              )}

              <FlowBuilder data={flow} onChange={handleChange} />
            </div>
          </section>

          <div className="hidden xl:block w-px bg-outline-variant" />

          {/* ── Right: preview ────────────────────────────────────── */}
          <FlowPreview
            prompt={prompt}
            flowName={flow.name}
            copied={copied}
            onCopy={handleCopy}
            onDownload={handleDownload}
            onReset={handleReset}
          />

        </div>
      </main>
    </div>
  )
}
