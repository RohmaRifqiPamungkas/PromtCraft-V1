import { RotateCcw, Copy, Check, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function PreviewPanel({
  prompt, fileName, icon: Icon, copied, onCopy, onDownload, onReset,
}: {
  prompt: string
  fileName: string
  icon: React.ElementType
  copied: boolean
  onCopy: () => void
  onDownload: () => void
  onReset: () => void
}) {
  const isEmpty = !prompt.trim()

  return (
    <section className="flex-1 bg-surface-container-lowest flex flex-col overflow-hidden">
      {/* Header bar */}
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

      {/* Content area */}
      <div className="flex-1 overflow-y-auto p-5 lg:p-7">
        <div className={cn(
          "rounded-xl border border-outline-variant bg-surface-container flex flex-col min-h-full shadow-lg shadow-black/20 transition-all duration-500",
          !isEmpty && "border-primary/15 shadow-primary/5",
        )}>
          {/* Fake window chrome */}
          <div className="shrink-0 bg-surface-container-high px-4 py-2.5 border-b border-outline-variant rounded-t-xl flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-error/30" />
              <div className="w-3 h-3 rounded-full bg-primary/20" />
              <div className="w-3 h-3 rounded-full bg-secondary/20" />
            </div>
            <div className="flex items-center gap-2 px-2.5 py-0.5 rounded-md bg-surface-container-highest border border-outline-variant/60">
              <Icon className="w-3 h-3 text-on-surface-variant/50" />
              <span className="text-[10px] font-mono font-semibold tracking-[0.1em] text-on-surface-variant/70 uppercase">
                {fileName}
              </span>
            </div>
            <span className={cn("text-[10px] font-mono", isEmpty ? "text-on-surface-variant/40" : "text-primary")}>
              {isEmpty ? "empty" : (
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block" />
                  ready
                </span>
              )}
            </span>
          </div>

          {/* Prompt body */}
          <div className="flex-1 p-5 overflow-auto">
            {isEmpty ? (
              <div className="h-full flex flex-col items-center justify-center gap-4 py-16 text-center">
                <div className="w-12 h-12 rounded-xl bg-surface-container-high border border-outline-variant flex items-center justify-center">
                  <Icon className="w-5 h-5 text-on-surface-variant/30" />
                </div>
                <div>
                  <p className="text-sm font-medium text-on-surface-variant/60">No content defined yet</p>
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

          {/* Footer stats */}
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
