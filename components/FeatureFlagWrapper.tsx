'use client';

import { ReactNode, useEffect, useState } from 'react';
import { isFeatureEnabled } from '@/lib/featureFlags';

interface FeatureFlagWrapperProps {
  featureName: string;
  children: ReactNode;
  fallback?: ReactNode;
}

export function FeatureFlagWrapper({
  featureName,
  children,
  fallback = null,
}: FeatureFlagWrapperProps) {
  const [isEnabled, setIsEnabled] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkFeatureFlag = async () => {
      try {
        const enabled = await isFeatureEnabled(featureName);
        setIsEnabled(enabled);
      } catch (error) {
        console.error(`Error al verificar el feature flag ${featureName}:`, error);
        setIsEnabled(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkFeatureFlag();
  }, [featureName]);

  if (isLoading) {
    return null; // O puedes mostrar un loading spinner
  }

  return isEnabled ? <>{children}</> : <>{fallback}</>;
} 