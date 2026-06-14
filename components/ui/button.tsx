"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
  {
    variants: {
      variant: {
        default:  "bg-primary-container text-on-primary-container hover:bg-primary hover:text-on-primary",
        outline:  "border border-outline-variant text-on-surface-variant hover:text-on-surface hover:border-on-surface-variant bg-transparent",
        ghost:    "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface",
        secondary:"bg-secondary-container text-on-secondary-container hover:bg-secondary hover:text-on-secondary",
        surface:  "bg-surface-container border border-outline-variant text-on-surface hover:bg-surface-container-high",
        destructive: "bg-error-container text-on-error-container hover:bg-error hover:text-on-error",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm:      "h-8 px-3 py-1.5 text-xs",
        lg:      "h-12 px-6 py-3 text-base font-semibold",
        icon:    "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size:    "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
