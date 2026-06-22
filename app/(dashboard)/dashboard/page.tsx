import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { getSupabaseAuthClient } from "@/lib/supabase/server"
import { DashboardShell } from "./_components/DashboardShell"
import type { PromptHistoryItem } from "@/types/prompt"

export const metadata: Metadata = { title: "Dashboard | PromptCraft AI" }

async function fetchData(userId: string) {
  try {
    const db = await getSupabaseAuthClient()
    const today = new Date(); today.setHours(0, 0, 0, 0)
    const [totRes, enhRes, todRes, recRes] = await Promise.all([
      db.from("prompt_history").select("id", { count: "exact", head: true }).eq("user_id", userId),
      db.from("prompt_history").select("id", { count: "exact", head: true }).eq("user_id", userId).not("enhanced_prompt", "is", null),
      db.from("prompt_history").select("id", { count: "exact", head: true }).eq("user_id", userId).gte("created_at", today.toISOString()),
      db.from("prompt_history").select("id,original_prompt,enhanced_prompt,created_at").eq("user_id", userId).order("created_at", { ascending: false }).limit(5),
    ])
    return {
      total: totRes.count ?? 0,
      enhanced: enhRes.count ?? 0,
      today: todRes.count ?? 0,
      recent: (recRes.data ?? []) as PromptHistoryItem[],
    }
  } catch {
    return { total: 0, enhanced: 0, today: 0, recent: [] as PromptHistoryItem[] }
  }
}

export default async function DashboardPage() {
  const supabase = await getSupabaseAuthClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  const [{ total, enhanced, today, recent }, profileRes] = await Promise.all([
    fetchData(user.id),
    supabase.from("profiles").select("full_name, email").eq("id", user.id).single(),
  ])

  const profile = profileRes.data
  const firstName = profile?.full_name?.split(" ")[0]
    ?? profile?.email?.split("@")[0]
    ?? user.email?.split("@")[0]
    ?? "there"

  return (
    <DashboardShell
      total={total}
      enhanced={enhanced}
      today={today}
      recent={recent}
      firstName={firstName}
      profileEmail={profile?.email ?? user.email ?? ""}
      profileFullName={profile?.full_name ?? null}
    />
  )
}
