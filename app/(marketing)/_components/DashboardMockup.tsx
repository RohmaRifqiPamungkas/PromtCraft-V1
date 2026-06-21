"use client"

import { useState } from "react"
import {
  LayoutDashboard, Network, Layers, Wand2, FileText, History,
  Sparkles, ChevronDown, ArrowRight, Check, Clock,
  Database, GitBranch, Code2, Loader2, RotateCcw,
  ShoppingCart, Monitor, Bot, Smartphone, Server,
} from "lucide-react"

/* ─── Types ───────────────────────────────────────────────────────── */

type View = "dashboard" | "system-design" | "db-api" | "prompt-gen" | "templates" | "history"

const NAV: { id: View; icon: React.ElementType; label: string }[] = [
  { id: "dashboard",     icon: LayoutDashboard, label: "Dashboard" },
  { id: "system-design", icon: Network,         label: "System Design" },
  { id: "db-api",        icon: Layers,          label: "DB & API" },
  { id: "prompt-gen",    icon: Wand2,           label: "Prompt Gen" },
  { id: "templates",     icon: FileText,        label: "Templates" },
  { id: "history",       icon: History,         label: "History" },
]

/* ─── View: Dashboard ─────────────────────────────────────────────── */

function DashboardView() {
  return (
    <div className="space-y-3 animate-fade-in">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: "Total Prompts", value: "248", accent: true },
          { label: "AI Enhanced",  value: "183", accent: false },
          { label: "Today",        value: "12",  accent: false },
        ].map(({ label, value, accent }) => (
          <div
            key={label}
            className={`rounded-xl border p-2.5 flex flex-col gap-1 ${
              accent ? "border-primary/20 bg-primary/5" : "border-outline-variant bg-surface-container-high"
            }`}
          >
            <span className={`text-lg font-bold leading-none ${accent ? "text-primary" : "text-on-surface"}`}>
              {value}
            </span>
            <span className="text-[8px] font-mono uppercase tracking-wider text-on-surface-variant/50">
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-2">
        {[
          { icon: Network,  title: "System Design",  color: "text-secondary",         badge: "New" },
          { icon: Wand2,    title: "Prompt Builder", color: "text-primary",            badge: null },
          { icon: FileText, title: "Templates",      color: "text-tertiary",           badge: "48+" },
          { icon: History,  title: "History",        color: "text-on-surface-variant", badge: null },
        ].map(({ icon: Icon, title, color, badge }) => (
          <div
            key={title}
            className="flex items-center gap-2 p-2.5 rounded-xl border border-outline-variant bg-surface-container cursor-pointer hover:bg-surface-container-high transition-colors"
          >
            <div className="w-6 h-6 rounded-md bg-surface-container-high border border-outline-variant flex items-center justify-center shrink-0">
              <Icon className={`w-3 h-3 ${color}`} strokeWidth={1.75} />
            </div>
            <span className="text-[10px] font-medium text-on-surface truncate">{title}</span>
            {badge && (
              <span className="ml-auto text-[8px] font-mono bg-primary/10 text-primary border border-primary/20 px-1 py-0.5 rounded shrink-0">
                {badge}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Recent output */}
      <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-2.5 space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[8px] font-mono uppercase tracking-widest text-on-surface-variant/40">Recent Output</span>
          <span className="text-[8px] font-mono bg-primary/10 text-primary border border-primary/20 px-1.5 py-0.5 rounded">AI Enhanced</span>
        </div>
        <p className="text-[10px] font-mono text-on-surface-variant/70 leading-relaxed line-clamp-2">
          You are an expert backend architect. Design a scalable REST API for an e-commerce platform with PostgreSQL, Redis caching, and JWT auth…
        </p>
      </div>
    </div>
  )
}

/* ─── View: System Design ─────────────────────────────────────────── */

function SystemDesignView() {
  const [activeNode, setActiveNode] = useState<string | null>(null)

  const layers = [
    {
      label: "Client Layer",
      color: "border-secondary/30 bg-secondary/5 text-secondary",
      dot: "bg-secondary",
      nodes: ["Web App", "Mobile App"],
    },
    {
      label: "Gateway Layer",
      color: "border-primary/30 bg-primary/5 text-primary",
      dot: "bg-primary",
      nodes: ["API Gateway", "Auth Service"],
    },
    {
      label: "Service Layer",
      color: "border-outline-variant bg-surface-container-high text-on-surface-variant",
      dot: "bg-outline-variant",
      nodes: ["User Service", "Product API", "Order API"],
    },
    {
      label: "Data Layer",
      color: "border-[#f59e0b]/30 bg-[#f59e0b]/5 text-[#f59e0b]",
      dot: "bg-[#f59e0b]",
      nodes: ["PostgreSQL", "Redis Cache", "S3 Storage"],
    },
  ]

  return (
    <div className="space-y-2 animate-fade-in">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[8px] font-mono uppercase tracking-widest text-on-surface-variant/40">
          E-Commerce Architecture
        </span>
        <span className="text-[8px] font-mono text-primary/50 border border-primary/15 bg-primary/5 px-1.5 py-0.5 rounded">
          4 Layers
        </span>
      </div>

      {layers.map(({ label, color, dot, nodes }, layerIdx) => (
        <div key={label}>
          <div className="text-[8px] font-mono text-on-surface-variant/30 mb-1 ml-0.5">{label}</div>
          <div className="flex gap-1.5 flex-wrap">
            {nodes.map((node) => (
              <button
                key={node}
                onClick={() => setActiveNode(activeNode === node ? null : node)}
                className={`px-2 py-1 rounded-lg border text-[9px] font-medium transition-all duration-150 ${color} ${
                  activeNode === node ? "ring-1 ring-offset-1 ring-offset-background ring-current scale-105" : "hover:scale-105"
                }`}
              >
                {node}
              </button>
            ))}
          </div>
          {/* Connector arrow */}
          {layerIdx < layers.length - 1 && (
            <div className="flex items-center gap-1 ml-2 mt-1 mb-0.5">
              <div className={`w-1 h-1 rounded-full ${dot}`} />
              <div className="flex-1 h-px bg-outline-variant/40" />
              <div className="w-0 h-0 border-t-2 border-b-2 border-l-4 border-transparent border-l-outline-variant/40" />
            </div>
          )}
        </div>
      ))}

      {/* Node detail */}
      {activeNode && (
        <div className="mt-2 p-2 rounded-lg border border-primary/20 bg-primary/5 animate-fade-in">
          <div className="flex items-center gap-1.5">
            <Check className="w-3 h-3 text-primary shrink-0" />
            <span className="text-[9px] font-mono text-primary font-semibold">{activeNode}</span>
            <span className="ml-auto text-[8px] text-on-surface-variant/40">selected</span>
          </div>
          <p className="text-[8px] text-on-surface-variant/50 mt-1 ml-4.5">
            {activeNode === "API Gateway" && "Routes requests, rate limiting, SSL termination"}
            {activeNode === "PostgreSQL" && "Primary relational DB — users, products, orders"}
            {activeNode === "Redis Cache" && "Session store, query cache, pub/sub broker"}
            {activeNode === "Auth Service" && "JWT generation, refresh tokens, OAuth2 provider"}
            {activeNode === "Web App" && "Next.js SPA served via CDN edge network"}
            {activeNode === "Mobile App" && "React Native — iOS & Android unified codebase"}
            {activeNode === "User Service" && "CRUD profiles, roles, subscription tiers"}
            {activeNode === "Product API" && "Catalog, inventory, search, recommendations"}
            {activeNode === "Order API" && "Cart, checkout, payments, order lifecycle"}
            {activeNode === "S3 Storage" && "Asset uploads, backups, media processing"}
          </p>
        </div>
      )}
    </div>
  )
}

/* ─── View: DB & API ──────────────────────────────────────────────── */

function DbApiView() {
  const [selected, setSelected] = useState<string | null>(null)

  const tables = [
    {
      name: "users",
      color: "text-primary",
      borderColor: "border-primary/20",
      bgColor: "bg-primary/5",
      columns: [
        { name: "id",         type: "uuid",      pk: true  },
        { name: "email",      type: "text",      pk: false },
        { name: "full_name",  type: "text",      pk: false },
        { name: "created_at", type: "timestamp", pk: false },
      ],
    },
    {
      name: "products",
      color: "text-secondary",
      borderColor: "border-secondary/20",
      bgColor: "bg-secondary/5",
      columns: [
        { name: "id",       type: "uuid",    pk: true  },
        { name: "name",     type: "text",    pk: false },
        { name: "price",    type: "numeric", pk: false },
        { name: "user_id",  type: "fk→users", pk: false },
      ],
    },
  ]

  return (
    <div className="space-y-2.5 animate-fade-in">
      <div className="flex items-center justify-between">
        <span className="text-[8px] font-mono uppercase tracking-widest text-on-surface-variant/40">Schema Designer</span>
        <span className="text-[8px] font-mono text-on-surface-variant/30">2 tables · 1 relation</span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {tables.map(({ name, color, borderColor, bgColor, columns }) => (
          <div
            key={name}
            onClick={() => setSelected(selected === name ? null : name)}
            className={`rounded-xl border ${borderColor} ${bgColor} overflow-hidden cursor-pointer transition-all duration-150 ${
              selected === name ? "ring-1 ring-current" : "hover:opacity-90"
            } ${color}`}
          >
            {/* Table header */}
            <div className={`flex items-center gap-1.5 px-2.5 py-1.5 border-b ${borderColor}`}>
              <Database className="w-2.5 h-2.5 shrink-0" strokeWidth={2} />
              <span className="text-[9px] font-mono font-bold">{name}</span>
            </div>
            {/* Columns */}
            <div className="px-2 py-1.5 space-y-1">
              {columns.map(({ name: col, type, pk }) => (
                <div key={col} className="flex items-center gap-1.5">
                  {pk ? (
                    <span className="text-[7px] font-mono text-[#f59e0b] border border-[#f59e0b]/30 bg-[#f59e0b]/10 px-1 rounded leading-tight">PK</span>
                  ) : type.startsWith("fk") ? (
                    <span className="text-[7px] font-mono text-secondary border border-secondary/30 bg-secondary/10 px-1 rounded leading-tight">FK</span>
                  ) : (
                    <span className="w-4" />
                  )}
                  <span className="text-[8px] font-mono text-on-surface">{col}</span>
                  <span className={`ml-auto text-[7px] font-mono ${type.startsWith("fk") ? "text-secondary" : "text-on-surface-variant/40"}`}>{type}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Relation indicator */}
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-outline-variant bg-surface-container-lowest">
        <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
        <span className="text-[9px] font-mono text-on-surface-variant/60">users.id</span>
        <ArrowRight className="w-3 h-3 text-on-surface-variant/30 shrink-0" />
        <span className="text-[9px] font-mono text-on-surface-variant/60">products.user_id</span>
        <span className="ml-auto text-[8px] font-mono text-on-surface-variant/30">1:N</span>
      </div>

      {selected && (
        <div className="px-2.5 py-2 rounded-lg border border-outline-variant bg-surface-container-lowest animate-fade-in">
          <p className="text-[8px] font-mono text-on-surface-variant/50">
            <span className="text-primary font-semibold">{selected}</span> → click columns to set constraints
          </p>
        </div>
      )}
    </div>
  )
}

/* ─── View: Prompt Gen ────────────────────────────────────────────── */

const PROMPT_OUTPUT =
  "You are a senior backend engineer. Your task: design a production-ready REST API for a SaaS platform with multi-tenancy.\n\nContext:\n• Stack: Node.js, PostgreSQL, Redis\n• Auth: JWT + refresh tokens\n• Scale: 10k concurrent users\n\nDeliver: endpoint list, middleware chain, DB schema outline, error handling strategy."

function PromptGenView() {
  const [state, setState] = useState<"idle" | "loading" | "done">("idle")

  function handleGenerate() {
    setState("loading")
    setTimeout(() => setState("done"), 1400)
  }

  return (
    <div className="flex flex-col gap-2.5 animate-fade-in h-full">
      {/* Category selector */}
      <div className="flex items-center justify-between px-2.5 py-2 rounded-lg border border-outline-variant bg-surface-container-high cursor-pointer hover:bg-surface-container transition-colors">
        <div className="flex items-center gap-1.5">
          <Code2 className="w-3 h-3 text-primary" strokeWidth={1.75} />
          <span className="text-[10px] font-medium text-on-surface">Backend Development</span>
        </div>
        <ChevronDown className="w-3 h-3 text-on-surface-variant/40" />
      </div>

      {/* Problem textarea */}
      <div className="flex-1 p-2.5 rounded-lg border border-outline-variant bg-surface-container-lowest min-h-[56px]">
        <p className="text-[9px] font-mono text-on-surface-variant/50 leading-relaxed">
          Design a scalable REST API for a SaaS platform with multi-tenancy, JWT auth, and PostgreSQL as primary database…
        </p>
      </div>

      {/* Generate button */}
      <button
        onClick={handleGenerate}
        disabled={state === "loading" || state === "done"}
        className={`w-full flex items-center justify-center gap-1.5 py-2 rounded-lg text-[10px] font-semibold transition-all duration-200 ${
          state === "done"
            ? "bg-primary/10 text-primary border border-primary/20 cursor-default"
            : "bg-primary text-on-primary hover:bg-primary/90 active:scale-[0.98]"
        }`}
      >
        {state === "loading" ? (
          <>
            <Loader2 className="w-3 h-3 animate-spin" />
            Generating…
          </>
        ) : state === "done" ? (
          <>
            <Check className="w-3 h-3" />
            Prompt Ready
          </>
        ) : (
          <>
            <Sparkles className="w-3 h-3" />
            Generate Prompt
          </>
        )}
      </button>

      {/* Output */}
      {state === "done" && (
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-2.5 animate-fade-in">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[8px] font-mono uppercase tracking-widest text-primary/60">Output</span>
            <button
              onClick={() => setState("idle")}
              className="text-[8px] font-mono text-on-surface-variant/30 hover:text-on-surface-variant flex items-center gap-1"
            >
              <RotateCcw className="w-2.5 h-2.5" /> reset
            </button>
          </div>
          <p className="text-[8.5px] font-mono text-on-surface-variant/70 leading-relaxed whitespace-pre-line line-clamp-5">
            {PROMPT_OUTPUT}
          </p>
        </div>
      )}
    </div>
  )
}

/* ─── View: Templates ─────────────────────────────────────────────── */

const TEMPLATES = [
  { icon: Monitor,      label: "SaaS Platform",  tag: "Popular", color: "text-primary",   bg: "bg-primary/5  border-primary/20"   },
  { icon: ShoppingCart, label: "E-Commerce",      tag: "New",     color: "text-secondary", bg: "bg-secondary/5 border-secondary/20" },
  { icon: LayoutDashboard, label: "Dashboard",   tag: null,      color: "text-tertiary",  bg: "bg-surface-container-high border-outline-variant" },
  { icon: Bot,          label: "AI Agent",        tag: "Hot",     color: "text-primary",   bg: "bg-primary/5  border-primary/20"   },
  { icon: Smartphone,   label: "Mobile App",      tag: null,      color: "text-secondary", bg: "bg-secondary/5 border-secondary/20" },
  { icon: Server,       label: "API Service",     tag: null,      color: "text-tertiary",  bg: "bg-surface-container-high border-outline-variant" },
]

function TemplatesView() {
  const [picked, setPicked] = useState<string | null>(null)

  return (
    <div className="space-y-2 animate-fade-in">
      <div className="flex items-center justify-between">
        <span className="text-[8px] font-mono uppercase tracking-widest text-on-surface-variant/40">Template Library</span>
        <span className="text-[8px] font-mono text-on-surface-variant/30">48 templates</span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {TEMPLATES.map(({ icon: Icon, label, tag, color, bg }) => (
          <button
            key={label}
            onClick={() => setPicked(picked === label ? null : label)}
            className={`flex items-center gap-2 p-2.5 rounded-xl border text-left transition-all duration-150 hover:scale-[1.02] active:scale-100 ${bg} ${
              picked === label ? "ring-1 ring-current scale-[1.02]" : ""
            } ${color}`}
          >
            <Icon className="w-3.5 h-3.5 shrink-0" strokeWidth={1.75} />
            <span className="text-[9px] font-medium text-on-surface truncate">{label}</span>
            {tag && (
              <span className={`ml-auto text-[7px] font-mono px-1 py-0.5 rounded border shrink-0 ${bg}`}>
                {tag}
              </span>
            )}
            {picked === label && <Check className="w-3 h-3 ml-auto shrink-0" />}
          </button>
        ))}
      </div>

      {picked && (
        <button className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg bg-primary text-on-primary text-[9px] font-semibold hover:bg-primary/90 transition-colors animate-fade-in">
          <ArrowRight className="w-3 h-3" />
          Use &ldquo;{picked}&rdquo; Template
        </button>
      )}
    </div>
  )
}

/* ─── View: History ───────────────────────────────────────────────── */

const HISTORY_ITEMS = [
  {
    id: 1,
    category: "Backend Dev",
    enhanced: true,
    time: "2 min ago",
    preview: "Design a REST API for multi-tenant SaaS with JWT auth and PostgreSQL…",
    detail: "You are a senior backend engineer. Your task: design a production-ready REST API…",
  },
  {
    id: 2,
    category: "System Design",
    enhanced: false,
    time: "1 hr ago",
    preview: "Architecture for a real-time chat application with WebSocket support…",
    detail: "Design a scalable real-time messaging system using WebSockets, Redis pub/sub…",
  },
  {
    id: 3,
    category: "Debugging",
    enhanced: true,
    time: "3 hr ago",
    preview: "Fix race condition in async payment processing pipeline…",
    detail: "You are a debugging expert. Analyze this race condition in a Node.js payment flow…",
  },
  {
    id: 4,
    category: "Code Review",
    enhanced: false,
    time: "Yesterday",
    preview: "Review and refactor React component for performance optimization…",
    detail: "Review this React component for: unnecessary re-renders, missing memoization…",
  },
]

function HistoryView() {
  const [expanded, setExpanded] = useState<number | null>(null)

  return (
    <div className="space-y-2 animate-fade-in">
      <div className="flex items-center justify-between">
        <span className="text-[8px] font-mono uppercase tracking-widest text-on-surface-variant/40">Prompt History</span>
        <span className="text-[8px] font-mono text-primary/50 hover:text-primary cursor-pointer transition-colors">View all →</span>
      </div>

      <div className="space-y-1.5">
        {HISTORY_ITEMS.map(({ id, category, enhanced, time, preview, detail }) => (
          <button
            key={id}
            onClick={() => setExpanded(expanded === id ? null : id)}
            className="w-full text-left p-2.5 rounded-xl border border-outline-variant bg-surface-container hover:bg-surface-container-high transition-all duration-150 space-y-1.5 group"
          >
            <div className="flex items-center gap-1.5">
              {enhanced ? (
                <span className="text-[7px] font-mono font-bold uppercase tracking-wider text-primary bg-primary/10 border border-primary/20 px-1.5 py-0.5 rounded">
                  AI Enhanced
                </span>
              ) : (
                <span className="text-[7px] font-mono uppercase text-on-surface-variant/30 border border-outline-variant px-1.5 py-0.5 rounded">
                  {category}
                </span>
              )}
              <span className="ml-auto flex items-center gap-1 text-[8px] font-mono text-on-surface-variant/30">
                <Clock className="w-2.5 h-2.5" />
                {time}
              </span>
            </div>

            <p className="text-[9px] font-mono text-on-surface-variant/60 leading-relaxed line-clamp-1 group-hover:line-clamp-none transition-all">
              {expanded === id ? detail : preview}
            </p>

            {expanded === id && (
              <div className="flex gap-2 pt-0.5 animate-fade-in">
                <span className="text-[7px] font-mono text-primary/50 hover:text-primary transition-colors">Copy prompt</span>
                <span className="text-on-surface-variant/20">·</span>
                <span className="text-[7px] font-mono text-on-surface-variant/40 hover:text-on-surface-variant transition-colors">Re-use</span>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

/* ─── Main Component ──────────────────────────────────────────────── */

export function DashboardMockup() {
  const [active, setActive] = useState<View>("dashboard")

  const VIEW_MAP: Record<View, React.ReactNode> = {
    "dashboard":     <DashboardView />,
    "system-design": <SystemDesignView />,
    "db-api":        <DbApiView />,
    "prompt-gen":    <PromptGenView />,
    "templates":     <TemplatesView />,
    "history":       <HistoryView />,
  }

  return (
    <div
      className="relative w-full rounded-2xl overflow-hidden border border-outline-variant/60"
      style={{
        boxShadow: "0 32px 64px -16px rgba(0,0,0,0.55), 0 0 0 1px rgba(78,222,163,0.08)",
        background: "linear-gradient(180deg, #171f33 0%, #131b2e 100%)",
      }}
    >
      {/* Window chrome */}
      <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-outline-variant/40 bg-surface-container-lowest">
        <span className="w-2.5 h-2.5 rounded-full bg-error/60" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]/60" />
        <span className="w-2.5 h-2.5 rounded-full bg-primary/60" />
        <span className="ml-3 text-[10px] font-mono text-on-surface-variant/40">
          promptcraft.ai/{active === "dashboard" ? "dashboard" : active}
        </span>
        <div className="ml-auto flex items-center gap-1">
          <div className="w-12 h-1.5 rounded-full bg-surface-container-high" />
        </div>
      </div>

      <div className="flex" style={{ minHeight: 320 }}>
        {/* Sidebar */}
        <div className="hidden sm:flex flex-col w-36 bg-surface-container border-r border-outline-variant/40 py-3 px-2 gap-0.5 shrink-0">
          {NAV.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setActive(id)}
              className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-[10px] text-left transition-all duration-150 w-full ${
                active === id
                  ? "bg-primary/10 text-primary border border-primary/15"
                  : "text-on-surface-variant/50 hover:bg-surface-container-high hover:text-on-surface-variant"
              }`}
            >
              <Icon className="w-3 h-3 shrink-0" strokeWidth={active === id ? 2 : 1.75} />
              {label}
              {active === id && <span className="ml-auto w-1 h-1 rounded-full bg-primary shrink-0" />}
            </button>
          ))}
        </div>

        {/* Content area */}
        <div className="flex-1 p-4 overflow-hidden" key={active}>
          {VIEW_MAP[active]}
        </div>
      </div>

      {/* Bottom glow */}
      <div
        className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
        style={{ background: "linear-gradient(to top, #0b1326 0%, transparent 100%)" }}
      />
    </div>
  )
}
