import type { Metadata } from "next"
import { ArchitectureClient } from "./_components/ArchitectureClient"

export const metadata: Metadata = { title: "Architecture | PromptCraft AI" }

export default function ArchitecturePage() {
  return <ArchitectureClient />
}
