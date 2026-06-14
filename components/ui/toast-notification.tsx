"use client"

import { CheckCircle2, XCircle, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface ToastNotificationProps {
  message: string
  variant?: "success" | "error"
  onDismiss?: () => void
  className?: string
}

export function ToastNotification({
  message,
  variant = "success",
  onDismiss,
  className,
}: ToastNotificationProps) {
  const isError = variant === "error"
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl",
        "bg-surface-container-high border text-on-surface",
        "shadow-2xl shadow-black/40 animate-toast",
        isError ? "border-error/40" : "border-outline-variant",
        className
      )}
    >
      {isError ? (
        <XCircle className="h-4 w-4 text-error shrink-0" />
      ) : (
        <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
      )}
      <span className="text-sm font-medium">{message}</span>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="ml-1 text-on-surface-variant hover:text-on-surface transition-colors"
          aria-label="Dismiss"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  )
}
