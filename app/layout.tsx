import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
// import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

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
          <div className="min-h-screen w-full overflow-visible">
            <main className="min-h-screen w-full overflow-visible">{children}</main>
            {/* <Toaster /> */}
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}

import './globals.css'

export const metadata = {
  generator: 'v0.dev'
};