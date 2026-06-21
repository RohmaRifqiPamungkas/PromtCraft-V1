import type { Metadata } from "next"
import { Nav } from "@/components/shared/Nav"
import { HeroSection } from "./_components/HeroSection"
import { ProblemSection } from "./_components/ProblemSection"
import { SolutionSection } from "./_components/SolutionSection"
import { FeaturesSection } from "./_components/FeaturesSection"
import { HowItWorksSection } from "./_components/HowItWorksSection"
import { BenefitsSection } from "./_components/BenefitsSection"
import { ComparisonSection } from "./_components/ComparisonSection"
import { CTASection } from "./_components/CTASection"
import { Footer } from "@/components/shared/Footer"

export const metadata: Metadata = {
  title: "PromptCraft AI | Prompt Engineering Toolkit",
  description:
    "Transform ideas, architecture, and errors into production-ready AI prompts. One platform for system design, business flow, code analysis, and structured prompt engineering.",
}

export default function LandingPage() {
  return (
    <div className="relative z-10 h-screen overflow-y-auto text-on-surface">
      <Nav />
      <main>
        <HeroSection />
        <ProblemSection />
        <SolutionSection />
        <FeaturesSection />
        <HowItWorksSection />
        <BenefitsSection />
        <ComparisonSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
