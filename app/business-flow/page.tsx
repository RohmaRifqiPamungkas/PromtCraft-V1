import type { Metadata } from "next"
import { BusinessFlowClient } from "./_components/BusinessFlowClient"

export const metadata: Metadata = { title: "Business Flow | PromptCraft AI" }

export default function BusinessFlowPage() {
  return <BusinessFlowClient />
}
