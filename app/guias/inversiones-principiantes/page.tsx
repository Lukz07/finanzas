import { Metadata } from 'next';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { Card } from '@/components/ui/card';
import { AlertTriangle, CheckCircle, TrendingUp, DollarSign, Shield, Clock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Guía Completa de Inversiones para Principiantes 2024 | Finanzas Argentina',
  description: 'Aprende a invertir desde cero con esta guía completa. Descubre tipos de inversiones, estrategias, riesgos y cómo empezar con poco dinero en Argentina.',
  keywords: [
    'inversiones principiantes argentina',
    'como empezar a invertir',
    'tipos de inversiones',
    'invertir poco dinero',
    'estrategias de inversión',
    'inversiones seguras argentina',
    'plazo fijo vs inversiones',
    'fondos comunes de inversión'
  ],
  openGraph: {
    title: 'Guía Completa de Inversiones para Principiantes 2024',
    description: 'Aprende a invertir desde cero con esta guía completa. Descubre tipos de inversiones, estrategias, riesgos y cómo empezar con poco dinero.',
    type: 'article',
  },
};

export default function InversionesPrincipiantesPage() {
  const breadcrumbItems = [
    { label: 'Guías', href: '/guias' },
    { label: 'Inversiones para Principiantes' }
  ];

  return (
    <article className="max-w-[970px] mx-auto py-8 prose dark:prose-invert max-w-none">
      <Breadcrumbs items={breadcrumbItems} className="mb-6 not-prose" />
      
      <header className="not-prose mb-8">
        <h1 className="text-4xl font-bold mb-4">Guía Completa de Inversiones para Principiantes</h1>
        <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400">
          <span>📖 15 min de lectura</span>
          <span>•</span>
          <span>Nivel: Principiante</span>
          <span>•</span>
          <span>Actualizado: Enero 2024</span>
        </div>
      </header>

      <div className="not-prose mb-8">
        <Card className="bg-finance-green-50 dark:bg-finance-green-900/10 border-finance-green-200 dark:border-finance-green-800">
          <div className="p-6">
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-6 h-6 text-finance-green-600 dark:text-finance-green-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-finance-green-800 dark:text-finance-green-200 mb-2">
                  ¿Qué aprenderás en esta guía?
                </h3>
                <ul className="text-sm text-finance-green-700 dark:text-finance-green-300 space-y-1">
                  <li>• Conceptos básicos de inversión</li>
                  <li>• Tipos de inversiones disponibles en Argentina</li>
                  <li>• Cómo evaluar riesgo vs rentabilidad</li>
                  <li>• Estrategias para empezar con poco dinero</li>
                  <li>• Errores comunes y cómo evitarlos</li>
                </ul>
              </div>
            </div>
          </div>
        </Card>
      </div>

      ## ¿Qué es invertir y por qué es importante?

      Invertir es destinar dinero a diferentes instrumentos financieros con el objetivo de generar ganancias a lo largo del tiempo. A diferencia del ahorro tradicional, donde el dinero permanece estático, las inversiones buscan hacer que tu dinero "trabaje" para ti.

      ### ¿Por qué no basta con ahorrar?

      En Argentina, la inflación puede erosionar el valor de tus ahorros. Si tienes $100.000 en una cuenta de ahorro y la inflación anual es del 40%, al año siguiente necesitarás $140.000 para comprar lo mismo que compraste con $100.000 hoy.

      ## Conceptos Fundamentales

      ### 1. Riesgo vs Rentabilidad

      <div className="not-prose my-6">
        <Card>
          <div className="p-6">
            <h4 className="font-semibold mb-3 flex items-center">
              <Shield className="w-5 h-5 mr-2 text-blue-600" />
              Regla de Oro de las Inversiones
            </h4>
            <p className="text-gray-600 dark:text-gray-400">
              "A mayor rentabilidad esperada, mayor riesgo". No existe inversión de alta rentabilidad sin riesgo.
            </p>
          </div>
        </Card>
      </div>

      ### 2. Diversificación

      No pongas todos los huevos en la misma canasta. Distribuir tus inversiones en diferentes instrumentos reduce el riesgo general de tu portafolio.

      ### 3. Horizonte Temporal

      El tiempo es tu aliado. Las inversiones a largo plazo (5+ años) tienen mayor potencial de crecimiento y pueden soportar mejor la volatilidad del mercado.

      ## Tipos de Inversiones en Argentina

      ### 1. Inversiones Conservadoras (Bajo Riesgo)

      **Plazo Fijo**
      - **Rentabilidad**: 40-60% anual (en pesos)
      - **Riesgo**: Muy bajo
      - **Liquidez**: Baja (hasta vencimiento)
      - **Ideal para**: Fondo de emergencia

      **Letras del Tesoro (LECAP/LECER)**
      - **Rentabilidad**: Similar a tasa de referencia del BCRA
      - **Riesgo**: Muy bajo (respaldado por el Estado)
      - **Liquidez**: Alta (se pueden vender antes del vencimiento)

      ### 2. Inversiones Moderadas (Riesgo Medio)

      **Fondos Comunes de Inversión (FCI)**
      - **Rentabilidad**: Variable según tipo de fondo
      - **Riesgo**: Medio
      - **Liquidez**: Alta
      - **Ventaja**: Gestión profesional y diversificación automática

      **Bonos del Tesoro**
      - **Rentabilidad**: 8-15% anual en dólares
      - **Riesgo**: Medio
      - **Liquidez**: Media-Alta

      ### 3. Inversiones Agresivas (Alto Riesgo)

      **Acciones**
      - **Rentabilidad**: Muy variable (-50% a +100% o más)
      - **Riesgo**: Alto
      - **Liquidez**: Alta
      - **Requiere**: Conocimiento y seguimiento constante

      **Criptomonedas**
      - **Rentabilidad**: Extremadamente variable
      - **Riesgo**: Muy alto
      - **Liquidez**: Alta
      - **Advertencia**: Solo para inversores experimentados

      ## Cómo Empezar a Invertir con Poco Dinero

      ### Paso 1: Define tu Situación Financiera

      <div className="not-prose my-6">
        <Card className="bg-yellow-50 dark:bg-yellow-900/10 border-yellow-200 dark:border-yellow-800">
          <div className="p-6">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-6 h-6 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                  Antes de invertir, asegúrate de tener:
                </h4>
                <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                  <li>• Un fondo de emergencia (3-6 meses de gastos)</li>
                  <li>• Deudas de alto interés saldadas</li>
                  <li>• Ingresos estables</li>
                  <li>• Objetivos financieros claros</li>
                </ul>
              </div>
            </div>
          </div>
        </Card>
      </div>

      ### Paso 2: Establece tu Perfil de Riesgo

      **Conservador**: Si no puedes permitirte perder dinero y priorizas preservar capital.

      **Moderado**: Puedes asumir algunas pérdidas temporales a cambio de mayor rentabilidad.

      **Agresivo**: Estás dispuesto a asumir altas pérdidas por potenciales altas ganancias.

      ### Paso 3: Elige tu Broker o Plataforma

      **Para principiantes recomendamos:**
      - **Fondos Comunes**: Cualquier banco (BBVA, Santander, Galicia)
      - **Letras y Bonos**: Portfolio Personal, Balanz, IOL
      - **Acciones**: Portfolio Personal, Invertir Online (IOL), Balanz

      ### Paso 4: Tu Primera Inversión

      **Con $50.000 pesos podrías hacer:**

      1. **Opción Conservadora**: 100% en LECAP o plazo fijo UVA
      2. **Opción Moderada**: 70% FCI Money Market + 30% FCI Renta Fija
      3. **Opción Agresiva**: 50% FCI Renta Fija + 30% FCI Acciones + 20% Acciones individuales

      ## Estrategias para Principiantes

      ### 1. Dollar Cost Averaging (Promedio de Costo)

      Invierte la misma cantidad de dinero cada mes, independientemente del precio del activo. Esto reduce el impacto de la volatilidad.

      **Ejemplo**: En lugar de invertir $120.000 de una vez, invierte $10.000 cada mes durante un año.

      ### 2. Regla del 70-20-10

      - **70%**: Inversiones conservadoras (LECAPs, FCI Money Market)
      - **20%**: Inversiones moderadas (Bonos, FCI Renta Mixta)
      - **10%**: Inversiones agresivas (Acciones, FCI Acciones)

      ### 3. Rebalanceo Periódico

      Cada 6 meses, ajusta tu portafolio para mantener las proporciones objetivo. Si las acciones subieron mucho, vende parte y compra más bonos.

      ## Errores Comunes y Cómo Evitarlos

      <div className="not-prose my-6 space-y-4">
        <Card className="bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800">
          <div className="p-4">
            <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2">❌ Error: Buscar "la inversión perfecta"</h4>
            <p className="text-sm text-red-700 dark:text-red-300">
              <strong>Solución:</strong> Diversifica siempre. No existe una sola inversión que sea perfecta para todas las situaciones.
            </p>
          </div>
        </Card>

        <Card className="bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800">
          <div className="p-4">
            <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2">❌ Error: Intentar "timing" del mercado</h4>
            <p className="text-sm text-red-700 dark:text-red-300">
              <strong>Solución:</strong> Invierte regularmente sin intentar predecir cuándo es el "mejor momento".
            </p>
          </div>
        </Card>

        <Card className="bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800">
          <div className="p-4">
            <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2">❌ Error: Dejarse llevar por emociones</h4>
            <p className="text-sm text-red-700 dark:text-red-300">
              <strong>Solución:</strong> Define una estrategia y sígueme. No vendas en pánico ni compres por euforia.
            </p>
          </div>
        </Card>
      </div>

      ## Herramientas Útiles

      ### Calculadoras Recomendadas

      - **[Calculadora de Inversiones](/tools/investment-planner)**: Para proyectar el crecimiento de tus inversiones
      - **Calculadora de Interés Compuesto**: Para entender el poder del tiempo
      - **Calculadora de Inflación**: Para ajustar expectativas reales

      ### Apps Móviles

      - **Portfolio Personal**: Para invertir en bonos y acciones
      - **Ualá**: Para FCI y seguimiento de gastos
      - **Mercado Pago**: Para inversiones básicas

      ## Próximos Pasos

      1. **Define tu objetivo**: ¿Para qué estás invirtiendo? (Casa, jubilación, viaje)
      2. **Calcula cuánto puedes invertir mensualmente**
      3. **Abre una cuenta en un broker confiable**
      4. **Comienza con FCI Money Market o LECAPs**
      5. **Aumenta gradualmente el riesgo según ganes experiencia**

      <div className="not-prose mt-12">
        <Card className="bg-finance-green-50 dark:bg-finance-green-900/10 border-finance-green-200 dark:border-finance-green-800">
          <div className="p-6">
            <div className="flex items-start space-x-3">
              <TrendingUp className="w-6 h-6 text-finance-green-600 dark:text-finance-green-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-finance-green-800 dark:text-finance-green-200 mb-2">
                  ¿Listo para empezar?
                </h3>
                <p className="text-sm text-finance-green-700 dark:text-finance-green-300 mb-4">
                  Utiliza nuestra calculadora de inversiones para proyectar el crecimiento de tu dinero y planificar tus objetivos financieros.
                </p>
                <a 
                  href="/tools/investment-planner"
                  className="inline-flex items-center px-4 py-2 bg-finance-green-600 text-white rounded-lg hover:bg-finance-green-700 transition-colors text-sm"
                >
                  <Calculator className="w-4 h-4 mr-2" />
                  Usar Calculadora
                </a>
              </div>
            </div>
          </div>
        </Card>
      </div>

      ## Conclusión

      Invertir no tiene por qué ser complicado. Comienza con lo básico, mantén la disciplina y ve aumentando gradualmente tu conocimiento y tolerancia al riesgo. Recuerda que **el mejor momento para empezar a invertir fue ayer, el segundo mejor momento es hoy**.

      La clave del éxito en las inversiones no está en encontrar la "fórmula secreta", sino en ser consistente, diversificar adecuadamente y mantener una perspectiva a largo plazo.

      ---

      <div className="not-prose mt-8 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Esta guía tiene fines educativos. Siempre consulta con un asesor financiero antes de tomar decisiones de inversión importantes.
        </p>
      </div>
    </article>
  );
}
