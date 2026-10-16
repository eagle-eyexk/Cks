import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { german } from './translations';

export type Language = 'en' | 'de';
const LANGUAGE_KEY = 'cks-language';
type Values = Record<string, string | number>;

function isLanguage(value: string | null): value is Language {
  return value === 'en' || value === 'de';
}

function detectLanguage(): Language {
  if (typeof window !== 'undefined') {
    try {
      const saved = window.localStorage.getItem(LANGUAGE_KEY);
      if (isLanguage(saved)) return saved;
    } catch {
      // Fall back to the browser language when storage is unavailable.
    }
    return window.navigator.language.toLowerCase().startsWith('de') ? 'de' : 'en';
  }
  return 'en';
}

export function getLocale(language = detectLanguage()): string {
  return language === 'de' ? 'de-DE' : 'en-IE';
}

function translate(message: string, language: Language, values?: Values): string {
  let result = language === 'de' ? german[message] ?? message : message;
  for (const [key, value] of Object.entries(values ?? {})) {
    result = result.replaceAll(`{${key}}`, String(value));
  }
  return result;
}

type LanguageContextValue = {
  language: Language;
  locale: string;
  setLanguage: (language: Language) => void;
  t: (message: string, values?: Values) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(detectLanguage);
  const setLanguage = useCallback((next: Language) => {
    try {
      window.localStorage.setItem(LANGUAGE_KEY, next);
    } catch {
      // Language selection still works for this session without storage.
    }
    setLanguageState(next);
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    try {
      window.localStorage.setItem(LANGUAGE_KEY, language);
    } catch {
      // Keep the selected language in memory if browser storage is blocked.
    }
  }, [language]);

  const t = useCallback(
    (message: string, values?: Values) => translate(message, language, values),
    [language],
  );
  const value = useMemo(
    () => ({ language, locale: getLocale(language), setLanguage, t }),
    [language, setLanguage, t],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const value = useContext(LanguageContext);
  if (!value) throw new Error('LanguageProvider is missing');
  return value;
}
