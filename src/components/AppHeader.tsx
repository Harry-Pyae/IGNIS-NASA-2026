import { useEffect, useRef, useState } from 'react';
import { useCatalogSummary } from '../lib/catalog';
import { ExportButton, ProvenancePill } from './CatalogStatus';
import { Icon } from './ui/Icon';

const navigation = [
  ['/', 'Console', 'dashboard'],
  ['/library', 'Library', 'book'],
  ['/methods', 'Methods', 'checklist'],
  ['/sources', 'Sources', 'citation'],
] as const;

function applyTheme(choice: 'dark' | 'light') {
  document.documentElement.dataset.theme = choice;
  document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')
    ?.setAttribute('content', choice === 'light' ? '#FFEAD4' : '#0C0F16');
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
    <fieldset className="theme-control bubble-control ml-auto flex shrink-0 items-center rounded-lg border border-control-border bg-panel p-0.5">
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
          <span className="flex w-16 items-center justify-center gap-1 rounded-md py-1 text-xs leading-4">
            <Icon name={choice === 'dark' ? 'moon' : 'sun'} size={14} />
            {choice === 'dark' ? 'Dark' : 'Light'}
          </span>
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
  useEffect(() => {
    if (!document.referrer || !matchMedia('(prefers-reduced-motion: no-preference)').matches) return;
    const previous = new URL(document.referrer);
    if (previous.origin !== window.location.origin) return;
    const tabs = [...(header.current?.querySelectorAll<HTMLAnchorElement>('.project-tab') ?? [])];
    const from = tabs.find((tab) => {
      const path = new URL(tab.href).pathname;
      return previous.pathname === path || (path !== '/' && previous.pathname.startsWith(path + '/'));
    })?.querySelector('span');
    const to = tabs.find((tab) => tab.getAttribute('aria-current') === 'page')?.querySelector('span');
    if (!from || !to || from === to) return;
    const start = from.getBoundingClientRect();
    const end = to.getBoundingClientRect();
    const animation = to.animate(
      [{ '--tab-offset': `${start.left - end.left}px` }, { '--tab-offset': '0px' }],
      { duration: 200, easing: 'ease-out' },
    );
    return () => animation.cancel();
  }, []);
  return (
    <header ref={header} className="app-header sticky top-0 z-40">
      <div className="mx-auto flex min-h-16 max-w-6xl items-center gap-3 px-4 py-2 sm:gap-4 sm:px-6">
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
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-2 gap-y-1 px-4 pb-2 sm:px-6">
        <nav aria-label="Project navigation" className="grid w-full grid-cols-4 gap-1 text-sm sm:flex sm:w-auto sm:gap-5">
          {navigation.map(([url, label, icon]) => {
            const path = window.location.pathname.replace(/\/$/, '') || '/';
            const current = url === '/' ? path === '/' : path === url || path.startsWith(url + '/');
            return (
              <a key={url} href={url} aria-current={current ? 'page' : undefined}
                className={`project-tab flex min-h-11 flex-col items-center justify-center gap-0.5 rounded-sm sm:flex-row sm:gap-1.5 ${current ? 'text-amber' : 'text-dim hover:text-text'}`}>
                <Icon name={icon} size={18} />
                <span>{label}</span>
              </a>
            );
          })}
        </nav>
        <ThemeControl />
      </div>
    </header>
  );
}
