'use client';

import { useState, useEffect } from "react";
import { AnalystType } from "@/lib/types/news-analysis";
import { NewsAnalysis } from "@/lib/types/news-analysis";
import { AnalystButton } from "./analyst-button";
import { AnalysisBubble } from "./analysis-bubble";
import { Loader2 } from "lucide-react";

export function AnalysisContainer() {
  const [selectedAnalyst, setSelectedAnalyst] = useState<AnalystType | null>(null);
  const [analysis, setAnalysis] = useState<NewsAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Verificar análisis disponibles al montar el componente
  useEffect(() => {
    const initializeAnalyses = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/analysis/init', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (!response.ok) {
          throw new Error('Error al inicializar los análisis');
        }

        const data = await response.json();
        console.log('✅ Análisis disponibles:', data);
      } catch (error) {
        console.error('❌ Error al inicializar análisis:', error);
        setError('Error al inicializar los análisis');
      } finally {
        setIsLoading(false);
      }
    };

    initializeAnalyses();
  }, []);

  const handleAnalystClick = async (type: AnalystType) => {
    try {
      setIsLoading(true);
      setError(null);
      setSelectedAnalyst(type);

      // Obtener el análisis de la caché
      const analysisResponse = await fetch(`/api/analysis?type=${type}`);
      console.log('📝 Análisis obtenido:', analysisResponse);
      if (!analysisResponse.ok) {
        throw new Error('Error al obtener el análisis');
      }

      const analysisData = await analysisResponse.json();
      console.log('📝 Análisis obtenido:', analysisData);

      if (!analysisData) {
        throw new Error('No se encontró el análisis');
      }

      setAnalysis(analysisData);
    } catch (error) {
      console.error('❌ Error:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 flex flex-col gap-4">
      <div className="flex flex-col">
        <AnalystButton
          type="financial"
          isActive={selectedAnalyst === 'financial'}
          onClick={() => handleAnalystClick('financial')}
        />
        <AnalystButton
          type="economic"
          isActive={selectedAnalyst === 'economic'}
          onClick={() => handleAnalystClick('economic')}
        />
      </div>
      {analysis && (
        <AnalysisBubble
          analysis={analysis}
          onClose={() => {
            setAnalysis(null);
            setSelectedAnalyst(null);
          }}
        />
      )}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
    </div>
  );
} 