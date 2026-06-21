import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { getSupabaseAuthClient } from "@/lib/supabase/server"
import { HistoryClient } from "./_components/HistoryClient"

export const metadata: Metadata = { title: "Prompt History | PromptCraft AI" }

export default async function HistoryPage() {
  const supabase = await getSupabaseAuthClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  return <HistoryClient />
}
