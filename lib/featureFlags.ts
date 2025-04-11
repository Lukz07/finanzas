import { get } from '@vercel/edge-config';

export type FeatureFlag = {
  name: string;
  description: string;
  enabled: boolean;
};

export const FEATURE_FLAGS = {
  NEW_DASHBOARD: 'new-dashboard',
  DARK_MODE: 'dark-mode',
  // Agrega más feature flags según necesites
} as const;

export async function isFeatureEnabled(featureName: string): Promise<boolean> {
  try {
    const flags = await get<Record<string, boolean>>('featureFlags');
    return flags?.[featureName] ?? false;
  } catch (error) {
    console.error('Error al obtener feature flags:', error);
    return false;
  }
}

export async function getAllFeatureFlags(): Promise<Record<string, boolean>> {
  try {
    const flags = await get<Record<string, boolean>>('featureFlags');
    return flags ?? {};
  } catch (error) {
    console.error('Error al obtener feature flags:', error);
    return {};
  }
} 