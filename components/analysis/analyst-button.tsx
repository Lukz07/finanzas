import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { AnalystType } from "@/lib/types/news-analysis";

interface AnalystButtonProps {
  type: AnalystType;
  onClick: () => void;
  isActive?: boolean;
}

const analystConfig = {
  financial: {
    name: "Analista Financiero",
    avatar: "/avatars/financial-analyst.png",
    fallback: "AF",
  },
  economic: {
    name: "Analista Económico",
    avatar: "/avatars/economic-analyst.png",
    fallback: "AE",
  },
};

export function AnalystButton({ type, onClick, isActive }: AnalystButtonProps) {
  const config = analystConfig[type];

  return (
    <div className="flex flex-col items-center gap-1">
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "h-16 w-16 rounded-full p-0 transition-all",
          isActive && "ring-2 ring-offset-2 hover:bg-finance-blue"
        )}
        onClick={onClick}
        aria-label={`Ver análisis del ${config.name}`}
      >
        <Avatar className="h-full w-full">
          <AvatarImage src={config.avatar} alt={config.name} />
          <AvatarFallback>{config.fallback}</AvatarFallback>
        </Avatar>
      </Button>
      <span
        className="text-xs font-medium text-white bg-gray-700 dark:bg-gray-600 dark:text-gray-200 rounded-full px-2 py-0.5"
      >
        {config.name}
      </span>
    </div>
  );
} 