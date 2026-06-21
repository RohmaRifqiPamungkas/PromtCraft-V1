export interface PromptGeneratorFormData {
  taskCategory: string
  taskDescription: string
  language: string
  codeContext: string
  outputFormat: string
  tone: string
  additionalNotes: string
  promptMode: "comprehensive" | "lean"
  // Debug & Error Fix mode fields
  errorType: string
  errorMessage: string
  framework: string
}

/* ── Token estimator (exported for the preview panel) ────────────────── */

export function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4)
}

/* ═══════════════════════════════════════════════════════════════════════
   COMPREHENSIVE compilers
   Full ADR/HLD structure with scaffolded placeholder guidance text.
   Best for: human review, team documentation, complex systems.
═══════════════════════════════════════════════════════════════════════ */

function compileBackendArchComprehensive(f: PromptGeneratorFormData): string {
  const s: string[] = []

  s.push("# Backend Architecture Design Request")
  s.push("")

  s.push("## 📋 Task Description")
  s.push("")
  s.push(f.taskDescription.trim())
  s.push("")

  s.push("## 🎯 Project Context")
  s.push("")
  s.push("### 📝 Business Requirements & Goals")
  s.push("")
  s.push("- *What are the core business needs driving this architecture?*")
  s.push("- *Key functional requirements (e.g., user registration, login, RBAC)?*")
  s.push("- *Non-functional requirements (latency, availability, compliance, retention)?*")
  s.push("- *Desired scalability target?*")
  s.push("")
  s.push("### 🌐 Existing System Overview")
  s.push("")
  if (f.codeContext.trim()) {
    s.push(f.codeContext.trim())
  } else {
    s.push("- *Describe the current system landscape.*")
    s.push("- *Which services will this interact with or replace?*")
    s.push("- *Shared resources or infrastructure constraints?*")
  }
  s.push("")
  s.push("### 🔧 Current Technical Stack")
  s.push("")
  s.push(`- **Languages / Frameworks:** ${f.language.trim() || "*(e.g., Node.js, Python/FastAPI, Go)*"}`)
  s.push("- **Databases:** *(e.g., PostgreSQL, MongoDB, Redis)*")
  s.push("- **Cloud Provider:** *(e.g., AWS, GCP, Azure, On-Premise)*")
  s.push("- **CI/CD:** *(e.g., GitHub Actions, GitLab CI)*")
  s.push("- **Monitoring / Logging:** *(e.g., Prometheus + Grafana, ELK, Datadog)*")
  s.push("- **Messaging / Queuing:** *(e.g., Kafka, RabbitMQ, SQS)*")
  s.push("- **Container Orchestration:** *(e.g., Kubernetes, ECS)*")
  s.push("")

  s.push("## 🏛️ Architectural Considerations")
  s.push("")
  s.push("### 🗄️ Database Design")
  s.push("")
  s.push("- **Primary Data Models:** *Outline the main entities and their relationships.*")
  s.push("- **Scalability & Performance:** *Expected read/write patterns and volumes? Latency requirements?*")
  s.push("- **Consistency Requirements:** *Strong or eventual consistency?*")
  s.push("- **Data Volume & Growth:** *Initial size and projected growth?*")
  s.push("- **Preferred DB Type:** *SQL, NoSQL, Graph, or time-series? Justify if possible.*")
  s.push("- **Partitioning / Sharding:** *Any data distribution considerations?*")
  s.push("- **Backup & Recovery:** *RTO / RPO requirements?*")
  s.push("")
  s.push("### 🤝 API Architecture")
  s.push("")
  s.push("- **API Style:** *Recommend and justify: REST, GraphQL, gRPC, Event-Driven, or WebSockets?*")
  s.push("- **Auth & Authorization:** *JWT, OAuth2, API Keys, RBAC, ABAC?*")
  s.push("- **Error Handling:** *Consistent error payloads and HTTP status code strategy.*")
  s.push("- **Versioning Strategy:** *URL path, header, or media type?*")
  s.push("- **Rate Limiting & Throttling:** *Required? Anticipated thresholds?*")
  s.push("- **Integration:** *Frontend clients, mobile apps, other backend services?*")
  s.push("- **Latency Targets:** *P99 / P95 response time goals?*")
  s.push("")
  s.push("### ☁️ Deployment & Operations")
  s.push("")
  s.push("- **Deployment Strategy:** *Containers, serverless, or VMs?*")
  s.push("- **Observability:** *Metrics, structured logs, distributed tracing?*")
  s.push("- **Resilience & Fault Tolerance:** *Retries, circuit breakers, graceful degradation?*")
  s.push("- **Security:** *Encryption at rest / in transit, secrets management, compliance?*")
  s.push("")

  s.push("## 📝 Output Preferences")
  s.push("")
  s.push(`- **Format:** ${f.outputFormat || "Detailed ADR or HLD document with C4/sequence/deployment diagrams"}`)
  s.push(`- **Tone:** ${f.tone || "Detailed & thorough with justification for every key decision"}`)
  s.push("- **Level of Detail:** Technical deep-dive for senior engineers")
  s.push("")

  if (f.additionalNotes.trim()) {
    s.push("## ⚠️ Additional Notes")
    s.push("")
    s.push(f.additionalNotes.trim())
  } else {
    s.push("## ⚠️ Additional Notes")
    s.push("")
    s.push("- *Technologies to avoid.*")
    s.push("- *Budgetary or infrastructure constraints.*")
    s.push("- *Team familiarity with specific technologies.*")
    s.push("- *Hard deadlines or phased delivery requirements.*")
  }
  s.push("")

  s.push("## ✅ Success Criteria")
  s.push("")
  s.push("- **Clarity & Completeness:** Well-structured design covering all components and interactions.")
  s.push("- **Feasibility & Pragmatism:** Implementable solution within the stated constraints.")
  s.push("- **Scalability & Maintainability:** Designed for growth, ease of enhancement, and long-term operability.")
  s.push("- **Security Considerations:** Best practices throughout, addressing potential vulnerabilities.")
  s.push("- **Cost-Effectiveness:** Balance performance and reliability against infrastructure cost.")
  s.push("- **Justification:** Rationale and trade-offs behind every key architectural decision.")
  s.push("- **Actionable Recommendations:** Concrete steps for database design, API architecture, and deployment.")
  s.push("")

  return s.join("\n")
}

/* ═══════════════════════════════════════════════════════════════════════
   LEAN compilers
   Dense, keyword-driven prompts. No placeholder text — empty fields are
   simply omitted. Typically 60–75 % fewer tokens than comprehensive.
   Best for: direct AI tool input, cost-sensitive API usage.
═══════════════════════════════════════════════════════════════════════ */

function compileBackendArchLean(f: PromptGeneratorFormData): string {
  const s: string[] = []

  s.push("# Backend Architecture Request")
  s.push("")
  s.push(`**Goal:** ${f.taskDescription.trim()}`)

  if (f.language.trim()) {
    s.push("")
    s.push(`**Stack:** ${f.language.trim()}`)
  }

  if (f.codeContext.trim()) {
    s.push("")
    s.push("**Context:**")
    s.push("```")
    s.push(f.codeContext.trim())
    s.push("```")
  }

  s.push("")
  s.push(
    "Provide a complete HLD/ADR covering: " +
    "(1) **Database** — entity schema, scalability strategy, consistency model, tech choice with justification, backup/recovery; " +
    "(2) **API** — style (REST/GraphQL/gRPC), auth mechanism (JWT/OAuth2/RBAC), versioning, rate limiting, error handling; " +
    "(3) **Infrastructure** — deployment strategy, observability (metrics/logs/traces), fault tolerance (circuit breakers/retries), security (encryption, secrets)."
  )

  const prefs: string[] = []
  if (f.outputFormat) prefs.push(`Format: ${f.outputFormat}`)
  if (f.tone) prefs.push(`Tone: ${f.tone}`)
  if (prefs.length) {
    s.push("")
    s.push(prefs.join(" · "))
  }

  if (f.additionalNotes.trim()) {
    s.push("")
    s.push(`**Constraints:** ${f.additionalNotes.trim()}`)
  }

  s.push("")
  s.push("**Criteria:** clarity, feasibility, scalability, security, cost efficiency, justified decisions, actionable steps.")
  s.push("")

  return s.join("\n")
}

/* ── Generic lean ────────────────────────────────────────────────────── */

const LEAN_CRITERIA: Record<string, string> = {
  "Feature Request": "Complete working code, all imports, inline comments for non-obvious logic, setup steps.",
  "Bug Fix": "Root cause (not just symptom), corrected code, why it was wrong, prevention advice.",
  "UI / Layout": "Full component/style code, responsive, matches design conventions, all class names.",
  "Code Refactoring": "Preserve behaviour, explain changes, improve readability/performance, flag breaking changes.",
  "Code Review": "Bugs and security issues with severity, specific suggestions with examples, prioritised: critical → minor.",
  "Performance Optimization": "Exact bottleneck(s), optimised code, quantified improvement, trade-offs noted.",
  "Documentation": "Purpose, params, return values, examples, one idea per sentence, edge cases.",
}

const DEFAULT_LEAN_CRITERIA = "Complete and actionable response, all relevant code or examples, reasoning where it adds value."

function compileGenericLean(f: PromptGeneratorFormData): string {
  const s: string[] = []
  const category = f.taskCategory || "Task"

  s.push(`# ${category}`)
  s.push("")
  s.push(f.taskDescription.trim())

  if (f.language.trim()) {
    s.push("")
    s.push(`**Stack:** ${f.language.trim()}`)
  }

  if (f.codeContext.trim()) {
    s.push("")
    s.push("```")
    s.push(f.codeContext.trim())
    s.push("```")
  }

  const prefs: string[] = []
  if (f.outputFormat) prefs.push(`Format: ${f.outputFormat}`)
  if (f.tone) prefs.push(`Tone: ${f.tone}`)
  if (prefs.length) {
    s.push("")
    s.push(prefs.join(" · "))
  }

  if (f.additionalNotes.trim()) {
    s.push("")
    s.push(`**Notes:** ${f.additionalNotes.trim()}`)
  }

  s.push("")
  s.push(`**Criteria:** ${LEAN_CRITERIA[f.taskCategory] ?? DEFAULT_LEAN_CRITERIA}`)
  s.push("")

  return s.join("\n")
}

/* ── Generic comprehensive ───────────────────────────────────────────── */

const COMPREHENSIVE_CRITERIA: Record<string, string[]> = {
  "Feature Request": [
    "Provide complete, working implementation code",
    "Include all required imports and dependencies",
    "Add inline comments for non-obvious logic",
    "List any required config or setup steps",
  ],
  "Bug Fix": [
    "Identify the root cause, not just the symptom",
    "Provide the corrected code with the fix clearly visible",
    "Explain why the original code was incorrect",
    "Suggest how to prevent similar issues in the future",
  ],
  "UI / Layout": [
    "Provide the full component or style code",
    "Ensure the solution is responsive where applicable",
    "Match existing design conventions and token usage",
    "Include all necessary class names or CSS",
  ],
  "Code Refactoring": [
    "Preserve all existing behaviour exactly",
    "Clearly explain what changed and why",
    "Improve readability, maintainability, or performance",
    "Flag any potential breaking changes",
  ],
  "Code Review": [
    "List bugs and security issues with severity rating",
    "Provide specific improvement suggestions with examples",
    "Comment on code quality and adherence to best practices",
    "Prioritise findings: critical → major → minor",
  ],
  "Performance Optimization": [
    "Identify the exact bottleneck(s) with evidence",
    "Provide the optimised code or configuration",
    "Quantify the expected improvement where possible",
    "Note any trade-offs introduced by the optimisation",
  ],
  "Documentation": [
    "Cover the purpose, parameters, return values, and examples",
    "Match the project's existing documentation style",
    "Keep it concise — one idea per sentence",
    "Include edge-case notes where relevant",
  ],
}

const DEFAULT_COMPREHENSIVE_CRITERIA = [
  "Provide a complete and actionable response",
  "Include all relevant code or examples",
  "Explain your reasoning where it adds value",
]

function compileGenericComprehensive(f: PromptGeneratorFormData): string {
  const s: string[] = []
  const category = f.taskCategory || "Task"

  s.push(`# ${category}`)
  s.push("")
  s.push("## 📋 Task Description")
  s.push("")
  s.push(f.taskDescription.trim())
  s.push("")

  if (f.language.trim() || f.codeContext.trim()) {
    s.push("## 🔧 Technical Context")
    s.push("")
    if (f.language.trim()) {
      s.push(`**Language / Framework:** ${f.language.trim()}`)
      s.push("")
    }
    if (f.codeContext.trim()) {
      s.push("**Relevant Code / Context:**")
      s.push("")
      s.push("```")
      s.push(f.codeContext.trim())
      s.push("```")
      s.push("")
    }
  }

  s.push("## 📝 Output Preferences")
  s.push("")
  if (f.outputFormat) s.push(`- **Format:** ${f.outputFormat}`)
  if (f.tone) s.push(`- **Tone:** ${f.tone}`)
  s.push("")

  if (f.additionalNotes.trim()) {
    s.push("## ⚠️ Additional Notes")
    s.push("")
    s.push(f.additionalNotes.trim())
    s.push("")
  }

  s.push("## ✅ Success Criteria")
  s.push("")
  const criteria = COMPREHENSIVE_CRITERIA[f.taskCategory] ?? DEFAULT_COMPREHENSIVE_CRITERIA
  criteria.forEach((c) => s.push(`- ${c}`))
  s.push("")

  return s.join("\n")
}

/* ═══════════════════════════════════════════════════════════════════════
   DEBUG & ERROR FIX compiler
   Produces a structured 8-section debugging prompt.
   Fields used: errorType, errorMessage, language, codeContext,
                framework, additionalNotes.
═══════════════════════════════════════════════════════════════════════ */

const ERROR_DESCRIPTIONS: Record<string, string> = {
  "Syntax Error":          "a SyntaxError — the code violates the grammatical rules of the language and cannot be parsed",
  "Runtime Error":         "a RuntimeError — the code is syntactically valid but fails during execution",
  "Type Error":            "a TypeError — an operation is applied to a value of an incompatible type",
  "Logic Error":           "a LogicError — the code runs without exceptions but produces incorrect results",
  "Build Error":           "a BuildError — the project fails to compile or bundle",
  "Network / API Error":   "a Network/API Error — a failure in an HTTP request or external service call",
  "Reference Error":       "a ReferenceError — an identifier is used before it is declared or outside its scope",
  "Null / Undefined Error":"a Null/Undefined Error — code attempts to access a property on a null or undefined value",
  "Other":                 "an error that requires investigation",
}

function compileDebugPrompt(f: PromptGeneratorFormData): string {
  const s: string[] = []

  const lang     = f.language.trim()       || "the language in use"
  const fw       = f.framework.trim()      || null
  const ctx      = f.additionalNotes.trim()|| null
  const errType  = f.errorType             || "Error"
  const errDesc  = ERROR_DESCRIPTIONS[errType] ?? "an error"
  const hasCode  = !!f.codeContext.trim()
  const hasError = !!f.errorMessage.trim()
  const langSlug = f.language.toLowerCase().replace(/[^a-z0-9#+]/g, "")

  s.push(`# AI Debugging Prompt — ${errType}`)
  s.push(`> Generated by PromptCraft AI`)
  s.push(`> Copy this prompt into ChatGPT, Claude, Gemini, Cursor, or Copilot to receive a structured solution.`)
  s.push(``)
  s.push(`---`)
  s.push(``)

  s.push(`## 1. Error Summary`)
  s.push(``)
  s.push(`I am encountering ${errDesc}.`)
  if (hasError) {
    s.push(``)
    s.push(`**Full error message / stack trace:**`)
    s.push(``)
    s.push("```")
    s.push(f.errorMessage.trim())
    s.push("```")
  }
  s.push(``)

  s.push(`## 2. Error Location`)
  s.push(``)
  if (hasCode) {
    s.push(`**Problematic code that triggers this error:**`)
    s.push(``)
    s.push(`\`\`\`${langSlug}`)
    s.push(f.codeContext.trim())
    s.push("```")
  } else {
    s.push(`No code snippet has been provided. Based on the error message and stack trace above, please help identify the most likely originating file, function, line number, or code pattern.`)
  }
  s.push(``)

  s.push(`## 3. Root Cause Analysis`)
  s.push(``)
  s.push(`Please perform a thorough root cause analysis and address each of the following:`)
  s.push(``)
  s.push(`- **Primary cause:** What specific condition directly triggers this error?`)
  s.push(`- **Contributing factors:** What surrounding conditions make this error possible (wrong types, missing null checks, incorrect state, timing issues)?`)
  s.push(`- **Trigger scenario:** Does this error occur always, intermittently, or only under specific conditions or environments?`)
  if (fw) {
    s.push(`- **Framework-specific behaviour:** Are there ${fw}-specific lifecycle rules, conventions, or known pitfalls that contribute to this error?`)
  }
  s.push(`- **Dependency issues:** Could a version mismatch, breaking API change, or library incompatibility be involved?`)
  s.push(``)

  s.push(`## 4. Conceptual Analogy`)
  s.push(``)
  s.push(`Provide a clear, memorable real-world analogy that explains **why this class of error occurs** — not just what it is. The analogy should:`)
  s.push(``)
  s.push(`- Map the underlying programming concept to a familiar everyday situation`)
  s.push(`- Help build lasting mental intuition so this error can be recognised and avoided in the future`)
  s.push(`- Be concise (2–4 sentences)`)
  s.push(``)

  s.push(`## 5. Technical Context`)
  s.push(``)
  s.push(`- **Language:** ${lang}`)
  s.push(`- **Framework / Library:** ${fw ?? "Not specified"}`)
  if (ctx) {
    s.push(`- **Additional context:** ${ctx}`)
  }
  s.push(``)
  s.push(`Take this context into account when diagnosing the error. If the language or framework has known quirks or common pitfalls related to this error type, please highlight them explicitly.`)
  s.push(``)

  s.push(`## 6. Investigation Steps`)
  s.push(``)
  s.push(`Walk through the following checklist before proposing a fix:`)
  s.push(``)
  s.push(`1. Confirm the error is reproducible and isolate the minimum code that triggers it.`)
  s.push(`2. Examine the full call stack to trace execution from the entry point to the failure site.`)
  s.push(`3. Inspect the runtime values of key variables at the point of failure.`)
  s.push(`4. Determine whether the error is environment-specific (development vs. production, client vs. server, OS, runtime version).`)
  if (fw) {
    s.push(`5. Review ${fw} configuration, plugin settings, or middleware that may influence the behaviour.`)
    s.push(`6. Check changelogs of recently upgraded dependencies for breaking changes.`)
  } else {
    s.push(`5. Review recent configuration changes, environment variable updates, or dependency upgrades.`)
  }
  s.push(``)

  s.push(`## 7. Resolution Request`)
  s.push(``)
  s.push(`You are an expert ${lang} developer${fw ? ` with deep knowledge of ${fw}` : ""}. Based on everything above:`)
  s.push(``)
  s.push(`1. **Identify** the precise root cause.`)
  s.push(`2. **Fix** — provide the corrected code with inline comments explaining each key change and why it resolves the issue.`)
  s.push(`3. **Explain** — in plain language, describe why the original code failed and why the fix works.`)
  s.push(`4. **Alternatives** — if multiple solutions exist, list them in order of preference with trade-offs for each.`)
  s.push(`5. **Prevention** — recommend patterns, lint rules, or architectural decisions that prevent this error class from recurring.`)
  s.push(``)

  s.push(`## 8. Expected Output Format`)
  s.push(``)
  s.push(`Structure your response using these sections:`)
  s.push(``)
  s.push(`- **Root Cause** — one concise paragraph`)
  s.push(`- **Analogy** — 2–4 sentences mapping the error to an everyday concept`)
  s.push(`- **Corrected Code** — full corrected snippet with inline comments`)
  s.push(`- **Explanation** — why the original failed and why the fix works`)
  s.push(`- **Alternative Solutions** — ranked by preference with trade-off notes`)
  s.push(`- **Prevention Tips** — patterns, tooling, or practices to avoid this error class`)
  s.push(`- **Confidence** — rate your diagnosis (High / Medium / Low) and briefly explain why`)

  return s.join("\n")
}

/* ── Public entry point ─────────────────────────────────────────────── */

export function compileGeneratorPrompt(f: PromptGeneratorFormData): string {
  if (f.taskCategory === "Debug & Error Fix") {
    if (!f.errorMessage.trim()) return ""
    return compileDebugPrompt(f)
  }

  if (!f.taskDescription.trim()) return ""

  const lean = f.promptMode === "lean"

  if (f.taskCategory === "Backend Architecture") {
    return lean ? compileBackendArchLean(f) : compileBackendArchComprehensive(f)
  }

  return lean ? compileGenericLean(f) : compileGenericComprehensive(f)
}
