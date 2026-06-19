import type { Metadata } from "next"
import { Suspense } from "react"
import { WizardClient } from "./_components/WizardClient"

export const metadata: Metadata = { title: "DB & API Design | PromptCraft AI" }

export default function WizardPage() {
  return (
    <Suspense>
      <WizardClient />
    </Suspense>
  )
}
