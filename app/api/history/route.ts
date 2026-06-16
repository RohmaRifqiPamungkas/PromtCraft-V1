import type { NextRequest } from "next/server"
import { getSupabaseAuthClient } from "@/lib/supabase/server"
import type { PromptHistoryItem } from "@/types/prompt"

export async function GET(): Promise<Response> {
  const supabase = await getSupabaseAuthClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return Response.json({ success: false, error: "Unauthorized" }, { status: 401 })
  }

  const { data, error } = await supabase
    .from("prompt_history")
    .select("id, original_prompt, enhanced_prompt, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(20)

  if (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 })
  }

  return Response.json({
    success: true,
    data: (data ?? []) as PromptHistoryItem[],
  })
}

export async function DELETE(request: NextRequest): Promise<Response> {
  const supabase = await getSupabaseAuthClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return Response.json({ success: false, error: "Unauthorized" }, { status: 401 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return Response.json({ success: false, error: "Invalid JSON body" }, { status: 400 })
  }

  const id =
    body !== null && typeof body === "object" && "id" in body
      ? String((body as { id: unknown }).id)
      : ""

  if (!id) {
    return Response.json({ success: false, error: "Missing id" }, { status: 400 })
  }

  const { error } = await supabase
    .from("prompt_history")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id)

  if (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 })
  }

  return Response.json({ success: true })
}
