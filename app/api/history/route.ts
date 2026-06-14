import type { NextRequest } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import type { PromptHistoryItem } from "@/types/prompt"

export async function GET(): Promise<Response> {
  const supabase = getSupabaseServerClient()
  const { data, error } = await supabase
    .from("prompt_history")
    .select("id, original_prompt, enhanced_prompt, created_at")
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

  const supabase = getSupabaseServerClient()
  const { error } = await supabase.from("prompt_history").delete().eq("id", id)

  if (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 })
  }

  return Response.json({ success: true })
}
