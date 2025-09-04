import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Metadata, Viewport } from "next"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { AdSenseScript } from "@/components/AdSenseScript"
import { AdSenseProvider } from '@/components/blog/AdSenseContext'
import { GoogleAnalytics } from "@/components/GoogleAnalytics"
import { MainNav } from "@/components/layout/main-nav"
import { CookieConsent } from "@/components/CookieConsent"
import { getBaseUrl, createUrl } from "@/lib/config/urls"
import { FooterGlobal } from "@/components/ui/footer-global"
import Script from "next/script"
// import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: 'Finanzas Personales Argentina - Noticias, Inversiones y Análisis Económico',
  description: 'Plataforma líder en finanzas personales con noticias financieras actualizadas, herramientas de inversión, análisis económico y calculadoras financieras para Argentina y Latinoamérica.',
  generator: 'lukz.dev',
  applicationName: 'Finanzas',
  keywords: [
    'finanzas personales argentina', 
    'noticias financieras argentina', 
    'inversiones argentina', 
    'calculadora financiera', 
    'planificador inversiones', 
    'análisis económico', 
    'mercado valores argentina', 
    'educación financiera', 
    'ahorro familiar', 
    'presupuesto personal', 
    'dólar blue argentina', 
    'bolsa valores buenos aires', 
    'plazo fijo argentina', 
    'fondos comunes inversión'
  ],
  authors: [{ name: 'Finanzas Team' }],
  creator: 'Finanzas Team',
  publisher: 'Finanzas',
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
  metadataBase: new URL(getBaseUrl()),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Finanzas Personales Argentina - Noticias, Inversiones y Análisis Económico',
    description: 'Plataforma líder en finanzas personales con noticias financieras actualizadas, herramientas de inversión, análisis económico y calculadoras financieras para Argentina y Latinoamérica.',
    url: '/',
    siteName: 'Finanzas',
    locale: 'es_ES',
    type: 'website',
    images: [
      {
        url: createUrl('/og-image.svg'),
        width: 1200,
        height: 630,
        alt: 'Finanzas - Tu asistente financiero personal',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Finanzas Personales Argentina - Noticias, Inversiones y Análisis Económico',
    description: 'Plataforma líder en finanzas personales con noticias financieras actualizadas, herramientas de inversión, análisis económico y calculadoras financieras para Argentina y Latinoamérica.',
    creator: '@finanzas',
    images: [createUrl('/og-image.svg')],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
    other: [
      {
        rel: 'apple-touch-icon-precomposed',
        url: '/apple-touch-icon-precomposed.png',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AdSenseProvider>
      <html lang="es" suppressHydrationWarning>
        <head>
          <meta name="color-scheme" content="dark light" />
          <meta name="google-site-verification" content="google-site-verification=i5wj4CsiiDDdtsXgksK11VDocp4acTOjl0U9SQZbCb4" />
          <meta name="google-adsense-account" content="ca-pub-8473965589607250" />
          <CookieConsent />
          <AdSenseScript />
          {/* Script para sincronizar tema con localStorage */}
          <script
            dangerouslySetInnerHTML={{
              __html: `
                (function() {
                  try {
                    const theme = localStorage.getItem('theme');
                    if (theme === 'dark') {
                      document.documentElement.classList.add('dark');
                      document.documentElement.style.colorScheme = 'dark';
                    } else if (theme === 'light') {
                      document.documentElement.classList.remove('dark');
                      document.documentElement.style.colorScheme = 'light';
                    } else {
                      document.documentElement.classList.add('dark');
                      document.documentElement.style.colorScheme = 'dark';
                      localStorage.setItem('theme', 'dark');
                    }
                  } catch (e) {
                    console.error('Error al inicializar tema:', e);
                  }
                })();
              `
            }}
          />
          
          {/* Script para Vercel Analytics con soporte para eventos personalizados */}
          {process.env.NODE_ENV === 'production' && (
            <Script id="vercel-analytics-events" strategy="afterInteractive" src="https://va.vercel-scripts.com/v1/script.js" />
          )}
        </head>
        <body className={`${inter.className} bg-animated-gradient min-h-screen overflow-auto`}>
          <ThemeProvider>
            <div className="min-h-screen w-full overflow-visible relative flex flex-col">
              <MainNav />
              <main className="flex-grow w-full overflow-visible dark:bg-finance-gray-900/50">
                <div className="mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 max-w-[2000px]">
                  {children}
                </div>
              </main>
              <FooterGlobal />
            </div>
          </ThemeProvider>
          {process.env.NODE_ENV === 'production' ? (
            <>
              <Analytics />
              <SpeedInsights />
              <GoogleAnalytics measurementId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || ''} />
            </>
          ) : null}
        </body>
      </html>
    </AdSenseProvider>
  );
}