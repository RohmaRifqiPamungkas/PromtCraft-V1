@AGENTS.md

# PromptCraft AI — Project Guide

## What this project is

PromptCraft AI is a web tool that helps developers craft structured AI prompts for backend/database design. Users fill in a 3-step wizard (entities → tech stack → constraints) and get a ready-to-paste Markdown prompt for use with AI assistants.

---

## Commands

```bash
npm run dev      # start dev server on localhost:3000
npm run build    # production build
npm run lint     # ESLint check
```

---

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16.2.9 (App Router) |
| UI | React 19, Tailwind CSS v4 |
| Components | Radix UI primitives + custom wrappers in `components/ui/` |
| Icons | lucide-react |
| Language | TypeScript (strict) |
| Fonts | Geist Sans, Inter, JetBrains Mono (via `next/font/google`) |

---

## Directory layout

```
app/
  layout.tsx          # Root layout — sets dark class, loads fonts, metadata
  page.tsx            # Single page; owns all wizard state
  globals.css         # Tailwind config + design-token custom properties

components/
  layout/
    Sidebar.tsx       # Fixed left nav, hidden on mobile
  prompt/
    PromptWizard.tsx  # 3-step form (Step1/Step2/Step3 defined inside)
    PromptPreview.tsx # Right panel — renders compiled prompt
    ProgressStepper.tsx
    MarkdownVisualizer.tsx
  ui/                 # Thin Radix wrappers: button, card, checkbox, label,
                      #   select, textarea, toast-notification

lib/
  prompt-compiler.ts  # Pure fn: compilePrompt(WizardFormData) → string
  utils.ts            # cn() helper (clsx + tailwind-merge)

types/
  prompt.ts           # WizardFormData interface, WizardStep = 1|2|3
```

---

## Architecture: how state flows

```
page.tsx  (owns all state)
  ├─ formData: WizardFormData     ← updated by PromptWizard via onFormChange
  ├─ currentStep: WizardStep
  ├─ compiledPrompt               ← useMemo(() => compilePrompt(formData))
  │
  ├─► PromptWizard  (read formData, emit deltas)
  └─► PromptPreview (read compiledPrompt, isGenerated, callbacks)
```

`compilePrompt` is a pure function — no side effects, no API calls. The preview is always in sync with the form via `useMemo`.

---

## Styling conventions

This project uses **Tailwind CSS v4** with **Material Design 3-inspired tokens** defined as CSS custom properties in `globals.css`. Always use tokens, never raw colours.

### Colour tokens (always prefer these)

| Token | Usage |
|---|---|
| `bg-background` | Page background |
| `bg-surface` | Card / panel background |
| `bg-surface-dim` | Slightly dimmed surface (main content area) |
| `bg-surface-container` | Sidebar, grouped containers |
| `bg-surface-container-low` | Subtle inset areas |
| `bg-surface-container-high` | Hover states on containers |
| `text-on-surface` | Primary text |
| `text-on-surface-variant` | Secondary / muted text |
| `text-primary` | Brand accent |
| `bg-primary-container` | Tinted accent background |
| `border-outline-variant` | Dividers and subtle borders |

The entire UI is **dark-only** — `dark` class is set on `<html>` and never toggled.

### Typography tokens

- `font-geist` — body copy
- `font-inter` — headings / labels
- `font-mono` / `font-jetbrains-mono` — code, version badges, step labels

---

## Component patterns

### `cn()` for conditional classes

```tsx
import { cn } from "@/lib/utils"
className={cn("base-class", condition && "extra-class")}
```

### Radix UI wrappers in `components/ui/`

All Radix primitives are wrapped to accept standard `className` props and apply project tokens. Always import from `@/components/ui/*`, not directly from `@radix-ui/*`.

### Page-level alias `@/`

The `@/` alias maps to the project root. Use it everywhere — no relative `../../` imports.

---

## Adding a new wizard step

1. Add the new step number to `WizardStep` in [types/prompt.ts](types/prompt.ts)
2. Add a `Step4` component inside [components/prompt/PromptWizard.tsx](components/prompt/PromptWizard.tsx) following the same pattern as Step1–3
3. Add a `STEP_META` entry
4. Update the navigation logic (`currentStep < 4` for Continue, render Step4 conditionally)
5. Add any new fields to `WizardFormData` and handle them in `compilePrompt`

---

## Adding a new prompt output section

Edit [lib/prompt-compiler.ts](lib/prompt-compiler.ts) — the `compilePrompt` function pushes lines into an array `s[]`. Keep it pure; no async, no imports beyond the types file.

---

## What NOT to do

- Do not introduce a state management library (Zustand, Redux, etc.) — the current `useState` in `page.tsx` is intentional and sufficient.
- Do not add an API route or server action unless the feature genuinely requires server-side logic.
- Do not use raw hex/rgb colours in className — always use design tokens.
- Do not import Radix primitives directly into feature components — use the wrappers in `components/ui/`.
- Do not add `"use client"` to files that don't need it; the layout and lib files are intentionally server-safe.
- Do not enable light mode without a full token audit — the palette is dark-only.
