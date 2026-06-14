export interface WizardFormData {
  // Step 1 — Core Entities
  projectType: string
  entities: string

  // Step 2 — Tech Prefs
  framework: string
  database: string
  apiStyle: string

  // Step 3 — Constraints
  includeSqlDdl: boolean
  repositoryPattern: boolean
  unitTestBoilerplate: boolean
  solidPrinciples: boolean
  typescriptStrict: boolean
  includeIndexes: boolean
}

export type WizardStep = 1 | 2 | 3

export interface PromptHistoryItem {
  id: string
  original_prompt: string
  enhanced_prompt: string | null
  created_at: string
}
