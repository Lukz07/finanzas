'use client';

import Script from 'next/script';
import { useEffect, useRef } from 'react';

export function CookieConsent() {
  const scriptLoaded = useRef(false);

  useEffect(() => {
    // Función para crear el iframe necesario para Google Funding Choices
    function createFundingChoicesFrame() {
      if (!document.body) return false;
      
      try {
        if (!(window as any).frames?.['googlefcPresent']) {
          const iframe = document.createElement('iframe');
          iframe.style.cssText = 'width: 0; height: 0; border: none; z-index: -1000; left: -1000px; top: -1000px; display: none;';
          iframe.name = 'googlefcPresent';
          document.body.appendChild(iframe);
          return true;
        }
      } catch (error) {
        console.error('Error creando iframe:', error);
      }
      return false;
    }

    // Función para inicializar el consentimiento
    function initializeConsent() {
      try {
        // Configuración básica de Google Funding Choices
        const fc = ((window as any).googlefc = (window as any).googlefc || {});
        fc.callbackQueue = fc.callbackQueue || [];

        // Configurar las callbacks
        fc.callbackQueue.push({
          'LOADED': function() {
            console.log('Google Funding Choices cargado completamente');
            try {
              if (fc.showRevocationMessage) {
                fc.showRevocationMessage();
                console.log('Mensaje de consentimiento mostrado');
              }
            } catch (e) {
              console.error('Error mostrando mensaje:', e);
            }
          }
        });

        return true;
      } catch (error) {
        console.error('Error inicializando consentimiento:', error);
        return false;
      }
    }

    // Función principal de inicialización
    function initialize() {
      if (scriptLoaded.current) {
        const iframeCreated = createFundingChoicesFrame();
        if (iframeCreated) {
          initializeConsent();
        }
      }
    }

    // Intentar inicializar cuando el componente se monta
    initialize();

    // También intentar cuando el DOM esté completamente cargado
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initialize);
    }

    return () => {
      document.removeEventListener('DOMContentLoaded', initialize);
    };
  }, []);

  return (
    <>
      <Script
        id="googlefc-script"
        strategy="afterInteractive"
        src="https://fundingchoicesmessages.google.com/i/pub-8473965589607250?ers=1"
        onLoad={() => {
          console.log('Script de Google Funding Choices cargado');
          scriptLoaded.current = true;
        }}
      />
      <Script
        id="googlefc-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.googlefc = window.googlefc || {};
            window.googlefc.callbackQueue = window.googlefc.callbackQueue || [];
          `
        }}
      />
    </>
  );
} 