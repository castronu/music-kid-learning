'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language, translations, Translations } from './translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

function detectBrowserLanguage(): Language {
  if (typeof window === 'undefined') return 'it';

  const browserLang = navigator.language.toLowerCase();

  // Check for exact match or language prefix
  if (browserLang.startsWith('it')) return 'it';
  if (browserLang.startsWith('en')) return 'en';
  if (browserLang.startsWith('fr')) return 'fr';
  if (browserLang.startsWith('es')) return 'es';

  // Default to Italian
  return 'it';
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('it');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Check localStorage first, then browser language
    const savedLang = localStorage.getItem('music-helper-lang') as Language | null;
    const initialLang = savedLang || detectBrowserLanguage();
    setLanguageState(initialLang);
    setMounted(true);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('music-helper-lang', lang);
  };

  // Prevent hydration mismatch by rendering null until mounted
  if (!mounted) {
    return null;
  }

  const value: LanguageContextType = {
    language,
    setLanguage,
    t: translations[language],
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
