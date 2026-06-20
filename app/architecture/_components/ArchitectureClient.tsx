"use client"

import { useState, useMemo, useCallback } from "react"
import {
  DatabaseZap, Plus, Trash2, Copy, Check, Download,
  Server, Layers, Settings2, Zap, ChevronRight,
  RotateCcw, AlertCircle, Box,
} from "lucide-react"
import { Sidebar } from "@/components/layout/Sidebar"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  compileArchitecture,
  type ArchitectureData,
  type ArchService,
  type TechStack,
  type ArchNFR,
} from "@/lib/architecture-compiler"
import { cn } from "@/lib/utils"

/* ── constants ──────────────────────────────────────────────────── */

const PATTERNS = [
  "Monolith",
  "Microservices",
  "Serverless / FaaS",
  "Event-Driven",
  "Layered (N-Tier)",
  "Hexagonal / Clean Architecture",
  "CQRS + Event Sourcing",
  "BFF (Backend for Frontend)",
]

const STACK_FIELDS: { key: keyof TechStack; label: string; placeholder: string }[] = [
  { key: "frontend",   label: "Frontend",         placeholder: "e.g. Next.js, React, Vue" },
  { key: "backend",    label: "Backend",           placeholder: "e.g. NestJS, FastAPI, Go Fiber" },
  { key: "primaryDb",  label: "Primary Database",  placeholder: "e.g. PostgreSQL, MongoDB, DynamoDB" },
  { key: "cache",      label: "Cache",             placeholder: "e.g. Redis, Memcached" },
  { key: "queue",      label: "Message Queue",     placeholder: "e.g. RabbitMQ, Kafka, SQS" },
  { key: "auth",       label: "Authentication",    placeholder: "e.g. Supabase Auth, Auth0, Keycloak" },
  { key: "storage",    label: "File Storage",      placeholder: "e.g. S3, GCS, Supabase Storage" },
  { key: "deployment", label: "Deployment",        placeholder: "e.g. Docker + K8s, Vercel, AWS ECS" },
  { key: "monitoring", label: "Monitoring",        placeholder: "e.g. Grafana + Prometheus, Datadog" },
]

const OUTPUT_GOALS = [
  {
    label: "Full Architecture Review",
    value: "Review this architecture for bottlenecks, SPOFs, scalability, and security gaps. Suggest improvements with justification.",
  },
  {
    label: "IaC Skeleton",
    value: "Generate an Infrastructure as Code skeleton (Docker Compose or Kubernetes manifests) that wires up all the services and dependencies defined above.",
  },
  {
    label: "Service Contracts",
    value: "Define the API contracts, event schemas, and data formats between all services. Include request/response shapes and event payload structures.",
  },
  {
    label: "Observability Plan",
    value: "Design a complete observability strategy: what to log, what metrics to collect, distributed tracing setup, and alerting thresholds for this system.",
  },
]

interface ArchTemplate {
  id: string
  name: string
  description: string
  pattern: string
  stack: TechStack
  services: Omit<ArchService, "id">[]
  nfr: ArchNFR
}

const TEMPLATES: ArchTemplate[] = [
  {
    id: "saas-webapp",
    name: "SaaS Web App",
    description: "Full-stack SaaS platform with server-side rendering, REST API, relational database, and background job processing.",
    pattern: "Monolith",
    stack: {
      frontend:   "Next.js (App Router)",
      backend:    "NestJS (Node.js)",
      primaryDb:  "PostgreSQL",
      cache:      "Redis",
      queue:      "BullMQ (via Redis)",
      auth:       "Supabase Auth / JWT",
      storage:    "Supabase Storage / S3",
      deployment: "Docker + Railway / Render",
      monitoring: "Grafana + Loki",
    },
    services: [
      { name: "Web App", responsibility: "SSR frontend and BFF layer for client pages", technology: "Next.js", communicatesWith: "API Server", notes: "Uses server components for data fetching" },
      { name: "API Server", responsibility: "Core business logic, REST endpoints, auth validation", technology: "NestJS", communicatesWith: "PostgreSQL, Redis, Queue Worker", notes: "Guards for role-based access" },
      { name: "Queue Worker", responsibility: "Process background jobs: emails, webhooks, report generation", technology: "BullMQ", communicatesWith: "Redis, External Email API", notes: "Retry with exponential backoff" },
    ],
    nfr: {
      targetScale:   "Up to 10,000 MAU, ~50 RPS peak",
      availability:  "99.9% uptime SLA",
      latencyTarget: "p95 < 200ms for API",
      dataRetention: "User data retained indefinitely; logs 30 days",
      compliance:    "GDPR — user data deletion on request",
    },
  },
  {
    id: "microservices",
    name: "Microservices Platform",
    description: "Distributed microservices system with an API gateway, async event bus, and independent service deployments.",
    pattern: "Microservices",
    stack: {
      frontend:   "React (Vite)",
      backend:    "Go + Node.js (per service)",
      primaryDb:  "PostgreSQL (per service)",
      cache:      "Redis",
      queue:      "Apache Kafka",
      auth:       "Keycloak (OIDC)",
      storage:    "AWS S3",
      deployment: "Kubernetes (Helm charts)",
      monitoring: "Prometheus + Grafana + Jaeger",
    },
    services: [
      { name: "API Gateway", responsibility: "Rate limiting, auth validation, request routing to services", technology: "Kong / NGINX", communicatesWith: "All internal services", notes: "JWT verification, circuit breaker" },
      { name: "User Service", responsibility: "User profiles, preferences, account management", technology: "Go", communicatesWith: "PostgreSQL, Kafka", notes: "Publishes user.created / user.updated events" },
      { name: "Order Service", responsibility: "Order lifecycle: create, update, cancel", technology: "Node.js + NestJS", communicatesWith: "PostgreSQL, Kafka, Inventory Service", notes: "Saga pattern for distributed transactions" },
      { name: "Inventory Service", responsibility: "Product stock tracking, reservations", technology: "Go", communicatesWith: "PostgreSQL, Kafka", notes: "Optimistic locking on stock updates" },
      { name: "Notification Service", responsibility: "Email, push, and in-app notifications", technology: "Node.js", communicatesWith: "Kafka, Email/Push providers", notes: "Consumes domain events, idempotent delivery" },
    ],
    nfr: {
      targetScale:   "500,000 MAU, 2,000 RPS peak",
      availability:  "99.95% per service",
      latencyTarget: "p99 < 500ms end-to-end",
      dataRetention: "Transactional data 7 years; events 90 days",
      compliance:    "PCI DSS for payment data; SOC 2 Type II",
    },
  },
  {
    id: "serverless-api",
    name: "Serverless API",
    description: "Event-driven serverless backend on AWS: Lambda functions, DynamoDB, and API Gateway with pay-per-use scaling.",
    pattern: "Serverless / FaaS",
    stack: {
      frontend:   "React (hosted on CloudFront + S3)",
      backend:    "AWS Lambda (Node.js / Python)",
      primaryDb:  "DynamoDB",
      cache:      "DynamoDB DAX / ElastiCache",
      queue:      "AWS SQS + SNS",
      auth:       "AWS Cognito",
      storage:    "AWS S3",
      deployment: "AWS CDK / Serverless Framework",
      monitoring: "AWS CloudWatch + X-Ray",
    },
    services: [
      { name: "REST Handler Lambdas", responsibility: "Handle HTTP requests via API Gateway triggers", technology: "Node.js Lambda", communicatesWith: "DynamoDB, SQS", notes: "Provisioned concurrency for hot paths" },
      { name: "Event Processor", responsibility: "Process async jobs from SQS queues", technology: "Python Lambda", communicatesWith: "DynamoDB, S3, SNS", notes: "DLQ for failed messages" },
      { name: "Auth Authorizer", responsibility: "Custom Lambda authorizer for JWT validation", technology: "Node.js Lambda", communicatesWith: "Cognito", notes: "Cache auth result for 5 min" },
    ],
    nfr: {
      targetScale:   "Variable — auto-scales to millions of invocations",
      availability:  "Managed by AWS (99.99%)",
      latencyTarget: "Cold start < 1s; warm p95 < 100ms",
      dataRetention: "DynamoDB TTL for session data; S3 lifecycle policies",
      compliance:    "SOC 2 — all data in single AWS region",
    },
  },
]

/* ── uid ────────────────────────────────────────────────────────── */

let _uid = 0
function uid() { return `${Date.now()}-${++_uid}` }

/* ── blank / apply template ─────────────────────────────────────── */

const BLANK_STACK: TechStack = {
  frontend: "", backend: "", primaryDb: "", cache: "",
  queue: "", auth: "", storage: "", deployment: "", monitoring: "",
}

const BLANK_NFR: ArchNFR = {
  targetScale: "", availability: "", latencyTarget: "",
  dataRetention: "", compliance: "",
}

function blankArch(): ArchitectureData {
  return {
    name: "", description: "", pattern: "",
    stack: { ...BLANK_STACK },
    services: [{ id: uid(), name: "", responsibility: "", technology: "", communicatesWith: "", notes: "" }],
    nfr: { ...BLANK_NFR },
    outputGoal: "",
  }
}

function applyTemplate(t: ArchTemplate): ArchitectureData {
  return {
    name: t.name,
    description: t.description,
    pattern: t.pattern,
    stack: { ...t.stack },
    services: t.services.map((svc) => ({ id: uid(), ...svc })),
    nfr: { ...t.nfr },
    outputGoal: "",
  }
}

/* ── primitives ─────────────────────────────────────────────────── */

const fieldClass =
  "w-full rounded-lg border border-outline-variant bg-surface-container px-3 py-2 text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-colors"

function Field({
  label, value, placeholder, onChange,
}: {
  label?: string; value: string; placeholder?: string
  onChange: (v: string) => void
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
    </div>
  )
}

/* ── section header ─────────────────────────────────────────────── */

function SectionHeader({ icon: Icon, title, hint }: {
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

/* ── template picker ────────────────────────────────────────────── */

function TemplatePicker({ onPick }: { onPick: (t: ArchTemplate) => void }) {
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
              <DatabaseZap className="w-3 h-3 shrink-0" />
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

/* ── service card ───────────────────────────────────────────────── */

function ServiceCard({
  service, index, onUpdate, onRemove, canRemove,
}: {
  service: ArchService; index: number
  onUpdate: (s: ArchService) => void; onRemove: () => void; canRemove: boolean
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

/* ── preview panel ──────────────────────────────────────────────── */

function ArchPreview({
  prompt, systemName, copied, onCopy, onDownload, onReset,
}: {
  prompt: string; systemName: string; copied: boolean
  onCopy: () => void; onDownload: () => void; onReset: () => void
}) {
  const isEmpty = !prompt.trim()

  return (
    <section className="flex-1 bg-surface-container-lowest flex flex-col overflow-hidden">
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

      <div className="flex-1 overflow-y-auto p-5 lg:p-7">
        <div className={cn(
          "rounded-xl border border-outline-variant bg-surface-container flex flex-col min-h-full shadow-lg shadow-black/20 transition-all duration-500",
          !isEmpty && "border-primary/15 shadow-primary/5",
        )}>
          {/* Editor chrome */}
          <div className="shrink-0 bg-surface-container-high px-4 py-2.5 border-b border-outline-variant rounded-t-xl flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-error/30" />
              <div className="w-3 h-3 rounded-full bg-primary/20" />
              <div className="w-3 h-3 rounded-full bg-secondary/20" />
            </div>
            <div className="flex items-center gap-2 px-2.5 py-0.5 rounded-md bg-surface-container-highest border border-outline-variant/60">
              <DatabaseZap className="w-3 h-3 text-on-surface-variant/50" />
              <span className="text-[10px] font-mono font-semibold tracking-[0.1em] text-on-surface-variant/70 uppercase">
                {systemName
                  ? `${systemName.toLowerCase().replace(/\s+/g, "-")}-arch.md`
                  : "architecture.md"}
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

          <div className="flex-1 p-5 overflow-auto">
            {isEmpty ? (
              <div className="h-full flex flex-col items-center justify-center gap-4 py-16 text-center">
                <div className="w-12 h-12 rounded-xl bg-surface-container-high border border-outline-variant flex items-center justify-center">
                  <DatabaseZap className="w-5 h-5 text-on-surface-variant/30" />
                </div>
                <div>
                  <p className="text-sm font-medium text-on-surface-variant/60">No architecture defined yet</p>
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

function ArchBuilder({
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
    onChange({
      services: [
        ...data.services,
        { id: uid(), name: "", responsibility: "", technology: "", communicatesWith: "", notes: "" },
      ],
    })
  }, [data.services, onChange])

  const updateStack = useCallback((key: keyof TechStack, value: string) => {
    onChange({ stack: { ...data.stack, [key]: value } })
  }, [data.stack, onChange])

  const updateNFR = useCallback((key: keyof ArchNFR, value: string) => {
    onChange({ nfr: { ...data.nfr, [key]: value } })
  }, [data.nfr, onChange])

  return (
    <div className="space-y-7">

      {/* System overview */}
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
          <select
            value={data.pattern}
            onChange={(e) => onChange({ pattern: e.target.value })}
            className={cn(fieldClass, "cursor-pointer")}
          >
            <option value="">— Select pattern —</option>
            {PATTERNS.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
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

      {/* Tech stack */}
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
              onUpdate={(updated) => updateService(svc.id, updated)}
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

      {/* NFRs */}
      <div className="space-y-3">
        <SectionHeader icon={Settings2} title="Non-Functional Requirements" hint="Optional but improves output" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <Field
            label="Target Scale"
            value={data.nfr.targetScale}
            placeholder="e.g. 10,000 MAU, 100 RPS peak"
            onChange={(v) => updateNFR("targetScale", v)}
          />
          <Field
            label="Availability SLA"
            value={data.nfr.availability}
            placeholder="e.g. 99.9% uptime"
            onChange={(v) => updateNFR("availability", v)}
          />
          <Field
            label="Latency Target"
            value={data.nfr.latencyTarget}
            placeholder="e.g. p95 < 200ms"
            onChange={(v) => updateNFR("latencyTarget", v)}
          />
          <Field
            label="Data Retention"
            value={data.nfr.dataRetention}
            placeholder="e.g. 7 years for transactions"
            onChange={(v) => updateNFR("dataRetention", v)}
          />
          <div className="sm:col-span-2">
            <Field
              label="Compliance"
              value={data.nfr.compliance}
              placeholder="e.g. GDPR, PCI DSS, HIPAA, SOC 2"
              onChange={(v) => updateNFR("compliance", v)}
            />
          </div>
        </div>
      </div>

      {/* Output goal */}
      <div className="space-y-3">
        <SectionHeader icon={Zap} title="What do you need?" hint="What should the AI help you with?" />
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
          placeholder="Or write a custom request… (leave empty for the default comprehensive review)"
          rows={3}
          className="resize-none leading-relaxed text-sm"
        />
      </div>

      {/* Tip */}
      <div className="flex gap-2.5 rounded-lg border border-outline-variant/50 bg-surface-container-low px-3.5 py-3">
        <AlertCircle className="w-3.5 h-3.5 text-primary/60 shrink-0 mt-0.5" />
        <p className="text-[11px] text-on-surface-variant/60 leading-relaxed">
          The prompt is generated live. Paste it into Claude, ChatGPT, or Gemini to get a detailed architecture review or IaC code tailored to your system.
        </p>
      </div>
    </div>
  )
}

/* ── root client component ──────────────────────────────────────── */

export function ArchitectureClient() {
  const [arch, setArch]       = useState<ArchitectureData>(blankArch)
  const [copied, setCopied]   = useState(false)
  const [showTpl, setShowTpl] = useState(true)

  const prompt = useMemo(() => compileArchitecture(arch), [arch])

  const handleChange = useCallback((patch: Partial<ArchitectureData>) => {
    setArch((prev) => ({ ...prev, ...patch }))
  }, [])

  const handlePickTemplate = useCallback((t: ArchTemplate) => {
    setArch(applyTemplate(t))
    setShowTpl(false)
  }, [])

  const handleReset = useCallback(() => {
    setArch(blankArch())
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
    const slug = arch.name.toLowerCase().replace(/\s+/g, "-") || "architecture"
    const blob = new Blob([prompt], { type: "text/markdown;charset=utf-8" })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement("a")
    a.href     = url
    a.download = `${slug}-arch-prompt.md`
    a.click()
    URL.revokeObjectURL(url)
  }, [prompt, arch.name])

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
                <h1 className="text-2xl font-bold text-on-surface tracking-tight">Architecture</h1>
                <p className="text-sm text-on-surface-variant mt-0.5">
                  Define your system stack and services, then generate a structured AI prompt for architecture review or IaC generation.
                </p>
              </div>

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
                <button
                  onClick={() => setShowTpl(true)}
                  className="text-[11px] font-mono text-on-surface-variant/60 hover:text-primary transition-colors flex items-center gap-1"
                >
                  <ChevronRight className="w-3 h-3 rotate-180" /> Templates
                </button>
              )}

              <ArchBuilder data={arch} onChange={handleChange} />
            </div>
          </section>

          <div className="hidden xl:block w-px bg-outline-variant" />

          {/* ── Right: preview ────────────────────────────────────── */}
          <ArchPreview
            prompt={prompt}
            systemName={arch.name}
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
