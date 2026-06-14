import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import type { WizardStep } from "@/types/prompt"

const STEPS = [
  { n: 1 as WizardStep, label: "Core Entities" },
  { n: 2 as WizardStep, label: "Tech Prefs"    },
  { n: 3 as WizardStep, label: "Constraints"   },
]

/* Connector line between two circles */
function Connector({ active }: { active: boolean }) {
  return (
    /* pt-3 aligns the line with the center of the h-6 (24px) circles */
    <div className="flex-1 pt-3 min-w-[2rem]">
      <div
        className={cn(
          "h-[1.5px] w-full rounded-full transition-colors duration-500",
          active ? "bg-primary/50" : "bg-outline-variant"
        )}
      />
    </div>
  )
}

export function ProgressStepper({ currentStep }: { currentStep: WizardStep }) {
  return (
    <div className="flex items-start gap-0 w-full max-w-xs mx-auto">
      {STEPS.map((step, idx) => {
        const done    = step.n < currentStep
        const active  = step.n === currentStep

        return (
          <div key={step.n} className="flex items-start gap-0">
            {/* Circle + label */}
            <div className="flex flex-col items-center gap-1.5 shrink-0">
              <div
                className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-mono font-semibold transition-all duration-300",
                  done
                    ? "bg-primary text-on-primary"
                    : active
                    ? "bg-primary-container text-on-primary-container ring-4 ring-primary/10"
                    : "bg-surface-container-highest border border-outline-variant text-on-surface-variant"
                )}
              >
                {done ? <Check className="w-3 h-3" /> : step.n}
              </div>
              <span
                className={cn(
                  "text-[10px] font-mono font-semibold tracking-wider whitespace-nowrap transition-colors duration-300",
                  active ? "text-primary" : done ? "text-primary/50" : "text-on-surface-variant/40"
                )}
              >
                {step.label}
              </span>
            </div>

            {/* Connector — rendered after circle, not after last step */}
            {idx < STEPS.length - 1 && (
              <Connector active={step.n < currentStep} />
            )}
          </div>
        )
      })}
    </div>
  )
}
