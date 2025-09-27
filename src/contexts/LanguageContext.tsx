'use client';
import type { ReactNode } from 'react';
import { createContext, useState, useEffect, useCallback } from 'react';
import enTranslations from '@/locales/en.json';
import esTranslations from '@/locales/es.json';

export type Locale = 'en' | 'es';

interface LanguageContextType {
  language: Locale;
  setLanguage: (language: Locale) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const translations: Record<Locale, any> = {
  en: enTranslations,
  es: esTranslations,
};

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Locale>('es'); // Default to Spanish

  useEffect(() => {
    const storedLang = localStorage.getItem('erpLanguage') as Locale | null;
    if (storedLang && (storedLang === 'en' || storedLang === 'es')) {
      setLanguageState(storedLang);
      document.documentElement.lang = storedLang;
    } else {
      document.documentElement.lang = language;
    }
  }, [language]);

  const setLanguage = useCallback((lang: Locale) => {
    localStorage.setItem('erpLanguage', lang);
    setLanguageState(lang);
    document.documentElement.lang = lang;
  }, []);

  const t = useCallback((key: string, params?: Record<string, string | number>): string => {
    const keys = key.split('.');
    let result = translations[language];
    for (const k of keys) {
      result = result?.[k];
      if (result === undefined) {
        // Fallback to English if translation not found in current language
        let fallbackResult = translations['en'];
        for (const fk of keys) {
            fallbackResult = fallbackResult?.[fk];
            if (fallbackResult === undefined) {
                return key; // Return key if not found in English either
            }
        }
        result = fallbackResult;
        break;
      }
    }
    
    if (typeof result === 'string' && params) {
      return Object.entries(params).reduce((str, [paramKey, paramValue]) => {
        return str.replace(new RegExp(`{${paramKey}}`, 'g'), String(paramValue));
      }, result);
    }
    
    return typeof result === 'string' ? result : key;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}
