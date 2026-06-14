import type { NextRequest } from "next/server"
import { enhancePrompt } from "@/lib/gemini"
import { getSupabaseServerClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest): Promise<Response> {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return Response.json({ success: false, error: "Invalid JSON body" }, { status: 400 })
  }

  const originalPrompt =
    body !== null && typeof body === "object" && "prompt" in body
      ? String((body as { prompt: unknown }).prompt)
      : ""

  if (!originalPrompt.trim()) {
    return Response.json(
      { success: false, error: "Prompt cannot be empty" },
      { status: 400 }
    )
  }

  let enhancedText: string
  try {
    enhancedText = await enhancePrompt(originalPrompt)
  } catch (err) {
    const message = err instanceof Error ? err.message : "Gemini request failed"
    const isConfig = message.includes("not configured")
    return Response.json({ success: false, error: message }, { status: isConfig ? 503 : 502 })
  }

  try {
    const supabase = getSupabaseServerClient()
    await supabase.from("prompt_history").insert({
      original_prompt: originalPrompt,
      enhanced_prompt: enhancedText,
    })
  } catch {
    // Non-fatal — return enhanced text even if persistence fails
  }

  return Response.json({ success: true, enhancedPrompt: enhancedText })
}
