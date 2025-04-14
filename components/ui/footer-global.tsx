"use client"

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { AtSign } from "lucide-react";
import { Instagram } from "lucide-react";
import { Mail } from "lucide-react";
import { MapPin } from "lucide-react";
import { Phone } from "lucide-react";
import { Send } from "lucide-react";

export function FooterGlobal() {
  const [email, setEmail] = useState("");
  const [subscribeLoading, setSubscribeLoading] = useState(false);
  const [subscribeSuccess, setSubscribeSuccess] = useState(false);
  
  const currentYear = new Date().getFullYear();
  
  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    try {
      setSubscribeLoading(true);
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSubscribeSuccess(true);
      setEmail("");
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setSubscribeSuccess(false);
      }, 5000);
    } catch (err) {
      console.error("Error al suscribirse:", err);
      alert("Error al suscribirse. Por favor, intente nuevamente.");
    } finally {
      setSubscribeLoading(false);
    }
  };
  
  // Renderizar el contenido del botón según el estado
  const renderButtonContent = () => {
    if (subscribeLoading) {
      return (
        <>
          <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
          Enviando...
        </>
      );
    }
    
    if (subscribeSuccess) {
      return (
        <>
          ¡Suscrito!
          <Send className="ml-2 h-4 w-4" />
        </>
      );
    }
    
    return (
      <>
        Suscribirse
        <Send className="ml-2 h-4 w-4" />
      </>
    );
  };
  
  return (
    <footer className="border-t border-finance-gray-200 dark:border-finance-gray-700 bg-finance-gray-50 dark:bg-finance-gray-900">
      <div className="container mx-auto py-12 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna 1: Logo e información */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-finance-gray-900 dark:text-white">Finanzas Personales</h3>
            <p className="text-finance-gray-600 dark:text-finance-gray-300">
              Tu plataforma integral para gestionar tus finanzas, mantenerte informado y planificar tu futuro financiero.
            </p>
            <div className="flex space-x-4 mt-6">
              <a 
                href="https://instagram.com/cheeinverti" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-finance-gray-200 dark:bg-finance-gray-800 p-2 rounded-full hover:bg-finance-green-100 dark:hover:bg-finance-green-900/20 transition-colors"
                aria-label="Síguenos en Instagram"
              >
                <Instagram className="h-5 w-5 text-finance-gray-700 dark:text-finance-gray-300" />
              </a>
              <a 
                href="https://tiktok.com/@cheeinverti" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-finance-gray-200 dark:bg-finance-gray-800 p-2 rounded-full hover:bg-finance-green-100 dark:hover:bg-finance-green-900/20 transition-colors"
                aria-label="Síguenos en TikTok"
              >
                <AtSign className="h-5 w-5 text-finance-gray-700 dark:text-finance-gray-300" />
              </a>
            </div>
          </div>

          {/* Columna 2: Newsletter */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-finance-gray-900 dark:text-white">
              Suscríbete a nuestro Newsletter
            </h3>
            <p className="text-finance-gray-600 dark:text-finance-gray-300">
              Recibe las mejores noticias financieras directamente en tu bandeja de entrada.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4">
              <Input
                type="email"
                placeholder="Tu correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1"
                disabled={subscribeLoading || subscribeSuccess}
              />
              <Button 
                type="submit" 
                disabled={subscribeLoading || subscribeSuccess}
                className={subscribeSuccess ? "bg-finance-green-500" : ""}
              >
                {renderButtonContent()}
              </Button>
            </form>
          </div>

          {/* Columna 3: Contacto Profesional */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-finance-gray-900 dark:text-white">Contacto Profesional</h3>
            <p className="text-finance-gray-600 dark:text-finance-gray-300">
              ¿Necesitas asesoría financiera personalizada? Contáctanos.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-finance-green-500" />
                <a href="mailto:contacto@finanzas.com" className="text-finance-gray-700 dark:text-finance-gray-300 hover:text-finance-green-600 dark:hover:text-finance-green-400">
                  DM en Instagram
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-finance-green-500" />
                <a href="tel:+1234567890" className="text-finance-gray-700 dark:text-finance-gray-300 hover:text-finance-green-600 dark:hover:text-finance-green-400">
                  DM en Instagram
                </a>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-finance-green-500 mt-1" />
                <span className="text-finance-gray-700 dark:text-finance-gray-300">
                  Av. Principal 123, Ciudad Financiera
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Enlaces rápidos */}
        <div className="border-t border-finance-gray-200 dark:border-finance-gray-700 mt-8 pt-8">
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
            <Link 
              href="/" 
              className="text-finance-gray-600 dark:text-finance-gray-300 hover:text-finance-green-600 dark:hover:text-finance-green-400"
            >
              Inicio
            </Link>
            <Link 
              href="/blog" 
              className="text-finance-gray-600 dark:text-finance-gray-300 hover:text-finance-green-600 dark:hover:text-finance-green-400"
            >
              Blog
            </Link>
            <Link 
              href="/tools" 
              className="text-finance-gray-600 dark:text-finance-gray-300 hover:text-finance-green-600 dark:hover:text-finance-green-400"
            >
              Herramientas
            </Link>
            <Link 
              href="/privacy" 
              className="text-finance-gray-600 dark:text-finance-gray-300 hover:text-finance-green-600 dark:hover:text-finance-green-400"
            >
              Privacidad
            </Link>
            <Link 
              href="/terms" 
              className="text-finance-gray-600 dark:text-finance-gray-300 hover:text-finance-green-600 dark:hover:text-finance-green-400"
            >
              Términos
            </Link>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center mt-8 text-finance-gray-600 dark:text-finance-gray-400">
          <p>© {currentYear} Finanzas Personales. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
} 