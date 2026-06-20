export interface TechStack {
  frontend: string
  backend: string
  primaryDb: string
  cache: string
  queue: string
  auth: string
  storage: string
  deployment: string
  monitoring: string
}

export interface ArchService {
  id: string
  name: string
  responsibility: string
  technology: string
  communicatesWith: string
  notes: string
}

export interface ArchNFR {
  targetScale: string
  availability: string
  latencyTarget: string
  dataRetention: string
  compliance: string
}

export interface ArchitectureData {
  name: string
  description: string
  pattern: string
  stack: TechStack
  services: ArchService[]
  nfr: ArchNFR
  outputGoal: string
}

export function compileArchitecture(data: ArchitectureData): string {
  const hasContent =
    data.name ||
    data.description ||
    data.pattern ||
    Object.values(data.stack).some(Boolean) ||
    data.services.some((s) => s.name || s.responsibility)

  if (!hasContent) return ""

  const s: string[] = []

  s.push(`# System Architecture: ${data.name || "[System Name]"}`)
  if (data.pattern) s.push(`**Pattern:** ${data.pattern}`)
  if (data.nfr.targetScale) s.push(`**Scale Target:** ${data.nfr.targetScale}`)
  s.push("")

  if (data.description) {
    s.push("## Overview")
    s.push(data.description)
    s.push("")
  }

  const stackEntries = [
    ["Frontend",        data.stack.frontend],
    ["Backend",         data.stack.backend],
    ["Primary Database",data.stack.primaryDb],
    ["Cache",           data.stack.cache],
    ["Message Queue",   data.stack.queue],
    ["Authentication",  data.stack.auth],
    ["File Storage",    data.stack.storage],
    ["Deployment",      data.stack.deployment],
    ["Monitoring",      data.stack.monitoring],
  ].filter(([, v]) => v)

  if (stackEntries.length > 0) {
    s.push("## Tech Stack")
    for (const [label, value] of stackEntries) {
      s.push(`- **${label}:** ${value}`)
    }
    s.push("")
  }

  const namedServices = data.services.filter((svc) => svc.name || svc.responsibility)
  if (namedServices.length > 0) {
    s.push("## Services / Components")
    s.push("")
    for (const svc of namedServices) {
      s.push(`### ${svc.name || "[Service Name]"}`)
      if (svc.responsibility)     s.push(`**Responsibility:** ${svc.responsibility}`)
      if (svc.technology)         s.push(`**Technology:** ${svc.technology}`)
      if (svc.communicatesWith)   s.push(`**Communicates with:** ${svc.communicatesWith}`)
      if (svc.notes)              s.push(`**Notes:** ${svc.notes}`)
      s.push("")
    }
  }

  const nfrEntries = [
    ["Availability SLA",   data.nfr.availability],
    ["Latency Target",     data.nfr.latencyTarget],
    ["Data Retention",     data.nfr.dataRetention],
    ["Compliance",         data.nfr.compliance],
  ].filter(([, v]) => v)

  if (data.nfr.targetScale || nfrEntries.length > 0) {
    s.push("## Non-Functional Requirements")
    if (data.nfr.targetScale) s.push(`- **Target Scale:** ${data.nfr.targetScale}`)
    for (const [label, value] of nfrEntries) {
      s.push(`- **${label}:** ${value}`)
    }
    s.push("")
  }

  s.push("## Implementation Request")
  s.push("")

  if (data.outputGoal.trim()) {
    s.push(data.outputGoal.trim())
  } else {
    s.push(
      "Based on the system architecture defined above, please help me with the following:",
    )
    s.push("")
    s.push("1. **Architecture Review** — Identify bottlenecks, single points of failure, and scalability concerns")
    s.push("2. **Service Contracts** — Define API contracts, event schemas, and data formats between services")
    s.push("3. **Database Design** — Schema, indexing strategy, and data partitioning approach")
    s.push("4. **Infrastructure Setup** — IaC skeleton (Docker Compose / Kubernetes / Terraform) for the stack")
    s.push("5. **Observability** — Logging, tracing, and alerting strategy across all services")
    s.push("6. **Security** — Network policies, secrets management, and least-privilege access design")
  }

  return s.join("\n")
}
