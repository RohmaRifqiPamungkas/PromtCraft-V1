import type { Metadata } from "next"
import { CodeAnalysisClient } from "./CodeAnalysisClient"

export const metadata: Metadata = { title: "Code Analysis | PromptCraft AI" }

export default function CodeGeneratorPage() {
  return <CodeAnalysisClient />
}
