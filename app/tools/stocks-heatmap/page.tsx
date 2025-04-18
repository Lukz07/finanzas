"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Head from "next/head";

export default function StocksHeatmapPage() {
  const [activeTab, setActiveTab] = useState("merval");

  return (
    <>
      <Head>
        <title>Heatmaps de Acciones - Finanzas</title>
        <meta name="description" content="Visualiza el rendimiento de los mercados bursátiles con heatmaps interactivos para S&P Merval y S&P 500." />
        <meta name="keywords" content="heatmap, S&P Merval, S&P 500, acciones, finanzas, mercado bursátil" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={`${process.env.NEXT_PUBLIC_BASE_URL}/tools/stocks-heatmap`} />
      </Head>
      <div className="py-8 space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Heatmaps de Acciones</h1>
          <p className="text-muted-foreground">
            Visualiza el rendimiento de los mercados bursátiles de forma interactiva.
          </p>
        </div>

        <Tabs defaultValue="merval" onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="merval">S&P Merval</TabsTrigger>
            <TabsTrigger value="sp500">S&P 500</TabsTrigger>
          </TabsList>
          
          <TabsContent value="merval" className="mt-4">
            <div className="border rounded-lg overflow-hidden">
              <div className="aspect-video w-full">
                <iframe 
                  src="https://www.tradingview-widget.com/embed-widget/stock-heatmap/?locale=es#%7B%22exchanges%22%3A%5B%5D%2C%22dataSource%22%3A%22BCBAIMV%22%2C%22grouping%22%3A%22sector%22%2C%22blockSize%22%3A%22market_cap_basic%22%2C%22blockColor%22%3A%22change%22%2C%22symbolUrl%22%3A%22%22%2C%22colorTheme%22%3A%22dark%22%2C%22hasTopBar%22%3Atrue%2C%22isDataSetEnabled%22%3Atrue%2C%22isZoomEnabled%22%3Atrue%2C%22hasSymbolTooltip%22%3Atrue%2C%22isMonoSize%22%3Afalse%2C%22width%22%3A%22100%25%22%2C%22height%22%3A%22100%25%22%2C%22utm_source%22%3A%22www.gabrielmartin.yt%22%2C%22utm_medium%22%3A%22widget%22%2C%22utm_campaign%22%3A%22stock-heatmap%22%7D"
                  className="w-full h-full"
                  title="Heatmap S&P Merval"
                  frameBorder="0"
                  allowFullScreen
                />
              </div>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Heatmap del S&P Merval mostrando el rendimiento de las principales acciones argentinas.
            </p>
          </TabsContent>

          <TabsContent value="sp500" className="mt-4">
            <div className="border rounded-lg overflow-hidden">
              <div className="aspect-video w-full">
                <iframe 
                  src="https://www.tradingview-widget.com/embed-widget/stock-heatmap/?locale=es#%7B%22exchanges%22%3A%5B%5D%2C%22dataSource%22%3A%22SPX500%22%2C%22grouping%22%3A%22sector%22%2C%22blockSize%22%3A%22market_cap_basic%22%2C%22blockColor%22%3A%22change%22%2C%22symbolUrl%22%3A%22%22%2C%22colorTheme%22%3A%22dark%22%2C%22hasTopBar%22%3Atrue%2C%22isDataSetEnabled%22%3Atrue%2C%22isZoomEnabled%22%3Atrue%2C%22hasSymbolTooltip%22%3Atrue%2C%22isMonoSize%22%3Afalse%2C%22width%22%3A%22100%25%22%2C%22height%22%3A%22100%25%22%2C%22utm_source%22%3A%22www.gabrielmartin.yt%22%2C%22utm_medium%22%3A%22widget_new%22%2C%22utm_campaign%22%3A%22stock-heatmap%22%7D"
                  className="w-full h-full" 
                  title="Heatmap S&P 500"
                  frameBorder="0"
                  allowFullScreen
                />
              </div>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Heatmap del S&P 500 mostrando el rendimiento de las principales acciones estadounidenses.
            </p>
          </TabsContent>
        </Tabs>

        <div className="mt-6 space-y-4">
          <h2 className="text-2xl font-semibold">¿Qué es un Heatmap?</h2>
          <p>
            Un heatmap o mapa de calor es una representación visual donde los valores individuales en una matriz
            se representan como colores. En el contexto bursátil, el color generalmente indica el rendimiento 
            (verde para subidas, rojo para bajadas) y el tamaño de cada bloque representa la capitalización de mercado.
          </p>
          <p>
            Esta visualización permite identificar rápidamente tendencias sectoriales y el comportamiento general del mercado.
          </p>
        </div>
      </div>
    </>
  );
}
