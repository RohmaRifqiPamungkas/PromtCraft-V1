import type { WizardFormData } from "@/types/prompt"

const frameworkLabels: Record<string, string> = {
  "node-express":  "Node.js / Express (TypeScript)",
  "go-gin":        "Go / Gin",
  "python-fastapi":"Python / FastAPI",
  "spring-boot":   "Spring Boot (Java)",
  "dotnet":        ".NET Core (C#)",
}

const databaseLabels: Record<string, string> = {
  postgresql: "PostgreSQL",
  mysql:      "MySQL",
  mongodb:    "MongoDB",
  sqlite:     "SQLite",
}

const apiStyleLabels: Record<string, string> = {
  rest:    "RESTful API",
  graphql: "GraphQL API",
  grpc:    "gRPC",
}

export function compilePrompt(data: WizardFormData): string {
  const framework = frameworkLabels[data.framework] ?? data.framework
  const database  = databaseLabels[data.database]   ?? data.database
  const apiStyle  = apiStyleLabels[data.apiStyle]   ?? data.apiStyle

  const entityList = data.entities.trim()
    ? data.entities
        .split(/[,\n]+/)
        .map((e) => e.trim())
        .filter(Boolean)
        .map((e) => `- ${e}`)
        .join("\n")
    : "- [No entities defined yet — add them in Step 1]"

  const inclusions: string[] = []
  if (data.includeSqlDdl)      inclusions.push("SQL DDL (CREATE TABLE statements)")
  if (data.repositoryPattern)  inclusions.push("Repository Pattern (abstract data-access layer)")

  const constraints: string[] = []
  if (data.typescriptStrict)   constraints.push("Use TypeScript strictly")
  if (data.solidPrinciples)    constraints.push("Follow SOLID principles")
  if (data.includeIndexes)     constraints.push("Include necessary indexes for performance optimization")
  if (data.unitTestBoilerplate)constraints.push("Provide Unit Test Boilerplate")

  const s: string[] = []

  s.push("# Context")
  s.push(`I am designing a scalable backend for a **${data.projectType}**.`)
  s.push("")
  s.push("# Objective")
  s.push(
    `Generate a normalized **${database}** schema and **${framework}** ${apiStyle} patterns based on the following entities:`
  )
  s.push("")
  s.push("Entities:")
  s.push(entityList)
  s.push("")
  s.push("# Tech Stack")
  s.push(`- **Framework**: ${framework}`)
  s.push(`- **Database**: ${database}`)
  s.push(`- **API Style**: ${apiStyle}`)

  if (inclusions.length > 0) {
    s.push("")
    s.push("# Inclusions")
    inclusions.forEach((i) => s.push(`- ${i}`))
  }

  if (constraints.length > 0) {
    s.push("")
    s.push("# Constraints")
    constraints.forEach((c) => s.push(`- ${c}`))
  }

  s.push("")
  s.push("# Output Format")
  const lang =
    data.framework === "node-express" || data.framework === "dotnet"
      ? "TypeScript"
      : data.framework === "spring-boot"
      ? "Java"
      : data.framework === "python-fastapi"
      ? "Python"
      : data.framework === "go-gin"
      ? "Go"
      : "typed"
  s.push(
    `Please format the response with clear headings, SQL code blocks, and ${lang} code blocks.`
  )

  return s.join("\n")
}
