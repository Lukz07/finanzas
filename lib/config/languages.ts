export const SUPPORTED_LANGUAGES = {
  'es-ES': {
    code: 'es-ES',
    locale: 'es_ES',
    name: 'Español',
    flag: '🇪🇸',
    default: true,
    path: '/'
  },
  'en-US': {
    code: 'en-US',
    locale: 'en_US',
    name: 'English',
    flag: '🇺🇸',
    default: false,
    path: '/en'
  },
  'pt-BR': {
    code: 'pt-BR',
    locale: 'pt_BR',
    name: 'Português',
    flag: '🇧🇷',
    default: false,
    path: '/pt'
  }
} as const;

export type SupportedLanguageCode = keyof typeof SUPPORTED_LANGUAGES;

export function getDefaultLanguage() {
  return Object.values(SUPPORTED_LANGUAGES).find(lang => lang.default) || SUPPORTED_LANGUAGES['es-ES'];
}

export function isValidLanguage(code: string): code is SupportedLanguageCode {
  return code in SUPPORTED_LANGUAGES;
}

export function getLanguageByPath(path: string) {
  return Object.values(SUPPORTED_LANGUAGES).find(lang => path.startsWith(lang.path)) || getDefaultLanguage();
}

export function getAlternateUrls(path: string) {
  const currentLang = getLanguageByPath(path);
  const basePath = path.replace(currentLang.path, '');
  
  return Object.values(SUPPORTED_LANGUAGES).reduce((acc, lang) => {
    acc[lang.code] = `${lang.path}${basePath}`;
    return acc;
  }, {} as Record<SupportedLanguageCode, string>);
} 