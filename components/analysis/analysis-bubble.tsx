import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { NewsAnalysis } from "@/lib/types/news-analysis";

interface AnalysisBubbleProps {
  analysis: NewsAnalysis;
  onClose: () => void;
}

export function AnalysisBubble({ analysis, onClose }: AnalysisBubbleProps) {
  return (
    <div className="fixed bottom-24 right-4 z-50 w-96 rounded-lg bg-white p-4 shadow-lg dark:bg-primary">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={`/avatars/${analysis.analystType}-analyst.png`}
              alt={analysis.analystType === "financial" ? "Analista Financiero" : "Analista Económico"}
            />
            <AvatarFallback>
              {analysis.analystType === "financial" ? "AF" : "AE"}
            </AvatarFallback>
          </Avatar>
          <span className="font-medium">
            {analysis.analystType === "financial" ? "Analista Financiero" : "Analista Económico"}
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={onClose}
          aria-label="Cerrar análisis"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="space-y-2">
        <div>
          <h3 className="text-sm font-medium text-gray-500">Análisis</h3>
          <p className="text-sm">{analysis.analysis}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">Recomendación</h3>
          <p className="text-sm">{analysis.recommendation}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">Impacto</h3>
          <p className="text-sm">{analysis.impact}</p>
        </div>
      </div>
    </div>
  );
} 