import * as React from "react"
import { cn } from "@/lib/utils"

const Label = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn(
      "text-[11px] font-mono font-semibold tracking-widest uppercase text-on-surface-variant",
      className
    )}
    {...props}
  />
))
Label.displayName = "Label"

export { Label }
