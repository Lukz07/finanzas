import AnimatedBackground from "@/components/animated-background";
import WelcomePage from "@/components/welcom-page";
import { MainNav } from "@/components/layout/main-nav";

export default function InvestmentPlannerPage() {
  return (
    <main className="min-h-screen overflow-auto w-full bg-transparent">
      <AnimatedBackground />
      <MainNav />
      <div className="w-full py-8">
        <WelcomePage config={{
          baseTargetAmount: 100000,
          monthlyContribution: 100000,
        }}/>
      </div>
    </main>
  )
} 