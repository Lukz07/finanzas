import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 py-16 text-center">
      <h1 className="text-6xl font-bold text-finance-primary mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-6">Página no encontrada</h2>
      <p className="text-finance-gray-600 dark:text-finance-gray-300 mb-8 max-w-md">
        Lo sentimos, la página que buscas no existe o ha sido movida.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link 
          href="/"
          className="bg-finance-primary hover:bg-finance-primary/90 text-white font-medium py-2 px-6 rounded-md transition-colors"
        >
          Volver al inicio
        </Link>
        <Link 
          href="/blog"
          className="bg-finance-secondary hover:bg-finance-secondary/90 text-white font-medium py-2 px-6 rounded-md transition-colors"
        >
          Explorar noticias
        </Link>
      </div>
    </div>
  );
} 