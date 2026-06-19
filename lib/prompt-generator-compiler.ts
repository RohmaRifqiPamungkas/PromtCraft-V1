export interface PromptGeneratorFormData {
  taskCategory: string
  taskDescription: string
  language: string
  codeContext: string
  outputFormat: string
  tone: string
  additionalNotes: string
  promptMode: "comprehensive" | "lean"
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

/* ── Public entry point ─────────────────────────────────────────────── */

export function compileGeneratorPrompt(f: PromptGeneratorFormData): string {
  if (!f.taskDescription.trim()) return ""

  const lean = f.promptMode === "lean"

  if (f.taskCategory === "Backend Architecture") {
    return lean ? compileBackendArchLean(f) : compileBackendArchComprehensive(f)
  }

  return lean ? compileGenericLean(f) : compileGenericComprehensive(f)
}
