import type { Metadata } from "next"
import { PromptGeneratorClient } from "./_components/PromptGeneratorClient"

export const metadata: Metadata = { title: "Prompt Generator | PromptCraft AI" }

export default function PromptGeneratorPage() {
  return <PromptGeneratorClient />
}
