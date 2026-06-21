import { uid } from "../shared/uid"
import type { ArchitectureData, ArchService, TechStack, ArchNFR } from "@/lib/architecture-compiler"

export { type ArchService, type TechStack, type ArchNFR }

export const ARCH_PATTERNS = [
  "Monolith", "Microservices", "Serverless / FaaS", "Event-Driven",
  "Layered (N-Tier)", "Hexagonal / Clean Architecture", "CQRS + Event Sourcing", "BFF (Backend for Frontend)",
]

export const STACK_FIELDS: { key: keyof TechStack; label: string; placeholder: string }[] = [
  { key: "frontend", label: "Frontend", placeholder: "e.g. Next.js, React, Vue" },
  { key: "backend", label: "Backend", placeholder: "e.g. NestJS, FastAPI, Go Fiber" },
  { key: "primaryDb", label: "Primary Database", placeholder: "e.g. PostgreSQL, MongoDB, DynamoDB" },
  { key: "cache", label: "Cache", placeholder: "e.g. Redis, Memcached" },
  { key: "queue", label: "Message Queue", placeholder: "e.g. RabbitMQ, Kafka, SQS" },
  { key: "auth", label: "Authentication", placeholder: "e.g. Supabase Auth, Auth0, Keycloak" },
  { key: "storage", label: "File Storage", placeholder: "e.g. S3, GCS, Supabase Storage" },
  { key: "deployment", label: "Deployment", placeholder: "e.g. Docker + K8s, Vercel, AWS ECS" },
  { key: "monitoring", label: "Monitoring", placeholder: "e.g. Grafana + Prometheus, Datadog" },
]

export const ARCH_OUTPUT_GOALS = [
  { label: "Full Architecture Review", value: "Review this architecture for bottlenecks, SPOFs, scalability, and security gaps. Suggest improvements with justification." },
  { label: "IaC Skeleton", value: "Generate an Infrastructure as Code skeleton (Docker Compose or Kubernetes manifests) that wires up all the services and dependencies defined above." },
  { label: "Service Contracts", value: "Define the API contracts, event schemas, and data formats between all services. Include request/response shapes and event payload structures." },
  { label: "Observability Plan", value: "Design a complete observability strategy: what to log, what metrics to collect, distributed tracing setup, and alerting thresholds for this system." },
]

export interface ArchTemplate {
  id: string
  name: string
  description: string
  pattern: string
  stack: TechStack
  services: Omit<ArchService, "id">[]
  nfr: ArchNFR
}

export const ARCH_TEMPLATES: ArchTemplate[] = [
  {
    id: "saas-webapp", name: "SaaS Web App",
    description: "Full-stack SaaS platform with server-side rendering, REST API, relational database, and background job processing.",
    pattern: "Monolith",
    stack: { frontend: "Next.js (App Router)", backend: "NestJS (Node.js)", primaryDb: "PostgreSQL", cache: "Redis", queue: "BullMQ (via Redis)", auth: "Supabase Auth / JWT", storage: "Supabase Storage / S3", deployment: "Docker + Railway / Render", monitoring: "Grafana + Loki" },
    services: [
      { name: "Web App", responsibility: "SSR frontend and BFF layer for client pages", technology: "Next.js", communicatesWith: "API Server", notes: "Uses server components for data fetching" },
      { name: "API Server", responsibility: "Core business logic, REST endpoints, auth validation", technology: "NestJS", communicatesWith: "PostgreSQL, Redis, Queue Worker", notes: "Guards for role-based access" },
      { name: "Queue Worker", responsibility: "Process background jobs: emails, webhooks, report generation", technology: "BullMQ", communicatesWith: "Redis, External Email API", notes: "Retry with exponential backoff" },
    ],
    nfr: { targetScale: "Up to 10,000 MAU, ~50 RPS peak", availability: "99.9% uptime SLA", latencyTarget: "p95 < 200ms for API", dataRetention: "User data retained indefinitely; logs 30 days", compliance: "GDPR — user data deletion on request" },
  },
  {
    id: "microservices", name: "Microservices Platform",
    description: "Distributed microservices system with an API gateway, async event bus, and independent service deployments.",
    pattern: "Microservices",
    stack: { frontend: "React (Vite)", backend: "Go + Node.js (per service)", primaryDb: "PostgreSQL (per service)", cache: "Redis", queue: "Apache Kafka", auth: "Keycloak (OIDC)", storage: "AWS S3", deployment: "Kubernetes (Helm charts)", monitoring: "Prometheus + Grafana + Jaeger" },
    services: [
      { name: "API Gateway", responsibility: "Rate limiting, auth validation, request routing to services", technology: "Kong / NGINX", communicatesWith: "All internal services", notes: "JWT verification, circuit breaker" },
      { name: "User Service", responsibility: "User profiles, preferences, account management", technology: "Go", communicatesWith: "PostgreSQL, Kafka", notes: "Publishes user.created / user.updated events" },
      { name: "Order Service", responsibility: "Order lifecycle: create, update, cancel", technology: "Node.js + NestJS", communicatesWith: "PostgreSQL, Kafka, Inventory Service", notes: "Saga pattern for distributed transactions" },
      { name: "Inventory Service", responsibility: "Product stock tracking, reservations", technology: "Go", communicatesWith: "PostgreSQL, Kafka", notes: "Optimistic locking on stock updates" },
      { name: "Notification Service", responsibility: "Email, push, and in-app notifications", technology: "Node.js", communicatesWith: "Kafka, Email/Push providers", notes: "Consumes domain events, idempotent delivery" },
    ],
    nfr: { targetScale: "500,000 MAU, 2,000 RPS peak", availability: "99.95% per service", latencyTarget: "p99 < 500ms end-to-end", dataRetention: "Transactional data 7 years; events 90 days", compliance: "PCI DSS for payment data; SOC 2 Type II" },
  },
  {
    id: "serverless-api", name: "Serverless API",
    description: "Event-driven serverless backend on AWS: Lambda functions, DynamoDB, and API Gateway with pay-per-use scaling.",
    pattern: "Serverless / FaaS",
    stack: { frontend: "React (hosted on CloudFront + S3)", backend: "AWS Lambda (Node.js / Python)", primaryDb: "DynamoDB", cache: "DynamoDB DAX / ElastiCache", queue: "AWS SQS + SNS", auth: "AWS Cognito", storage: "AWS S3", deployment: "AWS CDK / Serverless Framework", monitoring: "AWS CloudWatch + X-Ray" },
    services: [
      { name: "REST Handler Lambdas", responsibility: "Handle HTTP requests via API Gateway triggers", technology: "Node.js Lambda", communicatesWith: "DynamoDB, SQS", notes: "Provisioned concurrency for hot paths" },
      { name: "Event Processor", responsibility: "Process async jobs from SQS queues", technology: "Python Lambda", communicatesWith: "DynamoDB, S3, SNS", notes: "DLQ for failed messages" },
      { name: "Auth Authorizer", responsibility: "Custom Lambda authorizer for JWT validation", technology: "Node.js Lambda", communicatesWith: "Cognito", notes: "Cache auth result for 5 min" },
    ],
    nfr: { targetScale: "Variable — auto-scales to millions of invocations", availability: "Managed by AWS (99.99%)", latencyTarget: "Cold start < 1s; warm p95 < 100ms", dataRetention: "DynamoDB TTL for session data; S3 lifecycle policies", compliance: "SOC 2 — all data in single AWS region" },
  },
]

const BLANK_STACK: TechStack = { frontend: "", backend: "", primaryDb: "", cache: "", queue: "", auth: "", storage: "", deployment: "", monitoring: "" }
const BLANK_NFR: ArchNFR = { targetScale: "", availability: "", latencyTarget: "", dataRetention: "", compliance: "" }

export function blankArch(): ArchitectureData {
  return {
    name: "", description: "", pattern: "",
    stack: { ...BLANK_STACK },
    services: [{ id: uid(), name: "", responsibility: "", technology: "", communicatesWith: "", notes: "" }],
    nfr: { ...BLANK_NFR },
    outputGoal: "",
  }
}

export function applyArchTemplate(t: ArchTemplate): ArchitectureData {
  return {
    name: t.name, description: t.description, pattern: t.pattern,
    stack: { ...t.stack },
    services: t.services.map((svc) => ({ id: uid(), ...svc })),
    nfr: { ...t.nfr },
    outputGoal: "",
  }
}
