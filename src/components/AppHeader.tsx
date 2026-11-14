import { useEffect, useRef, useState } from 'react';
import { useLocale } from '../context/LocaleContext';
import { useCatalogSummary } from '../lib/catalog';
import { useTheme } from '../lib/theme';
import { cx } from '../lib/cx';
import { ExportButton, ProvenancePill } from './CatalogStatus';

/** App shell header: brand mark + wordmark (left), live provenance pill + export + theme (right). */
export function AppHeader() {
  const { theme, toggle: toggleTheme } = useTheme();
  const { locale, setLocale } = useLocale();
  const isMy = locale === 'my';
  const { summary, retry } = useCatalogSummary();
  const [hash, setHash] = useState(() => (typeof window !== 'undefined' ? window.location.hash : ''));

  useEffect(() => {
    const update = () => setHash(window.location.hash);
    window.addEventListener('hashchange', update);
    return () => window.removeEventListener('hashchange', update);
  }, []);

  const header = useRef<HTMLElement>(null);
  // --header-h: sticky blocks and scroll targets sit below this sticky header at every width.
  useEffect(() => {
    const el = header.current;
    if (!el) return;
    const set = () => {
      document.documentElement.style.setProperty('--header-h', `${el.offsetHeight}px`);
    };
    set();
    const observer = new ResizeObserver(set);
    observer.observe(el);
    return () => observer.disconnect();
  }, [locale, theme]);

  const navItems = isMy
    ? [
        ['/', 'ပင်မ'],
        ['/dashboard', 'ဒက်ရှ်ဘုတ်'],
        ['/#console', 'ဇာတ်လမ်း'],
        ['/library', 'မှတ်တမ်းများ'],
        ['/compare', 'နှိုင်းယှဉ်ချက်'],
        ['/methods', 'နည်းလမ်း'],
        ['/sources', 'ရင်းမြစ်များ'],
      ] as const
    : [
        ['/', 'Home'],
        ['/dashboard', 'Dashboard'],
        ['/#console', 'Scenario'],
        ['/library', 'Library'],
        ['/compare', 'Compare'],
        ['/methods', 'Methods'],
        ['/sources', 'Sources'],
      ] as const;

  return (
    <header ref={header} className="app-header sticky top-0 z-40 transition-colors duration-200">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4 sm:gap-4 sm:px-6">
        <a href="/" className="flex shrink-0 items-center gap-2.5" aria-label="IGNIS home">
          {/* Interim brand mark: 64px derivative of /art/logo-flame.webp (master untouched). One <img>, never a CSS background. */}
          <img src="/art/logo-flame-64.webp" width={30} height={30} alt="" aria-hidden className="size-[30px] rounded-full" />
          <span className="text-[17px] font-bold tracking-[0.18em]">IGNIS</span>
          <span className="console-label hidden text-dim lg:inline">
            {isMy ? 'စမ်းသပ်မှတ်တမ်း ရှာဖွေရေး' : 'Mission console'}
          </span>
        </a>

        <div className="ml-auto flex min-w-0 items-center gap-2">
          {/* Provenance strip (§8.1 item 0). Coder B expands it into the campaign/source panel. */}
          <ProvenancePill summary={summary} retry={retry} />
          {/* §8.1 item 6: the verified-only open dataset (/api/export). */}
          <ExportButton summary={summary} label={isMy ? 'ဒေတာ ထုတ်ယူရန်' : 'Export dataset'} compact variant="primary" />
        </div>
      </div>

      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-4 gap-y-2.5 px-4 pb-3 sm:px-6">
        <nav aria-label="Project navigation" className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
          {navItems.map(([url, label]) => {
            const path = typeof window !== 'undefined' ? window.location.pathname.replace(/\/$/, '') || '/' : '/';
            const inScenario = path === '/' && /^#(console|s[1-5]|experiment-.+)$/.test(hash);
            const current =
              url === '/#console'
                ? inScenario
                : (path === url && !inScenario) || (url === '/library' && path.startsWith('/library/'));
            return (
              <a
                key={url}
                href={url}
                aria-current={current ? 'page' : undefined}
                className={cx(
                  'transition-colors py-0.5',
                  current ? 'text-amber underline underline-offset-4 font-medium' : 'text-dim hover:text-text'
                )}
              >
                {label}
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          {/* Language Switcher */}
          <div className="inline-flex items-center rounded-lg border border-border bg-panel/80 p-0.5 text-xs font-medium">
            <button
              type="button"
              onClick={() => setLocale('en')}
              aria-label="Switch to English"
              className={cx(
                'px-2.5 py-1 rounded-md transition-colors',
                locale === 'en'
                  ? 'bg-amber/15 text-amber font-semibold shadow-xs'
                  : 'text-dim hover:text-text'
              )}
            >
              English
            </button>
            <button
              type="button"
              onClick={() => setLocale('my')}
              aria-label="မြန်မာဘာသာသို့ ပြောင်းရန်"
              className={cx(
                'px-2.5 py-1 rounded-md transition-colors',
                locale === 'my'
                  ? 'bg-amber/15 text-amber font-semibold shadow-xs'
                  : 'text-dim hover:text-text'
              )}
            >
              မြန်မာ
            </button>
          </div>

          {/* Theme switcher toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={isMy ? (theme === 'light' ? 'အမှောင် မုဒ်သို့ ပြောင်းရန်' : 'အလင်း မုဒ်သို့ ပြောင်းရန်') : `Switch to ${theme === 'light' ? 'Dark Space' : 'Warm Liquid Glass'} mode`}
            className="flex items-center gap-1.5 rounded-full border border-orange-500/20 bg-white/70 dark:bg-black/30 px-2.5 py-1 text-xs font-mono text-dim transition-all hover:border-amber hover:text-amber"
          >
            {isMy ? (
              <span>{theme === 'light' ? '☀️ အလင်း' : '🌙 အမှောင်'}</span>
            ) : (
              <span>{theme === 'light' ? '☀️ Light' : '🌙 Dark'}</span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
