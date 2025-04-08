'use client';

import Script from 'next/script';
import { usePathname } from 'next/navigation';

export function CookieConsent() {
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  return (
    <>
      {/* Script principal de Google Funding Choices */}
      <Script
        id="googlefc-script"
        strategy="afterInteractive"
        src="https://fundingchoicesmessages.google.com/i/pub-8473965589607250?ers=1"
      />

      {/* Script de inicialización y configuración */}
      <Script
        id="googlefc-config"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              // Configuración básica
              window.googlefc = window.googlefc || {};
              window.googlefc.callbackQueue = window.googlefc.callbackQueue || [];

              // Forzar el mensaje siempre en la home page
              const isHomePage = ${isHomePage};
              
              function showConsentMessage() {
                try {
                  if (window.googlefc && typeof window.googlefc.showRevocationMessage === 'function') {
                    window.googlefc.showRevocationMessage();
                  } else {
                    setTimeout(showConsentMessage, 500);
                  }
                } catch (error) {
                  console.error('Error mostrando mensaje de consentimiento:', error);
                }
              }

              // Crear y configurar el iframe necesario
              function setupConsent() {
                // Crear iframe si no existe
                if (!window.frames['googlefcPresent']) {
                  const iframe = document.createElement('iframe');
                  iframe.style.cssText = 'width: 0; height: 0; border: none; z-index: -1000; left: -1000px; top: -1000px; display: none;';
                  iframe.name = 'googlefcPresent';
                  document.body.appendChild(iframe);
                }

                // Si estamos en la home page, forzar el mensaje
                if (isHomePage) {
                  showConsentMessage();
                }
              }

              // Intentar configurar varias veces para asegurar que se muestre
              [0, 1000, 2000].forEach(delay => {
                setTimeout(setupConsent, delay);
              });

              // También mostrar cuando el script esté completamente cargado
              window.googlefc.callbackQueue.push({
                'LOADED': function() {
                  if (isHomePage) {
                    showConsentMessage();
                  }
                }
              });
            })();
          `
        }}
      />
    </>
  );
} 