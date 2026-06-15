import type { Metadata } from "next"
import { WizardClient } from "./WizardClient"

export const metadata: Metadata = { title: "DB & API Design | PromptCraft AI" }

export default function WizardPage() {
  return <WizardClient />
}
