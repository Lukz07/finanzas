/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Configuración para ofuscar el código en producción
  compiler: {
    // Ofuscar los nombres de variables y funciones
    minify: true,
    // Eliminar console.log y console.debug en producción
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },
  // Configuración para optimización adicional
  webpack: (config, { dev, isServer }) => {
    // Solo aplicar ofuscación en el cliente y en producción
    if (!dev && !isServer) {
      // Usar TerserPlugin para ofuscación avanzada
      config.optimization.minimizer.forEach((minimizer) => {
        if (minimizer.constructor.name === 'TerserPlugin') {
          minimizer.options.terserOptions = {
            ...minimizer.options.terserOptions,
            compress: {
              ...minimizer.options.terserOptions.compress,
              drop_console: true,
            },
            mangle: {
              ...minimizer.options.terserOptions.mangle,
              keep_classnames: false,
              keep_fnames: false,
              toplevel: true,
            },
            format: {
              ...minimizer.options.terserOptions.format,
              comments: false,
            },
          };
        }
      });
    }
    return config;
  },
  // Configuración de encabezados de seguridad
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.google.com https://*.googleadservices.com https://*.google-analytics.com https://*.googletagservices.com https://*.googletagmanager.com https://*.googlesyndication.com https://*.doubleclick.net https://*.adtrafficquality.google https://*.vercel-scripts.com https://*.vercel-insights.com https://*.vercel.app https://*.vercel.com;
              style-src 'self' 'unsafe-inline' https://fonts.googleapis.com data:;
              img-src 'self' data: https: http:;
              font-src 'self' data: https://fonts.gstatic.com;
              frame-src 'self' https://*.google.com https://*.doubleclick.net https://*.adtrafficquality.google;
              connect-src 'self' https://*.google.com https://*.googleapis.com https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com https://*.g.doubleclick.net https://*.adtrafficquality.google https://*.googlesyndication.com https://*.vercel-scripts.com https://*.vercel-insights.com https://*.vercel.app https://*.vercel.com;
              object-src 'none';
              base-uri 'self';
              form-action 'self';
              frame-ancestors 'self';
              upgrade-insecure-requests;
            `.replace(/\s+/g, ' ').trim()
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()'
          }
        ]
      }
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.cronista.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: '*.ambito.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'www.infobae.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'www.iprofesional.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'www.lanacion.com.ar',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'www.clarin.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'www.telam.com.ar',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: '*.bwbx.io',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: '*.zenfs.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: '*.yimg.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: '*.cointelegraph.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'images.cointelegraph.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 's3.cointelegraph.com',
        pathname: '**',
      },
      {
        protocol: 'http',
        hostname: '*.bwbx.io',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: '*.uecdn.es',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: '*.cnn.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: '*.warnermediacdn.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: '*.nyt.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'ejemplo.com',
      },
      {
        protocol: 'https',
        hostname: '**.example.com',
      },
      {
        protocol: 'https',
        hostname: '*.devfinanciero.com',
        pathname: '**',
      },
    ],
  },
  // No exponer claves API sensibles al cliente
}

module.exports = nextConfig 