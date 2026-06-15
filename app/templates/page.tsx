import type { Metadata } from "next"
import { TemplatesClient } from "./TemplatesClient"

export const metadata: Metadata = { title: "Templates | PromptCraft AI" }

export default function TemplatesPage() {
  return <TemplatesClient />
}
