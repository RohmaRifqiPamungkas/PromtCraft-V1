import * as React from "react"
import { cn } from "@/lib/utils"

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "flex min-h-[80px] w-full rounded-lg border border-outline-variant bg-surface-container px-4 py-3 text-sm text-on-surface placeholder:text-on-surface-variant/40 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-secondary-container focus-visible:border-secondary-container disabled:cursor-not-allowed disabled:opacity-50 transition-colors resize-y",
      className
    )}
    {...props}
  />
))
Textarea.displayName = "Textarea"

export { Textarea }
