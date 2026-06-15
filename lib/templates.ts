export type TemplateCategory =
  | "All"
  | "Code Generation"
  | "Debugging"
  | "UI/UX Design"
  | "Database Design"
  | "Testing"
  | "Code Review"
  | "Documentation"
  | "Content Writing"
  | "Marketing"

export type TemplateDifficulty = "Quick" | "Standard" | "Detailed"
export type EstimatedLength = "Short" | "Medium" | "Long"

export interface TemplateVariable {
  key: string
  label: string
  placeholder: string
  type: "text" | "textarea" | "select"
  options?: string[]
  required: boolean
  hint?: string
}

export interface PromptTemplate {
  id: string
  title: string
  description: string
  category: Exclude<TemplateCategory, "All">
  difficulty: TemplateDifficulty
  estimatedLength: EstimatedLength
  tags: string[]
  variables: TemplateVariable[]
  template: string
}

export const CATEGORIES: TemplateCategory[] = [
  "All",
  "Code Generation",
  "Debugging",
  "UI/UX Design",
  "Database Design",
  "Testing",
  "Code Review",
  "Documentation",
  "Content Writing",
  "Marketing",
]

/** Replace {{key}} tokens with user values, or [key] placeholder when blank. */
export function compileTemplate(
  template: string,
  vars: Record<string, string>,
): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key: string) => {
    const val = vars[key]?.trim()
    return val || `[${key.replace(/_/g, " ")}]`
  })
}

/* ─────────────────────────────────────────────────────────────────── */
/*  TEMPLATES                                                          */
/* ─────────────────────────────────────────────────────────────────── */

export const TEMPLATES: PromptTemplate[] = [
  /* 1 ── Feature Implementation ───────────────────────────────────── */
  {
    id: "feature-implementation",
    title: "Feature Implementation",
    description:
      "Generate a complete, production-ready implementation for any new feature with clean code, error handling, and usage examples.",
    category: "Code Generation",
    difficulty: "Standard",
    estimatedLength: "Long",
    tags: ["code", "implementation", "backend", "fullstack"],
    variables: [
      { key: "language", label: "Programming Language", placeholder: "e.g., TypeScript", type: "text", required: true },
      { key: "framework", label: "Framework / Library", placeholder: "e.g., Node.js / Express", type: "text", required: true },
      { key: "project_type", label: "Project Type", placeholder: "e.g., REST API, SaaS backend, CLI tool", type: "text", required: false, hint: "What kind of project is this going into?" },
      { key: "feature_name", label: "Feature Name", placeholder: "e.g., JWT Authentication Middleware", type: "text", required: true },
      { key: "requirements", label: "Requirements", placeholder: "Describe inputs, outputs, and business logic…", type: "textarea", required: true },
      { key: "constraints", label: "Additional Constraints", placeholder: "e.g., must use existing User model, no external auth libraries", type: "textarea", required: false },
    ],
    template: `## Role
You are a senior {{language}} developer with deep expertise in {{framework}} and a track record of shipping production-quality code.

## Context
- **Project type:** {{project_type}}
- **Language:** {{language}}
- **Framework:** {{framework}}

## Task
Implement the following feature from scratch: **{{feature_name}}**

### Requirements
{{requirements}}

## Constraints
- Use modern {{language}} idioms and current best practices
- Write clean, self-documenting code with meaningful variable and function names
- Include comprehensive error handling for every failure path
- {{constraints}}
- Avoid unnecessary external dependencies
- Ensure the code is testable and follows separation of concerns

## Output Format
Respond with the following sections:

1. **Implementation** — complete, working code with inline comments on non-obvious logic
2. **Approach** — 2–3 sentences explaining key design decisions
3. **Usage Example** — a practical snippet showing how to use the implementation
4. **Edge Cases & Limitations** — what to watch out for in production`,
  },

  /* 2 ── Bug Debugger ─────────────────────────────────────────────── */
  {
    id: "bug-debugger",
    title: "Bug Debugger",
    description:
      "Diagnose and fix bugs with a structured root-cause analysis, corrected code, and prevention strategies.",
    category: "Debugging",
    difficulty: "Quick",
    estimatedLength: "Medium",
    tags: ["debug", "fix", "error", "root-cause"],
    variables: [
      { key: "language", label: "Language", placeholder: "e.g., TypeScript", type: "text", required: true },
      { key: "framework", label: "Framework / Library", placeholder: "e.g., Next.js, Express", type: "text", required: false },
      { key: "error_description", label: "Error / Unexpected Behaviour", placeholder: "Paste the full error message or describe what goes wrong…", type: "textarea", required: true },
      { key: "code_snippet", label: "Code That Triggers the Bug", placeholder: "Paste the relevant code here…", type: "textarea", required: true },
      { key: "expected", label: "Expected Behaviour", placeholder: "What should happen?", type: "text", required: true },
      { key: "actual", label: "Actual Behaviour", placeholder: "What actually happens?", type: "text", required: true },
    ],
    template: `## Role
You are an expert debugger and senior {{language}} engineer specialised in diagnosing and resolving complex runtime and logic issues.

## Context
- **Language:** {{language}}
- **Framework / Library:** {{framework}}

## Task
Diagnose and fix the following bug.

### Error / Unexpected Behaviour
\`\`\`
{{error_description}}
\`\`\`

### Code That Triggers the Issue
\`\`\`{{language}}
{{code_snippet}}
\`\`\`

### Expected vs Actual
- **Expected:** {{expected}}
- **Actual:** {{actual}}

## Constraints
- Identify the precise root cause before suggesting any fix
- If multiple root causes are plausible, address the most likely one first and mention alternatives
- Provide the corrected, production-ready code
- Keep changes minimal — do not refactor unrelated code unless it directly contributes to the bug

## Output Format
1. **Root Cause** — one concise paragraph explaining what specifically triggers this error
2. **Fixed Code** — corrected snippet with a comment on each key change and why it resolves the issue
3. **Why It Failed** — plain-language explanation of the original error
4. **Prevention** — pattern, lint rule, or practice that prevents this class of bug from recurring`,
  },

  /* 3 ── UI Component Generator ───────────────────────────────────── */
  {
    id: "ui-component",
    title: "UI Component Generator",
    description:
      "Generate a complete, accessible, and reusable UI component with typed props, state management, and usage examples.",
    category: "UI/UX Design",
    difficulty: "Standard",
    estimatedLength: "Long",
    tags: ["react", "component", "ui", "frontend", "accessible"],
    variables: [
      { key: "framework", label: "UI Framework", placeholder: "React", type: "select", options: ["React", "Vue 3", "Svelte", "Angular"], required: true },
      { key: "styling", label: "Styling Approach", placeholder: "Tailwind CSS", type: "select", options: ["Tailwind CSS", "CSS Modules", "styled-components", "Vanilla CSS"], required: true },
      { key: "component_name", label: "Component Name", placeholder: "e.g., DataTable, DatePicker, ConfirmModal", type: "text", required: true },
      { key: "component_description", label: "What It Should Do", placeholder: "Describe the component's purpose and behaviour…", type: "textarea", required: true },
      { key: "props", label: "Props / API", placeholder: "e.g., items: string[], onSelect: (item) => void, loading: boolean", type: "textarea", required: false, hint: "List the props this component should accept" },
      { key: "accessibility", label: "Accessibility Requirements", placeholder: "e.g., keyboard navigation, ARIA labels, focus trap", type: "text", required: false },
    ],
    template: `## Role
You are a senior frontend engineer and UI/UX specialist with deep expertise in {{framework}}, component design patterns, and web accessibility.

## Context
- **Framework:** {{framework}}
- **Styling:** {{styling}}

## Task
Build the following reusable UI component: **{{component_name}}**

### Description
{{component_description}}

### Props / API
{{props}}

### Accessibility Requirements
{{accessibility}}

## Constraints
- Use {{framework}} best practices and modern patterns (hooks, composition API, signals, etc.)
- Apply {{styling}} for all styles — no inline styles except for dynamic values
- Ensure full keyboard accessibility and correct ARIA attributes
- Write TypeScript types / interfaces for all props
- Make the component controlled or uncontrolled where semantically appropriate
- Keep the component pure and side-effect-free where possible

## Output Format
1. **Component Code** — fully functional {{framework}} component with TypeScript types
2. **Props Reference** — table: name | type | default | description
3. **Usage Examples** — 2–3 different real-world usage scenarios
4. **Accessibility Notes** — what was implemented for a11y
5. **Customisation Tips** — how to extend or theme the component`,
  },

  /* 4 ── REST API Designer ────────────────────────────────────────── */
  {
    id: "rest-api-design",
    title: "REST API Designer",
    description:
      "Design a complete, well-structured REST API with endpoints, request/response schemas, error codes, and a summary table.",
    category: "Database Design",
    difficulty: "Standard",
    estimatedLength: "Medium",
    tags: ["api", "rest", "endpoints", "backend", "openapi"],
    variables: [
      { key: "resource", label: "Resource Name", placeholder: "e.g., Product, User, Order", type: "text", required: true },
      { key: "use_case", label: "Use Case / Domain", placeholder: "e.g., E-commerce product catalogue", type: "text", required: true },
      { key: "operations", label: "Required Operations", placeholder: "e.g., Create, Read (list + single), Update, Delete, Search, Soft-delete", type: "textarea", required: true },
      { key: "auth", label: "Authentication", placeholder: "e.g., JWT Bearer token, API Key, None", type: "text", required: false },
      { key: "extras", label: "Special Requirements", placeholder: "e.g., pagination, filtering, versioning, rate limiting", type: "textarea", required: false },
    ],
    template: `## Role
You are a senior backend architect with extensive experience designing RESTful APIs that are consistent, intuitive, and production-ready.

## Context
- **Resource:** {{resource}}
- **Domain / Use Case:** {{use_case}}
- **Authentication:** {{auth}}

## Task
Design a complete REST API for the **{{resource}}** resource.

### Required Operations
{{operations}}

### Special Requirements
{{extras}}

## Constraints
- Follow REST conventions: correct HTTP methods, plural resource nouns, nested routes where appropriate
- Use consistent naming, status codes, and response envelopes
- Design responses for both success and all error cases
- Include pagination design for list endpoints
- Consider idempotency for PUT and DELETE
- Version the API under \`/api/v1/\`

## Output Format
For each endpoint provide:
- **Method + Path** — e.g., \`GET /api/v1/{{resource}}s\`
- **Description** — what it does
- **Request** — headers, path params, query params, body schema (JSON)
- **Success Response** — body (JSON) + HTTP status code
- **Error Responses** — relevant codes and bodies

Finish with a **Summary Table** of all endpoints (Method | Path | Description | Auth required).`,
  },

  /* 5 ── Unit Test Writer ─────────────────────────────────────────── */
  {
    id: "unit-test-writer",
    title: "Unit Test Writer",
    description:
      "Generate a comprehensive unit test suite covering happy paths, edge cases, and error scenarios for any function or module.",
    category: "Testing",
    difficulty: "Standard",
    estimatedLength: "Long",
    tags: ["testing", "unit-tests", "jest", "coverage", "tdd"],
    variables: [
      { key: "language", label: "Language", placeholder: "e.g., TypeScript", type: "text", required: true },
      { key: "test_framework", label: "Test Framework", placeholder: "e.g., Jest, Vitest, pytest, Go test", type: "text", required: true },
      { key: "subject", label: "Function / Module", placeholder: "e.g., calculateDiscount, UserService.create", type: "text", required: true },
      { key: "code", label: "Code to Test", placeholder: "Paste the function, class, or module here…", type: "textarea", required: true },
      { key: "scenarios", label: "Specific Scenarios", placeholder: "e.g., null input, empty array, DB error, async timeout", type: "textarea", required: false, hint: "Optional — the AI will also generate its own test cases" },
    ],
    template: `## Role
You are a senior {{language}} engineer with a strong TDD mindset, experienced in writing thorough, maintainable test suites that catch real bugs.

## Context
- **Language:** {{language}}
- **Test Framework:** {{test_framework}}

## Task
Write a comprehensive unit test suite for: **{{subject}}**

### Code to Test
\`\`\`{{language}}
{{code}}
\`\`\`

### Specific Scenarios to Cover
{{scenarios}}

## Constraints
- Use {{test_framework}} syntax and conventions
- Structure every test with Arrange / Act / Assert (AAA) pattern
- Name tests descriptively: "should [expected result] when [scenario]"
- Test one observable behaviour per test case
- Mock all external dependencies (DB, API calls, filesystem)
- Target full branch coverage: happy path, all edge cases, all error paths
- Do not test implementation details — test observable behaviour only

## Output Format
1. **Test File** — complete, runnable file with all necessary imports
2. **Coverage Summary** — table: scenario | input | expected output
3. **Mocking Strategy** — how external dependencies are handled and why
4. **Missing Coverage** — what additional tests would give 100% confidence`,
  },

  /* 6 ── Code Reviewer ────────────────────────────────────────────── */
  {
    id: "code-review",
    title: "Code Reviewer",
    description:
      "Get a thorough code review covering correctness, security, performance, and maintainability with prioritised, actionable feedback.",
    category: "Code Review",
    difficulty: "Detailed",
    estimatedLength: "Long",
    tags: ["review", "security", "performance", "clean-code"],
    variables: [
      { key: "language", label: "Language", placeholder: "e.g., TypeScript", type: "text", required: true },
      { key: "context", label: "Context", placeholder: "e.g., Express middleware for rate limiting", type: "text", required: true },
      { key: "code", label: "Code to Review", placeholder: "Paste the code here…", type: "textarea", required: true },
      { key: "focus", label: "Review Focus", placeholder: "All", type: "select", options: ["All (security, performance, correctness, style)", "Security & vulnerabilities", "Performance & scalability", "Correctness & logic bugs", "Maintainability & clean code"], required: true },
    ],
    template: `## Role
You are a principal {{language}} engineer conducting a thorough code review with the same rigour you'd apply to a critical production PR.

## Context
{{context}}

## Task
Review the following {{language}} code.

\`\`\`{{language}}
{{code}}
\`\`\`

## Constraints
- Focus area: **{{focus}}**
- Reference exact line numbers or patterns for each finding
- Rate every finding by severity: 🔴 Critical / 🟡 Warning / 🔵 Suggestion
- Do not praise working code — focus entirely on improvements
- If rewriting is warranted, provide the improved code
- Consider: correctness, security (injection, auth, data exposure), performance, error handling, naming, and testability

## Output Format

### Summary
One paragraph overall assessment.

### Findings
For each issue:
- **Severity** — 🔴 Critical / 🟡 Warning / 🔵 Suggestion
- **Issue** — what the problem is
- **Why It Matters** — impact in production
- **Fix** — corrected code or specific recommendation

### Revised Code *(if significant changes needed)*
Complete improved version.

### Quality Scorecard
Rate 1–5: Correctness | Security | Performance | Readability | Testability`,
  },

  /* 7 ── SQL Schema Designer ──────────────────────────────────────── */
  {
    id: "sql-schema",
    title: "SQL Schema Designer",
    description:
      "Design a production-ready database schema with tables, relationships, indexes, and constraints from a plain-language domain description.",
    category: "Database Design",
    difficulty: "Detailed",
    estimatedLength: "Long",
    tags: ["sql", "schema", "database", "postgresql", "indexes"],
    variables: [
      { key: "domain", label: "Domain / Application", placeholder: "e.g., E-commerce platform, Hospital management", type: "text", required: true },
      { key: "entities", label: "Core Entities", placeholder: "e.g., User, Product, Order, Category, Review", type: "text", required: true },
      { key: "relations", label: "Relationships", placeholder: "e.g., User has many Orders, Order has many Products…", type: "textarea", required: true },
      { key: "database", label: "Database", placeholder: "PostgreSQL", type: "select", options: ["PostgreSQL", "MySQL", "SQLite", "SQL Server"], required: true },
      { key: "extras", label: "Special Requirements", placeholder: "e.g., soft deletes, audit trail, multi-tenancy, UUID PKs", type: "textarea", required: false },
    ],
    template: `## Role
You are a database architect with 10+ years designing relational schemas for production systems, with deep expertise in {{database}}.

## Context
- **Domain:** {{domain}}
- **Database:** {{database}}

## Task
Design a complete, production-ready SQL schema.

### Core Entities
{{entities}}

### Relationships
{{relations}}

### Special Requirements
{{extras}}

## Constraints
- Use {{database}}-specific syntax and optimal data types — avoid over-using VARCHAR
- Add NOT NULL constraints where data is always required
- Define foreign keys with explicit ON DELETE / ON UPDATE behaviour
- Include performance indexes on all foreign keys and commonly queried columns
- Use UUID or BIGSERIAL for primary keys — state which and explain why
- Add \`created_at\` and \`updated_at\` audit columns to every table
- Handle: {{extras}}

## Output Format
1. **DDL** — complete CREATE TABLE statements in dependency order (parents before children)
2. **Indexes** — CREATE INDEX statements with a justification comment for each
3. **Relationship Summary** — plain-English description of all FK relationships
4. **Design Decisions** — key choices and why (PK strategy, data types, normalisation level)
5. **Sample Queries** — 3 realistic queries that validate the schema`,
  },

  /* 8 ── Technical Docs Writer ────────────────────────────────────── */
  {
    id: "tech-docs",
    title: "Technical Docs Writer",
    description:
      "Write clear, structured technical documentation for any feature, API, or system tailored to your target audience.",
    category: "Documentation",
    difficulty: "Standard",
    estimatedLength: "Long",
    tags: ["docs", "readme", "api-docs", "technical-writing"],
    variables: [
      { key: "subject", label: "What to Document", placeholder: "e.g., User Authentication API, Redis caching layer", type: "text", required: true },
      { key: "audience", label: "Target Audience", placeholder: "e.g., External API consumers, junior team devs", type: "text", required: true },
      { key: "format", label: "Documentation Format", placeholder: "README.md", type: "select", options: ["README.md", "API Reference", "How-To Guide", "Architecture Decision Record (ADR)", "Runbook"], required: true },
      { key: "topics", label: "Key Topics to Cover", placeholder: "e.g., auth flow, rate limits, error codes, quick start", type: "textarea", required: true },
      { key: "level", label: "Technical Level", placeholder: "Intermediate", type: "select", options: ["Beginner-friendly", "Intermediate", "Expert / Advanced"], required: true },
    ],
    template: `## Role
You are a senior technical writer who has authored documentation for major open-source projects and developer-facing APIs. You write with precision, clarity, and empathy for the reader.

## Context
- **Subject:** {{subject}}
- **Format:** {{format}}
- **Target Audience:** {{audience}}
- **Technical Level:** {{level}}

## Task
Write comprehensive {{format}} documentation for: **{{subject}}**

### Key Topics to Cover
{{topics}}

## Constraints
- Write for **{{audience}}** at a **{{level}}** technical level
- Use clear, active voice — avoid passive constructions and filler phrases ("it should be noted that…")
- Structure content with headings and subheadings for scannability
- Every technical concept must have a code example
- For APIs: always include both request AND response examples
- For guides: list prerequisites at the top
- Anticipate the reader's next question and answer it proactively
- End with a "Common Errors / FAQ" section

## Output Format
Complete {{format}} document in Markdown:
- Title and one-paragraph overview
- Prerequisites (if applicable)
- All sections covering the key topics listed above
- Code blocks with correct language specifiers
- Common Errors / FAQ at the end`,
  },

  /* 9 ── Blog Post Writer ─────────────────────────────────────────── */
  {
    id: "blog-post",
    title: "Blog Post Writer",
    description:
      "Write an engaging, well-structured blog post with a compelling hook, SEO-friendly formatting, and a strong call-to-action.",
    category: "Content Writing",
    difficulty: "Standard",
    estimatedLength: "Long",
    tags: ["blog", "content", "writing", "seo", "technical"],
    variables: [
      { key: "topic", label: "Blog Post Topic", placeholder: "e.g., Why TypeScript strict mode saves hours of debugging", type: "text", required: true },
      { key: "audience", label: "Target Audience", placeholder: "e.g., Mid-level JavaScript developers", type: "text", required: true },
      { key: "tone", label: "Writing Tone", placeholder: "Conversational & friendly", type: "select", options: ["Professional & authoritative", "Conversational & friendly", "Educational & step-by-step", "Opinionated & direct"], required: true },
      { key: "length", label: "Target Word Count", placeholder: "1000–1500 words", type: "select", options: ["500–800 words (quick read)", "1000–1500 words (standard)", "2000–3000 words (in-depth)"], required: true },
      { key: "key_points", label: "Key Points to Cover", placeholder: "List the main ideas or sections you want included…", type: "textarea", required: true },
      { key: "keyword", label: "Primary SEO Keyword", placeholder: "e.g., TypeScript strict mode", type: "text", required: false, hint: "Optional: the main keyword to rank for in search" },
    ],
    template: `## Role
You are an experienced technical content writer who creates engaging, well-researched posts that resonate with developer audiences and rank well in search.

## Context
- **Topic:** {{topic}}
- **Audience:** {{audience}}
- **Tone:** {{tone}}
- **Target Length:** {{length}}
- **Primary SEO Keyword:** {{keyword}}

## Task
Write a compelling blog post on: **{{topic}}**

### Key Points to Cover
{{key_points}}

## Constraints
- Maintain a **{{tone}}** voice consistently throughout
- Target **{{length}}**
- Use the keyword "{{keyword}}" naturally in the title, opening paragraph, and 1–2 subheadings
- Open with a hook that grabs attention in the very first sentence
- Short paragraphs (2–4 lines max) for web readability
- Include at least one concrete example or analogy per main point
- End with a clear takeaway or call-to-action
- Avoid filler openers: "In conclusion", "It's important to note", "In today's world"

## Output Format
Complete blog post in Markdown:
- **Title** (H1) — compelling, keyword-inclusive
- **Introduction** — hook + thesis (no "Introduction" heading)
- **Body sections** (H2/H3) covering all key points
- **Conclusion** — key takeaway + CTA
- **Meta Description** — 150–160 chars for SEO (below the post as a note)`,
  },

  /* 10 ── Landing Page Copywriter ─────────────────────────────────── */
  {
    id: "landing-page",
    title: "Landing Page Copywriter",
    description:
      "Generate high-converting landing page copy with headline, benefits, social proof, FAQ, and CTA sections — ready to hand to a designer.",
    category: "Marketing",
    difficulty: "Detailed",
    estimatedLength: "Long",
    tags: ["marketing", "copywriting", "landing-page", "conversion", "saas"],
    variables: [
      { key: "product", label: "Product / Service Name", placeholder: "e.g., PromptCraft AI", type: "text", required: true },
      { key: "one_liner", label: "One-Line Description", placeholder: "What it does in one sentence…", type: "text", required: true },
      { key: "audience", label: "Target Audience", placeholder: "e.g., Developers building AI products", type: "text", required: true },
      { key: "value_prop", label: "Primary Value Proposition", placeholder: "e.g., Build better AI prompts 10× faster", type: "text", required: true },
      { key: "pain_points", label: "Pain Points You Solve", placeholder: "e.g., Wasting hours writing inconsistent prompts, poor AI output quality", type: "textarea", required: true },
      { key: "tone", label: "Brand Tone", placeholder: "Professional & trustworthy", type: "select", options: ["Professional & trustworthy", "Bold & energetic", "Friendly & approachable", "Minimalist & technical"], required: true },
      { key: "cta", label: "Call-to-Action", placeholder: "e.g., Start for free, Book a demo", type: "text", required: true },
    ],
    template: `## Role
You are a world-class conversion copywriter who has written landing pages for leading SaaS products, combining persuasion psychology with clarity and specificity.

## Context
- **Product:** {{product}} — {{one_liner}}
- **Audience:** {{audience}}
- **Brand Tone:** {{tone}}
- **CTA Goal:** {{cta}}

## Task
Write complete landing page copy for **{{product}}**.

### Primary Value Proposition
{{value_prop}}

### Pain Points to Address
{{pain_points}}

## Constraints
- Write in a **{{tone}}** voice throughout — never break the tone
- Every sentence must earn its place — zero filler, zero fluff
- Lead with benefits, not features
- Use the audience's own language — write directly to **{{audience}}**
- The hero section must communicate value within 5 seconds of reading
- Build all surrounding copy toward the CTA: **{{cta}}**

## Output Format
**1. Hero Section**
Headline (H1) | Subheadline | CTA button text + micro-copy

**2. Problem Section**
3–4 sentence pain hook

**3. Solution Section**
How {{product}} solves the problem

**4. Features → Benefits (4–5 items)**
Feature name + one-line benefit translation

**5. Social Proof**
3 realistic testimonials with name and job title

**6. FAQ (3 questions)**
Most common objections + answers

**7. Final CTA Section**
Closing headline + {{cta}}

---
*Provide 3 alternative headline variants at the end.*`,
  },

  /* 11 ── Code Refactoring Guide ───────────────────────────────────── */
  {
    id: "code-refactor",
    title: "Code Refactoring Guide",
    description:
      "Refactor messy or legacy code into clean, maintainable, well-structured code without changing external behaviour.",
    category: "Code Review",
    difficulty: "Standard",
    estimatedLength: "Medium",
    tags: ["refactor", "clean-code", "solid", "maintainability"],
    variables: [
      { key: "language", label: "Language", placeholder: "e.g., TypeScript", type: "text", required: true },
      { key: "code", label: "Code to Refactor", placeholder: "Paste the code that needs refactoring…", type: "textarea", required: true },
      { key: "goal", label: "Refactoring Goal", placeholder: "Improve readability & naming", type: "select", options: ["Improve readability & naming", "Reduce complexity & nesting", "Apply SOLID principles", "Extract reusable functions / modules", "Improve performance"], required: true },
      { key: "limits", label: "Constraints", placeholder: "e.g., must keep the public API identical, no new deps", type: "textarea", required: false },
    ],
    template: `## Role
You are a principal software engineer who specialises in code quality, clean code principles, and systematic refactoring of production codebases.

## Context
- **Language:** {{language}}
- **Refactoring Goal:** {{goal}}

## Task
Refactor the following {{language}} code.

### Original Code
\`\`\`{{language}}
{{code}}
\`\`\`

### Constraints
{{limits}}

## Constraints
- Preserve the exact same external behaviour — refactoring must not change functionality
- Focus on: **{{goal}}**
- Apply clean code principles: single responsibility, meaningful names, small functions
- Do not add new features — only improve structure and clarity
- {{limits}}

## Output Format
1. **Refactored Code** — complete improved version with the same public API
2. **What Changed** — bullet list of specific changes and which principle each addresses
3. **Before vs After** — highlight 2–3 key transformations side-by-side
4. **Next Steps** — what you would tackle next if given more time`,
  },

  /* 12 ── Algorithm Explainer ─────────────────────────────────────── */
  {
    id: "algorithm-explainer",
    title: "Algorithm Explainer",
    description:
      "Get an intuitive, level-appropriate explanation of any algorithm or data structure with analogies, complexity analysis, and working code.",
    category: "Code Generation",
    difficulty: "Quick",
    estimatedLength: "Medium",
    tags: ["algorithms", "data-structures", "learning", "complexity"],
    variables: [
      { key: "algorithm", label: "Algorithm / Data Structure", placeholder: "e.g., Binary Search, Dijkstra, LRU Cache", type: "text", required: true },
      { key: "level", label: "Your Current Level", placeholder: "Junior developer", type: "select", options: ["Complete beginner", "Junior developer", "Mid-level developer", "Senior / just need a refresher"], required: true },
      { key: "language", label: "Code Example Language", placeholder: "e.g., TypeScript, Python", type: "text", required: true },
      { key: "use_case", label: "Your Use Case (optional)", placeholder: "e.g., system design interview, cache implementation", type: "text", required: false, hint: "Helps tailor the explanation to your actual goal" },
    ],
    template: `## Role
You are a CS educator who excels at breaking down complex algorithms into intuitive, memorable explanations using analogies and concrete examples — regardless of the learner's level.

## Context
- **Algorithm / Structure:** {{algorithm}}
- **Learner Level:** {{level}}
- **Code Language:** {{language}}
- **Use Case:** {{use_case}}

## Task
Explain **{{algorithm}}** clearly and thoroughly to someone at the **{{level}}** level.

## Constraints
- Start with an intuitive real-world analogy before any technical detail
- Build up from the simplest case to the full algorithm step-by-step
- Use concrete examples with actual values (not abstract placeholders like "n" or "x")
- Provide working {{language}} code that is well-commented
- Include time and space complexity with a plain-English explanation of *why*
- Tailor depth and vocabulary to **{{level}}** — don't condescend, don't overwhelm
- Connect the explanation to: **{{use_case}}** where relevant

## Output Format
1. **The Core Idea** — one-paragraph intuition with a real-world analogy
2. **Step-by-Step Walkthrough** — trace through a small example with actual values
3. **{{language}} Implementation** — clean, commented, runnable code
4. **Complexity Analysis** — time and space, with an explanation of *why*
5. **When to Use It** — practical scenarios and trade-offs vs alternatives
6. **Common Mistakes** — pitfalls beginners frequently encounter`,
  },
]
