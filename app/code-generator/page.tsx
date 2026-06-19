import type { Metadata } from "next"
import { CodeAnalysisClient } from "./_components/CodeAnalysisClient"

export const metadata: Metadata = { title: "Code Analysis | PromptCraft AI" }

export default function CodeGeneratorPage() {
  return <CodeAnalysisClient />
}
