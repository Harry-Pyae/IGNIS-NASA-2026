import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { BURMESE } from '../i18n/burmese';
import { t as enT, type TranslationKey } from '../i18n/index';

export type AppLocale = 'en' | 'my';

interface LocaleContextValue {
  locale: AppLocale;
  setLocale: (locale: AppLocale) => void;
  toggleLocale: () => void;
  t: (key: TranslationKey, params?: Record<string, string | number>) => string;
  isReviewMode: boolean;
}

const LocaleContext = createContext<LocaleContextValue>({
  locale: 'en',
  setLocale: () => {},
  toggleLocale: () => {},
  t: (key) => enT(key),
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
    if (stored === 'my' || stored === 'en') return stored;
    return isReviewMode ? 'my' : 'en';
  });

  const setLocale = (next: AppLocale) => {
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
    document.documentElement.lang = locale === 'my' ? 'my' : 'en';
    document.documentElement.classList.toggle('locale-my', locale === 'my');
    // Notify any header height observer that language switch may change header dimensions
    window.dispatchEvent(new Event('resize'));
  }, [locale]);

  const translate = (key: TranslationKey, params?: Record<string, string | number>): string => {
    let str = locale === 'my' ? (BURMESE[key] ?? enT(key)) : enT(key);
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        str = str.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
      }
    }
    return str;
  };

  return (
    <LocaleContext.Provider value={{ locale, setLocale, toggleLocale, t: translate, isReviewMode }}>
      {children}
    </LocaleContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useLocale() {
  return useContext(LocaleContext);
}
