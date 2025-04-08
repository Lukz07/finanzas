'use client';

import Script from 'next/script';

export function CookieConsent() {
  return (
    <>
      {/* Script principal de Google Funding Choices */}
      <Script
        id="googlefc-script"
        strategy="beforeInteractive"
        src="https://fundingchoicesmessages.google.com/i/pub-8473965589607250?ers=1"
      />

      {/* Script de inicialización y configuración */}
      <Script
        id="googlefc-config"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              function signalGooglefcPresent() {
                if (!window.frames['googlefcPresent']) {
                  if (document.body) {
                    const iframe = document.createElement('iframe');
                    iframe.style = 'width: 0; height: 0; border: none; z-index: -1000; left: -1000px; top: -1000px;';
                    iframe.style.display = 'none';
                    iframe.name = 'googlefcPresent';
                    document.body.appendChild(iframe);
                  } else {
                    setTimeout(signalGooglefcPresent, 0);
                  }
                }
              }
              signalGooglefcPresent();
              
              // Configuración global de consentimiento
              window.googlefc = window.googlefc || {};
              window.googlefc.callbackQueue = window.googlefc.callbackQueue || [];

              window.googlefc.controlledMessaging = true;
              window.googlefc.callbackQueue.push({
                'CONSENT_DATA_READY': () => {
                  // Mostrar el mensaje de consentimiento a todos los usuarios
                  window.googlefc.showRevocationMessage();
                }
              });
            })();
          `
        }}
      />
    </>
  );
} 