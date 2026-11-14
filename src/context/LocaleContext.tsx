import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { BURMESE, BURMESE_GLOSSARY } from '../i18n/burmese';
import {
  registerLocaleResolver,
  setActiveLocale,
  t as enT,
  format as enFormat,
  glossary as enGlossary,
  type TranslationKey,
} from '../i18n/index';

export type AppLocale = 'en' | 'my';

// Register the complete Burmese dictionary and glossary with the core i18n subsystem
registerLocaleResolver(
  (key) => BURMESE[key],
  () => BURMESE_GLOSSARY,
);

interface LocaleContextValue {
  locale: AppLocale;
  setLocale: (locale: AppLocale) => void;
  toggleLocale: () => void;
  t: (key: TranslationKey, params?: Record<string, string | number>) => string;
  format: (key: TranslationKey, params: Record<string, string | number>) => string;
  glossary: () => readonly { term: string; plain: string }[];
  isReviewMode: boolean;
}

const LocaleContext = createContext<LocaleContextValue>({
  locale: 'en',
  setLocale: () => {},
  toggleLocale: () => {},
  t: (key) => enT(key),
  format: (key, params) => enFormat(key, params),
  glossary: () => enGlossary(),
  isReviewMode: false,
});

export function LocaleProvider({ children }: { children: ReactNode }) {
  const isReviewMode =
    typeof window !== 'undefined' &&
    (import.meta.env.MODE === 'burmese-review' ||
      window.location.search.includes('mode=burmese-review') ||
      window.location.search.includes('lang=my') ||
      window.location.search.includes('locale=my'));

  const [locale, setLocaleState] = useState<AppLocale>(() => {
    if (typeof window === 'undefined') return 'en';
    const stored = window.localStorage.getItem('ignis_locale');
    if (stored === 'my' || stored === 'en') {
      setActiveLocale(stored);
      return stored;
    }
    const initial = isReviewMode ? 'my' : 'en';
    setActiveLocale(initial);
    return initial;
  });

  const setLocale = (next: AppLocale) => {
    setActiveLocale(next);
    setLocaleState(next);
    try {
      window.localStorage.setItem('ignis_locale', next);
    } catch {
      // storage unavailable
    }
  };

  const toggleLocale = () => {
    setLocale(locale === 'en' ? 'my' : 'en');
  };

  useEffect(() => {
    setActiveLocale(locale);
    document.documentElement.lang = locale === 'my' ? 'my' : 'en';
    document.documentElement.classList.toggle('locale-my', locale === 'my');
    // Notify observers of dimension changes
    window.dispatchEvent(new Event('resize'));
  }, [locale]);

  const translate = (key: TranslationKey, params?: Record<string, string | number>): string => {
    if (params) {
      return enFormat(key, params);
    }
    return enT(key);
  };

  return (
    <LocaleContext.Provider
      value={{
        locale,
        setLocale,
        toggleLocale,
        t: translate,
        format: enFormat,
        glossary: enGlossary,
        isReviewMode,
      }}
    >
      <div key={locale} className="contents">
        {children}
      </div>
    </LocaleContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useLocale() {
  return useContext(LocaleContext);
}
