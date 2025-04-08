'use client';

import { usePathname, useRouter } from 'next/navigation';
import { SUPPORTED_LANGUAGES, getLanguageByPath, getAlternateUrls, SupportedLanguageCode } from '@/lib/config/languages';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function LanguageSelector() {
  const pathname = usePathname();
  const router = useRouter();
  const currentLang = getLanguageByPath(pathname);
  const alternateUrls = getAlternateUrls(pathname);

  const handleLanguageChange = (langCode: SupportedLanguageCode) => {
    const newPath = alternateUrls[langCode];
    if (newPath) {
      router.push(newPath);
    }
  };

  return (
    <Select value={currentLang.code} onValueChange={handleLanguageChange}>
      <SelectTrigger className="w-[140px]" aria-label="Seleccionar idioma">
        <SelectValue>
          <span className="flex items-center gap-2">
            <span>{currentLang.flag}</span>
            <span>{currentLang.name}</span>
          </span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {Object.values(SUPPORTED_LANGUAGES).map((lang) => (
          <SelectItem
            key={lang.code}
            value={lang.code}
            className="flex items-center gap-2"
          >
            <span>{lang.flag}</span>
            <span>{lang.name}</span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
} 