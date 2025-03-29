import AnimatedBackground from "@/components/animated-background";
import WelcomePage from "@/components/welcom-page";

export default function Home() {
  return (
    <main className="min-h-screen overflow-auto w-full bg-transparent">
      <AnimatedBackground />
      <WelcomePage config={{
        baseTargetAmount: 100000,
        monthlyContribution: 1000,
      }}/>
    </main>
  )
}
