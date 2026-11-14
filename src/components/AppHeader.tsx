import { useEffect, useRef, useState } from 'react';
import { useCatalogSummary } from '../lib/catalog';
import { ExportButton, ProvenancePill } from './CatalogStatus';

function applyTheme(choice: 'dark' | 'light') {
  document.documentElement.dataset.theme = choice;
  document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')
    ?.setAttribute('content', choice === 'light' ? '#ffffff' : '#0C0F16');
  try {
    localStorage.setItem('ignis-theme', choice);
  } catch {
    // The current document can still switch themes with storage disabled.
  }
}

function ThemeControl() {
  const [theme, setTheme] = useState(() =>
    document.documentElement.dataset.theme === 'light' ? 'light' : 'dark',
  );

  return (
    <fieldset className="theme-control ml-auto flex shrink-0 items-center rounded-lg border border-control-border bg-panel p-0.5">
      <legend className="sr-only">Color theme</legend>
      {(['dark', 'light'] as const).map((choice) => (
        <label key={choice} className="cursor-pointer">
          <input
            className="sr-only"
            type="radio"
            name="color-theme"
            value={choice}
            checked={theme === choice}
            onChange={() => {
              applyTheme(choice);
              setTheme(choice);
            }}
          />
          <span className="block w-10 rounded-md py-1 text-center text-xs leading-4 sm:w-11">{choice === 'dark' ? 'Dark' : 'Light'}</span>
        </label>
      ))}
    </fieldset>
  );
}

/** App shell header: brand mark + wordmark (left), live provenance pill + export (right). */
export function AppHeader() {
  const { summary, retry } = useCatalogSummary();
  const header = useRef<HTMLElement>(null);
  // --header-h: sticky blocks and scroll targets sit below this sticky header at every width.
  useEffect(() => {
    const el = header.current;
    if (!el) return;
    const set = () => document.documentElement.style.setProperty('--header-h', `${el.offsetHeight}px`);
    set();
    const observer = new ResizeObserver(set);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return (
    <header ref={header} className="app-header sticky top-0 z-40">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4 sm:gap-4 sm:px-6">
        <a href="/" className="flex shrink-0 items-center gap-2.5" aria-label="IGNIS home">
          {/* Interim brand mark: 64px derivative of /art/logo-flame.webp (master untouched). One <img>, never a CSS background. */}
          <img src="/art/logo-flame-64.webp" width={30} height={30} alt="" aria-hidden className="size-[30px] rounded-full" />
          <span className="text-[17px] font-bold tracking-[0.18em]">IGNIS</span>
          <span className="console-label hidden text-dim lg:inline">Mission console</span>
        </a>

        <div className="ml-auto flex min-w-0 items-center gap-2">
          {/* Provenance strip (§8.1 item 0). Coder B expands it into the campaign/source panel. */}
          <ProvenancePill summary={summary} retry={retry} />
          {/* §8.1 item 6: the verified-only open dataset (/api/export). */}
          <ExportButton summary={summary} label="Export dataset" compact variant="primary" />
        </div>
      </div>
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-1 gap-y-1 px-4 pb-2 sm:gap-x-2 sm:px-6">
        <nav aria-label="Project navigation" className="flex flex-wrap gap-x-2.5 text-sm sm:gap-x-5">
          {([['/', 'Console'], ['/library', 'Library'], ['/methods', 'Methods'], ['/sources', 'Sources']] as const).map(([url,label]) => {
            const path = window.location.pathname.replace(/\/$/, '') || '/';
            const current = url === '/' ? path === '/' : path === url || path.startsWith(url + '/');
            return <a key={url} href={url} aria-current={current ? 'page' : undefined} className={current ? 'text-amber underline underline-offset-4' : 'text-dim hover:text-text'}>{label}</a>;
          })}
        </nav>
        <ThemeControl />
      </div>
    </header>
  );
}
