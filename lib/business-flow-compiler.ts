export interface FlowActor {
  id: string
  name: string
  role: string
}

export interface FlowStep {
  id: string
  name: string
  actorId: string
  action: string
  inputData: string
  outputData: string
  notes: string
}

export interface BusinessFlowData {
  name: string
  description: string
  category: string
  actors: FlowActor[]
  steps: FlowStep[]
  outputGoal: string
}

export function compileBusinessFlow(data: BusinessFlowData): string {
  const hasContent =
    data.name ||
    data.description ||
    data.actors.some((a) => a.name) ||
    data.steps.some((s) => s.name || s.action)

  if (!hasContent) return ""

  const s: string[] = []

  s.push(`# Business Flow: ${data.name || "[Flow Name]"}`)
  if (data.category) s.push(`**Category:** ${data.category}`)
  s.push("")

  if (data.description) {
    s.push("## Overview")
    s.push(data.description)
    s.push("")
  }

  const namedActors = data.actors.filter((a) => a.name)
  if (namedActors.length > 0) {
    s.push("## Actors / Stakeholders")
    for (const a of namedActors) {
      s.push(`- **${a.name}**${a.role ? `: ${a.role}` : ""}`)
    }
    s.push("")
  }

  const namedSteps = data.steps.filter((st) => st.name || st.action)
  if (namedSteps.length > 0) {
    s.push("## Flow Steps")
    s.push("")
    namedSteps.forEach((step, i) => {
      const actor = data.actors.find((a) => a.id === step.actorId)
      s.push(`### Step ${i + 1}: ${step.name || "[Step Name]"}`)
      if (actor?.name) s.push(`**Actor:** ${actor.name}`)
      if (step.action)     s.push(`**Action:** ${step.action}`)
      if (step.inputData)  s.push(`**Input:** ${step.inputData}`)
      if (step.outputData) s.push(`**Output:** ${step.outputData}`)
      if (step.notes)      s.push(`**Notes:** ${step.notes}`)
      s.push("")
    })
  }

  s.push("## Implementation Request")
  s.push("")

  if (data.outputGoal.trim()) {
    s.push(data.outputGoal.trim())
  } else {
    s.push(
      "Based on the business flow defined above, please help me design and implement the following:",
    )
    s.push("")
    s.push("1. **Database Schema** — Tables/collections and relationships needed to persist state at each step")
    s.push("2. **API Endpoints** — REST or GraphQL endpoints that map to each flow action")
    s.push("3. **Business Logic** — Validation rules, guard conditions, and state transitions")
    s.push("4. **Error Handling** — Failure paths, rollback strategies, and user feedback")
    s.push("5. **Security** — Authentication, authorization, and data protection per actor")
  }

  return s.join("\n")
}
