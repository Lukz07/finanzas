import AnimatedBackground from "@/components/animated-background";
import WelcomePage from "@/components/welcom-page";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  return (
    <main className="min-h-screen overflow-auto w-full bg-transparent">
      <AnimatedBackground />
      <div className="absolute right-4 top-4 z-10">
        <ThemeToggle />
      </div>
      <WelcomePage config={{
        baseTargetAmount: 100000,
        monthlyContribution: 100000,
      }}/>
    </main>
  )
}
