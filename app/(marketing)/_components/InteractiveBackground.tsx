"use client"

import { useEffect, useRef } from "react"

export function InteractiveBackground() {
  const glowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = glowRef.current
    if (!el) return

    const onMove = (e: MouseEvent) => {
      el.style.setProperty("--mx", `${e.clientX}px`)
      el.style.setProperty("--my", `${e.clientY}px`)
    }

    window.addEventListener("mousemove", onMove, { passive: true })
    return () => window.removeEventListener("mousemove", onMove)
  }, [])

  return (
    <div aria-hidden className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
      {/* Dot grid */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(78,222,163,0.055) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Edge vignette — fades the dot grid toward corners */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 80% at 50% 40%, transparent 40%, #0b1326 100%)",
        }}
      />

      {/* Mouse-following radial glow */}
      <div
        ref={glowRef}
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(650px circle at var(--mx, 50%) var(--my, 55%), rgba(78,222,163,0.07) 0%, rgba(78,222,163,0.025) 35%, transparent 70%)",
        }}
      />
    </div>
  )
}
