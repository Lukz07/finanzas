import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Calculator, Newspaper } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  description: string;
  showActions?: boolean;
  children?: ReactNode;
}

export function PageHeader({ 
  title, 
  description, 
  showActions = false,
  children 
}: PageHeaderProps) {
  return (
    <div className="text-center space-y-4">
      <h1 className="text-4xl font-bold text-finance-gray-900 dark:text-white">
        {title}
      </h1>
      <p className="text-lg text-finance-gray-600 dark:text-finance-gray-300 max-w-2xl mx-auto">
        {description}
      </p>
      
      {showActions && (
        <div className="flex justify-center gap-4">
          <Link href="/tools/investment-planner">
            <Button className="bg-finance-green-500 hover:bg-finance-green-600">
              <Calculator className="mr-2 h-4 w-4" />
              Planificador de Inversiones
            </Button>
          </Link>
          <Link href="/blog">
            <Button variant="outline">
              <Newspaper className="mr-2 h-4 w-4" />
              Ver Noticias
            </Button>
          </Link>
        </div>
      )}

      {children}
    </div>
  );
} 