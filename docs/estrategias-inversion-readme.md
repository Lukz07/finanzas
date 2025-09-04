# Estrategias de Inversión desde Google Sheets

## Descripción del Cambio

Se ha implementado una mejora que permite obtener las estrategias de inversión desde una hoja de Google Sheets en lugar de tenerlas definidas estáticamente en el código. Esto facilita la administración de las estrategias, permitiendo:

1. Añadir, modificar o eliminar estrategias de inversión sin necesidad de tocar el código
2. Actualizar tasas de rendimiento de los brokers sin desplegar nuevas versiones
3. Añadir nuevos brokers fácilmente
4. Modificar las descripciones y textos explicativos de cada estrategia

## Archivos Modificados

- `lib/google-sheets.ts` - Nuevo servicio para obtener datos de Google Sheets
- `components/investment-icons.tsx` - Componente para mapear nombres de iconos a componentes de Lucide
- `components/welcom-page.tsx` - Se actualizó para obtener estrategias desde Google Sheets
- `components/initial-setup-modal.tsx` - Se actualizó la definición de tipos

## Funcionalidad

El sistema ahora:

1. Al cargar el componente WelcomePage, realiza una petición a la API de Google Sheets
2. Obtiene los datos de estrategias y brokers desde la hoja configurada
3. Muestra un indicador de carga mientras se obtienen los datos
4. Maneja posibles errores mostrando un mensaje adecuado
5. Permite seleccionar estrategias y brokers como antes, pero con los datos provenientes de la hoja

## Estructura de la Hoja de Google Sheets

Ver el archivo `docs/google-sheets-estructura.md` para detalles sobre cómo configurar la hoja de Google Sheets.

## Configuración

Para configurar la conexión con Google Sheets:

1. Actualizar la URL de la hoja en `lib/google-sheets.ts`
2. Reemplazar el placeholder `1ZZZ-ejemplo-id-de-sheet-XXXX` con el ID real de la hoja
3. Configurar la API Key de Google en la constante `TU_API_KEY`

### Ejemplo de URL completa:

```javascript
const GOOGLE_SHEET_URL = 'https://sheets.googleapis.com/v4/spreadsheets/1h7JxuQdGHJeUzDHsK9Gi0V2M9KfT3jO7Abcd12345/values/estrategias_inversion?key=AIzaSyB1GgH5aBcDE4fgH3jKlmnO1PqRs6T7890';
```

## Comportamiento ante fallos

Si la API de Google Sheets no está disponible o retorna un error, la aplicación:

1. Mostrará un mensaje de error en la UI
2. Permitirá al usuario recargar e intentar nuevamente
3. Proporcionará instrucciones para verificar la conexión

## Consideraciones de Seguridad

- La clave de API de Google Sheets debe tener restricciones adecuadas (dominio, referrer)
- La hoja debe estar configurada como "pública en la web" para que pueda ser accedida
- No se deben almacenar datos sensibles en esta hoja

## Google Analytics 4 - Integración Añadida

### Estado de la Integración
✅ **Google Analytics 4 (GA4) integrado** en el proyecto con tracking completo.

### Configuración GA4
Añade a tu archivo `.env.local`:
```env
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### Eventos de Tracking Disponibles
El sistema incluye eventos predefinidos para finanzas:
```tsx
import { FinanceEvents } from '@/lib/utils/analytics';

// Ejemplos de uso
FinanceEvents.viewGuide('Inversiones para Principiantes');
FinanceEvents.useCalculator('investment_planner');
FinanceEvents.requestAnalysis('market_analysis');
FinanceEvents.viewNewsArticle('Título del artículo');
```

### Archivos de GA4 Implementados
- `components/GoogleAnalytics.tsx` - Componente principal
- `lib/utils/analytics.ts` - Utilidades de tracking
- `app/layout.tsx` - Integrado en layout principal
- `types/global.d.ts` - Tipos TypeScript actualizados 