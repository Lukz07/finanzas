export function NewsCardSliderSkeleton() {
  return (
    <div className="relative w-full h-[400px] overflow-hidden bg-gray-100 dark:bg-finance-green-900 rounded-lg animate-pulse">
      {/* Contenedor del slider */}
      <div className="absolute top-0 left-0 w-full h-full bg-finance-green-700">
        {/* Card skeleton */}
        <div className="absolute w-full h-full">
          <div className="h-full p-4">
            {/* Imagen skeleton */}
            <div className="w-full h-48 bg-gray-200 dark:bg-finance-green-900 rounded-lg mb-4" />
            
            {/* Contenido skeleton */}
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 dark:bg-finance-green-900 rounded w-3/4" />
              <div className="h-4 bg-gray-200 dark:bg-finance-green-900 rounded w-1/2" />
              <div className="h-4 bg-gray-200 dark:bg-finance-green-900 rounded w-2/3" />
              <div className="h-4 bg-gray-200 dark:bg-finance-green-900 rounded w-1/4" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Indicadores skeleton */}
      {/* <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {[0, 1, 2].map((index) => (
          <div
            key={index}
            className="w-2 h-2 rounded-full bg-gray-200"
          />
        ))}
      </div> */}
    </div>
  );
} 