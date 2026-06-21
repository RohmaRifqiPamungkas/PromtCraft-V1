import { uid } from "../shared/uid"
import type { BusinessFlowData, FlowActor, FlowStep } from "@/lib/business-flow-compiler"

export { type FlowActor, type FlowStep }

export const FLOW_CATEGORIES = [
  "Authentication", "E-commerce", "Content Management",
  "SaaS / Subscription", "Payment Processing", "Notification",
  "Data Pipeline", "Reporting / Analytics", "Custom",
]

export const FLOW_OUTPUT_GOALS = [
  { label: "Full Backend Design", value: "Based on this flow, design the complete backend: database schema, API endpoints, business logic, error handling, and security." },
  { label: "Database Schema Only", value: "Based on this flow, design the optimal database schema with table structures, indexes, and relationships." },
  { label: "API Endpoints Only", value: "Based on this flow, define all REST API endpoints: method, path, request body, response shape, and auth requirements." },
  { label: "System Architecture", value: "Based on this flow, propose the system architecture including services, message queues, caching strategy, and deployment topology." },
]

type FlowTemplateStep = Omit<FlowStep, "id" | "actorId"> & { actorIndex: number }
export interface FlowTemplate {
  id: string
  name: string
  category: string
  description: string
  actors: Omit<FlowActor, "id">[]
  steps: FlowTemplateStep[]
}

export const FLOW_TEMPLATES: FlowTemplate[] = [
  {
    id: "user-auth", name: "User Authentication", category: "Authentication",
    description: "Standard registration, email verification, and login flow with JWT session management.",
    actors: [
      { name: "User", role: "End user performing authentication" },
      { name: "Auth Service", role: "Validates credentials and issues tokens" },
      { name: "Database", role: "Stores user records, hashed passwords, sessions" },
    ],
    steps: [
      { actorIndex: 0, name: "Register", action: "Submit registration form", inputData: "email, password, display name", outputData: "Account created, verification email sent", notes: "Validate email uniqueness before inserting" },
      { actorIndex: 1, name: "Verify Email", action: "Send one-time verification token", inputData: "User email address", outputData: "Verification link via email", notes: "Token expires after 24 hours" },
      { actorIndex: 0, name: "Login", action: "Submit credentials", inputData: "email, password", outputData: "JWT access token + refresh token", notes: "Rate-limit to 5 attempts per minute" },
      { actorIndex: 1, name: "Refresh Token", action: "Exchange refresh token for new access token", inputData: "Refresh token", outputData: "New access token", notes: "Rotate refresh token on each use" },
    ],
  },
  {
    id: "ecommerce-order", name: "E-commerce Order", category: "E-commerce",
    description: "End-to-end online order flow from cart checkout through fulfillment and delivery.",
    actors: [
      { name: "Customer", role: "Shopper placing the order" },
      { name: "Order Service", role: "Orchestrates order lifecycle" },
      { name: "Payment Gateway", role: "Processes card / wallet payments" },
      { name: "Inventory Service", role: "Manages stock and reservations" },
      { name: "Fulfillment", role: "Picks, packs, and ships orders" },
    ],
    steps: [
      { actorIndex: 0, name: "Add to Cart", action: "Select product and quantity", inputData: "product_id, quantity", outputData: "Updated cart state", notes: "Check soft stock availability" },
      { actorIndex: 0, name: "Checkout", action: "Confirm address and payment method", inputData: "shipping address, payment details", outputData: "Order preview with total", notes: "" },
      { actorIndex: 2, name: "Charge Payment", action: "Authorize and capture payment", inputData: "Amount, card token", outputData: "Payment confirmation ID", notes: "Use idempotency key to prevent double-charge" },
      { actorIndex: 1, name: "Reserve Inventory", action: "Hard-reserve ordered items", inputData: "product_id, quantity", outputData: "Reservation ID", notes: "Roll back if payment fails" },
      { actorIndex: 4, name: "Fulfill Order", action: "Pick, pack, and dispatch", inputData: "Order details, shipping label", outputData: "Tracking number", notes: "" },
      { actorIndex: 0, name: "Delivery Confirmation", action: "Receive delivery notification", inputData: "Tracking event", outputData: "Order marked delivered", notes: "Trigger review request email" },
    ],
  },
  {
    id: "saas-onboarding", name: "SaaS Onboarding", category: "SaaS / Subscription",
    description: "New team onboarding: sign-up → workspace setup → invite team → billing plan selection.",
    actors: [
      { name: "Admin User", role: "Account owner who starts the trial" },
      { name: "Onboarding Service", role: "Guides setup steps" },
      { name: "Billing Service", role: "Manages plans and subscriptions" },
      { name: "Email Service", role: "Sends transactional emails" },
    ],
    steps: [
      { actorIndex: 0, name: "Sign Up", action: "Create account with email or OAuth", inputData: "email / OAuth token", outputData: "Account created, workspace slug chosen", notes: "" },
      { actorIndex: 1, name: "Setup Workspace", action: "Configure workspace name, logo, timezone", inputData: "Workspace preferences", outputData: "Workspace record saved", notes: "Defaults applied for skipped fields" },
      { actorIndex: 0, name: "Invite Team", action: "Send invites to teammates", inputData: "Email addresses, role assignments", outputData: "Invitation emails dispatched", notes: "Pending invites expire after 7 days" },
      { actorIndex: 2, name: "Select Plan", action: "Choose subscription tier", inputData: "Plan ID, billing cycle", outputData: "Trial or paid subscription activated", notes: "Default 14-day trial on any paid plan" },
    ],
  },
]

export function blankFlow(): BusinessFlowData {
  return {
    name: "", description: "", category: "",
    actors: [{ id: uid(), name: "", role: "" }],
    steps: [{ id: uid(), name: "", actorId: "", action: "", inputData: "", outputData: "", notes: "" }],
    outputGoal: "",
  }
}

export function applyFlowTemplate(t: FlowTemplate): BusinessFlowData {
  const actors: FlowActor[] = t.actors.map((a) => ({ id: uid(), name: a.name, role: a.role }))
  const steps: FlowStep[] = t.steps.map((s) => ({
    id: uid(), name: s.name, actorId: actors[s.actorIndex]?.id ?? "",
    action: s.action, inputData: s.inputData, outputData: s.outputData, notes: s.notes,
  }))
  return { name: t.name, description: t.description, category: t.category, actors, steps, outputGoal: "" }
}
