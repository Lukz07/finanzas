export const COUNTRIES = {
  'ar': {
    code: 'ar',
    name: 'Argentina',
    flag: '🇦🇷',
  },
  'us': {
    code: 'us',
    name: 'Estados Unidos',
    flag: '🇺🇸',
  },
  'es': {
    code: 'es',
    name: 'España',
    flag: '🇪🇸',
  },
  'br': {
    code: 'br',
    name: 'Brasil',
    flag: '🇧🇷',
  },
  'uk': {
    code: 'uk',
    name: 'Reino Unido',
    flag: '🇬🇧',
  },
  'global': {
    code: 'global',
    name: 'Global',
    flag: '🌐',
  },
} as const;

export type CountryCode = keyof typeof COUNTRIES;

export function getCountryFlag(code: string): string {
  return (COUNTRIES[code as CountryCode]?.flag || COUNTRIES['global'].flag);
}

export function getCountryName(code: string): string {
  return (COUNTRIES[code as CountryCode]?.name || COUNTRIES['global'].name);
} 