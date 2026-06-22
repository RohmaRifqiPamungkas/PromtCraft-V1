"use client"

import { useState, useMemo, useCallback, type ElementType } from "react"
import {
  ArrowLeft, Search, Copy, Check, RotateCcw, Download, Sparkles,
  Code2, Bug, Paintbrush, Database, TestTube2,
  GitPullRequest, BookOpen, PenLine, Megaphone,
  X, ChevronRight, Zap,
} from "lucide-react"
import { Sidebar } from "@/components/layout/Sidebar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select"
import {
  TEMPLATES, CATEGORIES, compileTemplate,
  type PromptTemplate, type TemplateCategory,
} from "@/lib/templates"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/lib/i18n/context"

/* ── category → icon + style ─────────────────────────────────────── */

const CATEGORY_META: Record<
  string,
  { icon: ElementType; style: string; dot: string }
> = {
  "Code Generation": {
    icon: Code2,
    style: "text-primary      bg-primary/10      border-primary/20",
    dot: "bg-primary",
  },
  "Debugging": {
    icon: Bug,
    style: "text-error        bg-error/10        border-error/20",
    dot: "bg-error",
  },
  "UI/UX Design": {
    icon: Paintbrush,
    style: "text-secondary    bg-secondary/10    border-secondary/20",
    dot: "bg-secondary",
  },
  "Database Design": {
    icon: Database,
    style: "text-primary      bg-primary/8       border-primary/15",
    dot: "bg-primary",
  },
  "Testing": {
    icon: TestTube2,
    style: "text-tertiary     bg-tertiary/10     border-tertiary/20",
    dot: "bg-tertiary",
  },
  "Code Review": {
    icon: GitPullRequest,
    style: "text-secondary    bg-secondary/8     border-secondary/15",
    dot: "bg-secondary",
  },
  "Documentation": {
    icon: BookOpen,
    style: "text-tertiary     bg-tertiary/8      border-tertiary/15",
    dot: "bg-tertiary",
  },
  "Content Writing": {
    icon: PenLine,
    style: "text-primary      bg-primary/10      border-primary/20",
    dot: "bg-primary",
  },
  "Marketing": {
    icon: Megaphone,
    style: "text-error        bg-error/8         border-error/15",
    dot: "bg-error",
  },
}

const DIFFICULTY_STYLE: Record<string, string> = {
  Quick: "text-primary/70  bg-primary/8   border-primary/15",
  Standard: "text-secondary/70 bg-secondary/8 border-secondary/15",
  Detailed: "text-error/70   bg-error/8      border-error/15",
}

/* ── prompt preview with highlighted placeholders ────────────────── */

function PromptText({ text }: { text: string }) {
  const parts = text.split(/(\[[^\]]+\])/g)
  return (
    <>
      {parts.map((part, i) =>
        /^\[.+\]$/.test(part) ? (
          <mark
            key={i}
            className="not-italic bg-error/15 text-error/80 border border-error/25 rounded px-0.5 font-mono text-[10.5px]"
          >
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  )
}

/* ── variable form field ─────────────────────────────────────────── */

function VarField({
  v,
  value,
  onChange,
}: {
  v: PromptTemplate["variables"][number]
  value: string
  onChange: (val: string) => void
}) {
  const inputClass =
    "w-full rounded-lg border border-outline-variant bg-surface-container px-3 py-2 text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-colors"

  return (
    <div className="space-y-1.5">
      <Label className="flex items-center gap-1.5">
        {v.label}
        {v.required && (
          <span className="text-error/70 text-xs font-mono">*</span>
        )}
      </Label>

      {v.type === "textarea" ? (
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={v.placeholder}
          rows={4}
          className="leading-relaxed resize-none"
        />
      ) : v.type === "select" ? (
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger>
            <SelectValue placeholder={v.placeholder} />
          </SelectTrigger>
          <SelectContent>
            {v.options!.map((opt) => (
              <SelectItem key={opt} value={opt}>
                {opt}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={v.placeholder}
          className={inputClass}
        />
      )}

      {v.hint && (
        <p className="text-[11px] text-on-surface-variant/60 pl-0.5">{v.hint}</p>
      )}
    </div>
  )
}

/* ── browse view — search + filter + grid ────────────────────────── */

function BrowseView({
  templates,
  search,
  activeCategory,
  onSearch,
  onCategory,
  onSelect,
  tr,
}: {
  templates: PromptTemplate[]
  search: string
  activeCategory: TemplateCategory
  onSearch: (q: string) => void
  onCategory: (c: TemplateCategory) => void
  onSelect: (t: PromptTemplate) => void
  tr: ReturnType<typeof useLanguage>["t"]["templates"]
}) {
  const countSuffix = templates.length !== 1 ? tr.templateSuffixPlural : tr.templateSuffix
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-6 lg:p-8 max-w-6xl mx-auto space-y-5">

        {/* Page header */}
        <div>
          <h1 className="text-2xl font-bold text-on-surface tracking-tight">{tr.title}</h1>
          <p className="text-sm text-on-surface-variant mt-0.5">{tr.subtitle}</p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/50 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder={tr.searchPlaceholder}
            className="w-full rounded-lg border border-outline-variant bg-surface-container pl-9 pr-9 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-colors"
          />
          {search && (
            <button
              onClick={() => onSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50 hover:text-on-surface transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Category pills */}
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => onCategory(cat)}
              className={cn(
                "text-[11px] font-mono px-3 py-1.5 rounded-full border transition-all duration-150",
                activeCategory === cat
                  ? "bg-primary text-on-primary border-primary font-semibold"
                  : "bg-surface-container text-on-surface-variant border-outline-variant hover:bg-surface-container-high hover:text-on-surface",
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results count */}
        <p className="text-[11px] font-mono text-on-surface-variant/50">
          {templates.length} {countSuffix}
          {activeCategory !== "All" && ` ${tr.inCategory} ${activeCategory}`}
          {search && ` ${tr.matchingLabel} "${search}"`}
        </p>

        {/* Grid */}
        {templates.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {templates.map((t) => (
              <TemplateCard key={t.id} t={t} onSelect={onSelect} tr={tr} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-outline-variant bg-surface-container p-12 flex flex-col items-center gap-3 text-center">
            <div className="w-10 h-10 rounded-xl bg-surface-container-high border border-outline-variant flex items-center justify-center">
              <Search className="w-4 h-4 text-on-surface-variant/30" />
            </div>
            <p className="text-sm text-on-surface-variant/60">
              {tr.noResultsMsg}
              <br />
              <button
                onClick={() => { onSearch(""); onCategory("All") }}
                className="text-primary hover:underline mt-1 inline-block"
              >
                {tr.clearFilters}
              </button>
            </p>
          </div>
        )}

      </div>
    </div>
  )
}

/* ── template card ───────────────────────────────────────────────── */

function TemplateCard({
  t,
  onSelect,
  tr,
}: {
  t: PromptTemplate
  onSelect: (t: PromptTemplate) => void
  tr: ReturnType<typeof useLanguage>["t"]["templates"]
}) {
  const meta = CATEGORY_META[t.category]
  const Icon = meta?.icon ?? Code2
  const varCount = t.variables.filter((v) => v.required).length
  const reqLabel = varCount !== 1 ? tr.requiredFieldLabelPlural : tr.requiredFieldLabel

  return (
    <button
      onClick={() => onSelect(t)}
      className="group text-left rounded-xl border border-outline-variant bg-surface-container flex flex-col hover:bg-surface-container-high hover:border-outline transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-primary/40"
    >
      {/* Header */}
      <div className="p-4 pb-3 flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg bg-surface-container-high border border-outline-variant flex items-center justify-center shrink-0 mt-0.5">
          <Icon className="w-4 h-4 text-on-surface-variant" strokeWidth={1.75} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1.5">
            <span
              className={cn(
                "text-[9px] font-mono font-semibold uppercase tracking-widest px-1.5 py-0.5 rounded border",
                meta?.style,
              )}
            >
              {t.category}
            </span>
            <span
              className={cn(
                "text-[9px] font-mono uppercase tracking-widest px-1.5 py-0.5 rounded border ml-auto",
                DIFFICULTY_STYLE[t.difficulty],
              )}
            >
              {t.difficulty}
            </span>
          </div>
          <h3 className="text-[13.5px] font-semibold text-on-surface leading-snug group-hover:text-primary transition-colors">
            {t.title}
          </h3>
        </div>
      </div>

      {/* Description */}
      <p className="px-4 pb-3 text-[12.5px] text-on-surface-variant leading-relaxed flex-1">
        {t.description}
      </p>

      {/* Tags */}
      <div className="px-4 pb-3 flex flex-wrap gap-1.5">
        {t.tags.map((tag) => (
          <span
            key={tag}
            className="text-[10px] font-mono text-on-surface-variant/60 bg-surface-container-low border border-outline-variant/50 px-1.5 py-0.5 rounded"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Footer */}
      <div className="px-4 pb-4 pt-2.5 border-t border-outline-variant/50 flex items-center justify-between gap-3">
        <span className="text-[10px] font-mono text-on-surface-variant/40">
          {varCount} {reqLabel}
          {" · "}
          {t.estimatedLength} {tr.outputLabel}
        </span>
        <span className="flex items-center gap-1 text-[11px] font-medium text-primary/70 group-hover:text-primary transition-colors">
          {tr.useTemplate}
          <ChevronRight className="w-3 h-3" />
        </span>
      </div>
    </button>
  )
}

/* ── edit view — form + real-time preview ────────────────────────── */

function EditView({
  template,
  vars,
  compiled,
  filledRequired,
  totalRequired,
  copied,
  onBack,
  onVarChange,
  onCopy,
  onReset,
  onDownload,
  tr,
}: {
  template: PromptTemplate
  vars: Record<string, string>
  compiled: string
  filledRequired: number
  totalRequired: number
  copied: boolean
  onBack: () => void
  onVarChange: (key: string, val: string) => void
  onCopy: () => void
  onReset: () => void
  onDownload: () => void
  tr: ReturnType<typeof useLanguage>["t"]["templates"]
}) {
  const meta = CATEGORY_META[template.category]
  const Icon = meta?.icon ?? Code2
  const pct = totalRequired > 0 ? Math.round((filledRequired / totalRequired) * 100) : 100
  const isReady = filledRequired === totalRequired

  return (
    <div className="flex-1 flex flex-col xl:flex-row overflow-hidden">

      {/* ── Left: variable form ─────────────────────────────────── */}
      <section className="flex-1 xl:max-w-[520px] shrink-0 overflow-y-auto border-b xl:border-b-0 xl:border-r border-outline-variant bg-surface">
        <div className="p-6 lg:p-8 space-y-6 max-w-xl mx-auto">

          {/* Back */}
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-[12px] text-on-surface-variant hover:text-on-surface transition-colors group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            {tr.backToTemplates}
          </button>

          {/* Template header */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={cn(
                  "text-[9px] font-mono font-semibold uppercase tracking-widest px-1.5 py-0.5 rounded border",
                  meta?.style,
                )}
              >
                {template.category}
              </span>
              <span
                className={cn(
                  "text-[9px] font-mono uppercase tracking-widest px-1.5 py-0.5 rounded border",
                  DIFFICULTY_STYLE[template.difficulty],
                )}
              >
                {template.difficulty}
              </span>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-surface-container-high border border-outline-variant flex items-center justify-center shrink-0">
                <Icon className="w-4.5 h-4.5 text-on-surface-variant" strokeWidth={1.75} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-on-surface leading-tight">
                  {template.title}
                </h2>
                <p className="text-xs text-on-surface-variant mt-0.5 leading-relaxed">
                  {template.description}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {template.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] font-mono text-on-surface-variant/60 bg-surface-container border border-outline-variant/50 px-1.5 py-0.5 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Progress bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[10px] font-mono text-on-surface-variant/60">
              <span>
                {filledRequired} / {totalRequired} {tr.fieldsFilledOf}
              </span>
              <span className={cn(isReady ? "text-primary" : "text-on-surface-variant/50")}>
                {pct}%
              </span>
            </div>
            <div className="h-1 rounded-full bg-surface-container-high overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-300",
                  isReady ? "bg-primary" : "bg-primary/50",
                )}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>

          {/* Variable fields */}
          <div className="space-y-5">
            {template.variables.map((v) => (
              <VarField
                key={v.key}
                v={v}
                value={vars[v.key] ?? ""}
                onChange={(val) => onVarChange(v.key, val)}
              />
            ))}
          </div>

          {/* Helper note */}
          <p className="text-[11px] text-on-surface-variant/50 border border-outline-variant/50 bg-surface-container-low rounded-lg px-3 py-2.5 leading-relaxed">
            <Zap className="w-3 h-3 inline-block mr-1 text-primary/60" />
            Fields marked <span className="text-error/70 font-mono">*</span> {tr.requiredMarker}{" "}
            {tr.requiredNote}
          </p>

        </div>
      </section>

      {/* Divider */}
      <div className="hidden xl:block w-px bg-outline-variant" />

      {/* ── Right: live preview ─────────────────────────────────── */}
      <section className="flex-1 bg-surface-container-lowest flex flex-col overflow-hidden">

        {/* ── sticky toolbar (two rows) ───────────────────────────── */}
        <div className="shrink-0 bg-surface-container-lowest/95 backdrop-blur-sm border-b border-outline-variant px-5 pt-3 pb-2 flex flex-col gap-2">

          {/* Row 1: title */}
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-[15px] font-semibold text-on-surface leading-tight">
              {tr.promptPreview}
            </h3>
          </div>

          {/* Row 2: stats + action buttons */}
          <div className="flex items-center justify-between gap-3">

            {/* Stats */}
            <div className="flex items-center gap-1.5 min-w-0 overflow-hidden">
              {isReady ? (
                <>
                  <span className="text-[10px] font-mono text-on-surface-variant/50 shrink-0">
                    {compiled.split("\n").length} {tr.linesLabel}
                  </span>
                  <span className="text-[10px] font-mono text-outline-variant shrink-0">·</span>
                  <span className="text-[10px] font-mono text-on-surface-variant/50 shrink-0">
                    {compiled.replace(/\[[^\]]+\]/g, "").trim().length.toLocaleString()} {tr.charsLabel}
                  </span>
                  <span className="text-[10px] font-mono text-outline-variant shrink-0">·</span>
                  <span className="text-[10px] font-mono text-on-surface-variant/50 shrink-0">{tr.markdownLabel}</span>
                </>
              ) : (
                <span className="text-[10px] font-mono text-on-surface-variant/40 flex items-center gap-1 shrink-0">
                  {`${totalRequired - filledRequired} ${tr.fieldsRemaining} · `}
                  <mark className="not-italic bg-error/15 text-error/70 border border-error/25 rounded px-0.5">
                    [placeholder]
                  </mark>
                  {` ${tr.unfilledLabel}`}
                </span>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-1.5 shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={onReset}
                className="gap-1.5 text-xs h-7 px-2.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{tr.reset}</span>
              </Button>
              <Button
                variant={copied ? "surface" : "outline"}
                size="sm"
                onClick={onCopy}
                className={cn(
                  "gap-1.5 text-xs h-7 px-2.5 transition-all",
                  copied && "border-primary/40 text-primary",
                )}
              >
                {copied ? (
                  <><Check className="w-3.5 h-3.5" /><span className="hidden sm:inline">{tr.copied}</span></>
                ) : (
                  <><Copy className="w-3.5 h-3.5" /><span className="hidden sm:inline">{tr.copy}</span></>
                )}
              </Button>
              <div className="w-px h-4 bg-outline-variant mx-0.5" />
              <Button
                variant="outline"
                size="sm"
                onClick={onDownload}
                className="gap-1.5 text-xs h-7 px-2.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{tr.saveMd}</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 lg:p-7">
          <div
            className={cn(
              "rounded-xl border border-outline-variant bg-surface-container flex flex-col min-h-full shadow-lg shadow-black/20 transition-all duration-500",
              isReady && "border-primary/20 shadow-primary/5",
            )}
          >
            {/* Editor chrome */}
            <div className="shrink-0 bg-surface-container-high px-4 py-2.5 border-b border-outline-variant rounded-t-xl flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-error/30" />
                <div className="w-3 h-3 rounded-full bg-primary/20" />
                <div className="w-3 h-3 rounded-full bg-secondary/20" />
              </div>
              <div className="flex items-center gap-2 px-2.5 py-0.5 rounded-md bg-surface-container-highest border border-outline-variant/60">
                <span className="text-[10px] font-mono font-semibold tracking-[0.1em] text-on-surface-variant/70 uppercase">
                  {template.id}-prompt.md
                </span>
              </div>
              <div className="flex items-center gap-2">
                {isReady ? (
                  <span className="flex items-center gap-1.5 text-[10px] font-mono text-primary">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block" />
                    {tr.readyLabel}
                  </span>
                ) : (
                  <span className="text-[10px] font-mono text-on-surface-variant/40">
                    {tr.livePreview}
                  </span>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 p-5 overflow-auto">
              <p className="whitespace-pre-wrap font-mono text-[12px] leading-relaxed text-on-surface-variant">
                <PromptText text={compiled} />
              </p>
            </div>
          </div>
        </div>

      </section>
    </div>
  )
}

/* ── root client component ───────────────────────────────────────── */

export function TemplatesClient() {
  const { t } = useLanguage()
  const tr = t.templates

  const [selected, setSelected] = useState<PromptTemplate | null>(null)
  const [vars, setVars] = useState<Record<string, string>>({})
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState<TemplateCategory>("All")
  const [copied, setCopied] = useState(false)

  /* filter */
  const filtered = useMemo(() => {
    return TEMPLATES.filter((t) => {
      const matchCat = category === "All" || t.category === category
      if (!matchCat) return false
      const q = search.toLowerCase().trim()
      if (!q) return true
      return (
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.tags.some((tag) => tag.includes(q)) ||
        t.category.toLowerCase().includes(q)
      )
    })
  }, [search, category])

  /* compiled prompt */
  const compiled = useMemo(
    () => (selected ? compileTemplate(selected.template, vars) : ""),
    [selected, vars],
  )

  /* progress */
  const filledRequired = useMemo(
    () => (selected ? selected.variables.filter((v) => v.required && vars[v.key]?.trim()).length : 0),
    [selected, vars],
  )
  const totalRequired = selected?.variables.filter((v) => v.required).length ?? 0

  const handleSelect = useCallback((t: PromptTemplate) => {
    setSelected(t)
    setVars({})
  }, [])

  const handleBack = useCallback(() => {
    setSelected(null)
    setVars({})
  }, [])

  const handleVarChange = useCallback((key: string, val: string) => {
    setVars((prev) => ({ ...prev, [key]: val }))
  }, [])

  const handleCopy = useCallback(async () => {
    if (!compiled) return
    await navigator.clipboard.writeText(compiled)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [compiled])

  const handleReset = useCallback(() => setVars({}), [])

  const handleDownload = useCallback(() => {
    if (!compiled || !selected) return
    const blob = new Blob([compiled], { type: "text/markdown;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${selected.id}-prompt.md`
    a.click()
    URL.revokeObjectURL(url)
  }, [compiled, selected])

  return (
    <div className="bg-background text-on-surface h-screen flex overflow-hidden">
      <Sidebar />

      <main className="md:ml-[280px] flex-1 flex flex-col h-full overflow-hidden">

        {/* Mobile header */}
        <header className="flex md:hidden justify-between items-center px-6 h-16 bg-surface border-b border-outline-variant sticky top-0 z-10 shrink-0">
          <span className="text-xl font-bold text-primary tracking-tight">PromptCraft AI</span>
        </header>

        {selected ? (
          <EditView
            template={selected}
            vars={vars}
            compiled={compiled}
            filledRequired={filledRequired}
            totalRequired={totalRequired}
            copied={copied}
            onBack={handleBack}
            onVarChange={handleVarChange}
            onCopy={handleCopy}
            onReset={handleReset}
            onDownload={handleDownload}
            tr={tr}
          />
        ) : (
          <BrowseView
            templates={filtered}
            search={search}
            activeCategory={category}
            onSearch={setSearch}
            onCategory={setCategory}
            onSelect={handleSelect}
            tr={tr}
          />
        )}

      </main>
    </div>
  )
}
