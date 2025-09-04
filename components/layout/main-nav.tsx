"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calculator, Newspaper, Menu, LineChart, TrendingUp, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useNewAnalysis } from "@/lib/hooks/use-new-analysis";

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  {
    title: "Guías Financieras",
    href: "/guias",
    icon: BookOpen,
  },
  {
    title: "Planificador de Inversiones",
    href: "/tools/investment-planner",
    icon: Calculator,
  },
  {
    title: "Heatmaps de Acciones",
    href: "/tools/stocks-heatmap",
    icon: TrendingUp,
  },
  {
    title: "Análisis",
    href: "/analysis",
    icon: LineChart,
  },
];

export function MainNav() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { hasNewAnalysis, markAsRead } = useNewAnalysis();

  // Marcar como leído cuando se visita la página de análisis
  useEffect(() => {
    if (pathname === '/analysis') {
      markAsRead();
    }
  }, [pathname, markAsRead]);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 flex h-14 items-center max-w-[2000px]">
        <Link href="/" className="mr-4 flex items-center space-x-2">
          <h1 className="text-lg font-semibold tracking-tight md:text-xl">Finanzas</h1>
        </Link>

        {/* Navegación para pantallas medianas y grandes */}
        <nav className="hidden md:flex md:flex-1 md:items-center md:gap-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent relative",
                pathname === item.href
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <item.icon className="mr-2 h-4 w-4" />
              {item.title}
              {item.href === '/analysis' && hasNewAnalysis && (
                <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-finance-green-500 animate-pulse" />
              )}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4 ml-auto">
          <ThemeToggle />
          
          {/* Menú móvil */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[80vw] sm:w-[350px]">
              <nav className="flex flex-col space-y-4">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent relative",
                      pathname === item.href
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.title}
                    {item.href === '/analysis' && hasNewAnalysis && (
                      <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-finance-green-500 animate-pulse" />
                    )}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
} 