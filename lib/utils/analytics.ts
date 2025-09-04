/**
 * Utilidades para Google Analytics
 * Proporciona funciones helper para tracking de eventos y páginas
 */

/**
 * Trackear evento personalizado
 * @param action - Acción del evento (ej: 'click', 'view', 'download')
 * @param category - Categoría del evento (ej: 'engagement', 'video', 'form')
 * @param label - Etiqueta opcional del evento
 * @param value - Valor numérico opcional del evento
 */
export const trackEvent = (
  action: string,
  category: string,
  label?: string,
  value?: number
) => {
  if (typeof window !== 'undefined' && window.gtag && process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

/**
 * Trackear vista de página específica
 * @param url - URL de la página
 * @param title - Título opcional de la página
 */
export const trackPageView = (url: string, title?: string) => {
  if (typeof window !== 'undefined' && window.gtag && process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID) {
    window.gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID, {
      page_title: title || document.title,
      page_location: url,
    });
  }
};

/**
 * Trackear conversiones específicas
 * @param conversionId - ID de conversión de Google Ads (opcional)
 * @param value - Valor de la conversión
 * @param currency - Moneda (por defecto ARS para Argentina)
 */
export const trackConversion = (
  conversionId?: string,
  value?: number,
  currency: string = 'ARS'
) => {
  if (typeof window !== 'undefined' && window.gtag && conversionId && process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID) {
    window.gtag('event', 'conversion', {
      send_to: conversionId,
      value: value,
      currency: currency,
    });
  }
};

/**
 * Eventos predefinidos para el sitio de finanzas
 */
export const FinanceEvents = {
  // Eventos de navegación
  viewNewsArticle: (articleTitle: string) => 
    trackEvent('view_article', 'news', articleTitle),
  
  viewGuide: (guideTitle: string) => 
    trackEvent('view_guide', 'education', guideTitle),
  
  // Eventos de herramientas financieras
  useCalculator: (calculatorType: string) => 
    trackEvent('use_calculator', 'tools', calculatorType),
  
  startInvestmentPlanning: () => 
    trackEvent('start_planning', 'investment', 'investment_planner'),
  
  // Eventos de engagement
  clickExternalLink: (linkUrl: string) => 
    trackEvent('click_external_link', 'engagement', linkUrl),
  
  shareContent: (contentType: string, method: string) => 
    trackEvent('share', 'engagement', `${contentType}_${method}`),
  
  // Eventos de análisis
  requestAnalysis: (analysisType: string) => 
    trackEvent('request_analysis', 'ai_features', analysisType),
  
  viewAnalysisResult: (analysisId: string) => 
    trackEvent('view_analysis', 'ai_features', analysisId),
  
  // Eventos de búsqueda
  performSearch: (searchTerm: string) => 
    trackEvent('search', 'site_search', searchTerm),
  
  // Eventos de subscripción/engagement
  newsletterSignup: () => 
    trackEvent('newsletter_signup', 'engagement', 'footer_form'),
  
  downloadResource: (resourceName: string) => 
    trackEvent('download', 'resources', resourceName),
};
