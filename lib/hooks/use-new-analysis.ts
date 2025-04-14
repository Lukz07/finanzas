import { useState, useEffect } from 'react';
import { GoogleSheetsService } from '@/app/api/google-sheets/google-sheets-service';
import { AnalysisItem } from '@/lib/types/analysis';

const sheetsService = GoogleSheetsService.getInstance();
const LAST_CHECKED_KEY = 'last_analysis_check';
const NEW_ANALYSIS_KEY = 'has_new_analysis';

export function useNewAnalysis() {
  const [hasNewAnalysis, setHasNewAnalysis] = useState(false);

  useEffect(() => {
    const checkForNewAnalysis = async () => {
      try {
        const lastChecked = localStorage.getItem(LAST_CHECKED_KEY);
        const currentTime = Date.now();
        
        // Solo verificar cada 15 minutos
        if (lastChecked && currentTime - parseInt(lastChecked) < 15 * 60 * 1000) {
          const storedHasNew = localStorage.getItem(NEW_ANALYSIS_KEY);
          setHasNewAnalysis(storedHasNew === 'true');
          return;
        }

        const items = await sheetsService.getAnalysisItems();
        const lastItem = items[0]; // Asumiendo que están ordenados por fecha
        
        if (lastItem) {
          const lastItemDate = new Date(lastItem.date).getTime();
          const hasNew = !lastChecked || lastItemDate > parseInt(lastChecked);
          
          setHasNewAnalysis(hasNew);
          localStorage.setItem(NEW_ANALYSIS_KEY, hasNew.toString());
        }

        localStorage.setItem(LAST_CHECKED_KEY, currentTime.toString());
      } catch (error) {
        console.error('Error checking for new analysis:', error);
      }
    };

    checkForNewAnalysis();
    // Verificar cada 5 minutos
    const interval = setInterval(checkForNewAnalysis, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const markAsRead = () => {
    setHasNewAnalysis(false);
    localStorage.setItem(NEW_ANALYSIS_KEY, 'false');
  };

  return { hasNewAnalysis, markAsRead };
} 