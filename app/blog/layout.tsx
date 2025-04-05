import { MainNav } from "@/components/layout/main-nav";
import AnimatedBackground from "@/components/animated-background";

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen overflow-auto w-full bg-transparent">
      <AnimatedBackground />
      <MainNav />
      {children}
    </div>
  );
} 