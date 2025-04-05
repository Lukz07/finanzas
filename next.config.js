/** @type {import('next').NextConfig} */
const nextConfig = {
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
    ],
  },
  env: {
    NEXT_PUBLIC_OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  },
}

module.exports = nextConfig 