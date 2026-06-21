import type { Metadata } from "next"
import { SystemDesignClient } from "./_components/SystemDesignClient"

export const metadata: Metadata = { title: "System Design | PromptCraft AI" }

export default async function SystemDesignPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>
}) {
  const { tab } = await searchParams
  const initialTab = tab === "arch" ? "arch" : "flow"
  return <SystemDesignClient initialTab={initialTab} />
}
