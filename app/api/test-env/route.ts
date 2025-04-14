import { NextResponse } from 'next/server';

export async function GET() {
  // Verificar las variables de entorno
  const envVars = {
    // Google Sheets API - Solo mostramos si existen, no los valores
    GOOGLE_API_KEY: !!process.env.GOOGLE_API_KEY,
    GOOGLE_SHEET_ID: !!process.env.GOOGLE_SHEET_ID,
    NEXT_PUBLIC_GOOGLE_API_KEY: !!process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
    NEXT_PUBLIC_GOOGLE_SHEET_ID: !!process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID,
    
    // Otras variables públicas
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_UI_VARIANT: process.env.NEXT_PUBLIC_UI_VARIANT,
    
    // Variables del sistema
    NODE_ENV: process.env.NODE_ENV,
    VERCEL_ENV: process.env.VERCEL_ENV,
  };

  return NextResponse.json({
    success: true,
    envVars,
    timestamp: new Date().toISOString(),
  });
} 