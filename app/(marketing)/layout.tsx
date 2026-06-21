import { InteractiveBackground } from "./_components/InteractiveBackground"

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <InteractiveBackground />
      {children}
    </>
  )
}
