import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { ThemeToggle } from "@/components/theme-toggle"
import { Metadata, Viewport } from "next"
// import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

// Función para obtener el dominio base de la aplicación
const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }
  
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  
  return process.env.NODE_ENV === 'development' 
    ? 'http://localhost:3000' 
    : 'https://mifinanzas.com'; // Dominio de producción por defecto
};

// Función para crear URLs absolutas
const createUrl = (path: string) => {
  const baseUrl = getBaseUrl();
  return `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: 'Finanzas - Tu asistente financiero personal',
  description: 'Mantente informado sobre las últimas noticias financieras y gestiona tus inversiones de manera inteligente.',
  generator: 'lukz.dev',
  applicationName: 'Finanzas',
  keywords: ['finanzas personales', 'inversiones', 'educación financiera', 'ahorro', 'presupuesto'],
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
    languages: {
      'es-ES': '/',
    },
  },
  openGraph: {
    title: 'Finanzas - Tu asistente financiero personal',
    description: 'Mantente informado sobre las últimas noticias financieras y gestiona tus inversiones de manera inteligente.',
    url: '/',
    siteName: 'Finanzas',
    locale: 'es_ES',
    type: 'website',
    images: [
      {
        url: createUrl('og-image.jpg'),
        width: 1200,
        height: 630,
        alt: 'Finanzas - Tu asistente financiero personal',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Finanzas - Tu asistente financiero personal',
    description: 'Mantente informado sobre las últimas noticias financieras y gestiona tus inversiones de manera inteligente.',
    creator: '@finanzas',
    images: [createUrl('og-image.jpg')],
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
    <html lang="es" suppressHydrationWarning>
      <head>
        <meta name="color-scheme" content="dark light" />
        {/* Script para sincronizar tema con localStorage */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Verificar tema almacenado
              const theme = localStorage.getItem('theme');
              
              // Si hay un tema guardado en localStorage, usarlo
              if (theme === 'dark') {
                document.documentElement.classList.add('dark');
                document.documentElement.style.colorScheme = 'dark';
              } else if (theme === 'light') {
                document.documentElement.classList.remove('dark');
                document.documentElement.style.colorScheme = 'light';
              } else {
                // Si no hay preferencia guardada, usar dark como predeterminado
                document.documentElement.classList.add('dark');
                document.documentElement.style.colorScheme = 'dark';
                localStorage.setItem('theme', 'dark');
              }
            `,
          }}
        />
      </head>
      <body className={`${inter.className} bg-animated-gradient min-h-screen overflow-auto`}>
        <ThemeProvider>
          <div className="min-h-screen w-full overflow-visible relative">
            <div className="absolute right-4 top-4 z-50">
              <ThemeToggle />
            </div>
            <main className="min-h-screen w-full overflow-visible dark:bg-finance-gray-900/50">{children}</main>
            {/* <Toaster /> */}
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}