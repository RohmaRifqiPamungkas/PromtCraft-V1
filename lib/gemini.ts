import { GoogleGenAI } from "@google/genai"

let genAI: GoogleGenAI | null = null

function getGenAI(): GoogleGenAI {
  if (genAI) return genAI
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) throw new Error("GEMINI_API_KEY is not configured")
  genAI = new GoogleGenAI({ apiKey })
  return genAI
}

const SYSTEM_INSTRUCTION =
  "You are a senior software architect. Improve the following backend architecture prompt while preserving all requirements. " +
  "Focus on clarity, structure, database design recommendations, and API architecture recommendations. " +
  "Return the result as clean Markdown."

export async function enhancePrompt(prompt: string): Promise<string> {
  const ai = getGenAI()
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: { systemInstruction: SYSTEM_INSTRUCTION },
  })
  const text = response.text
  if (!text) throw new Error("Gemini returned an empty response")
  return text
}
