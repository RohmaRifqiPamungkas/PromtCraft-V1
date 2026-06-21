import { InteractiveBackground } from "../(marketing)/_components/InteractiveBackground";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <InteractiveBackground />
      {children}
    </>
  )
}
