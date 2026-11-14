import { useCatalogSummary } from '../lib/catalog';
import { useEffect, useState } from 'react';
import { useTheme } from '../lib/theme';
import { ExportButton, ProvenancePill } from './CatalogStatus';

/** App shell header: brand mark + wordmark (left), live provenance pill + export + theme (right). */
export function AppHeader() {
  const { theme, toggle: toggleTheme } = useTheme();
  const { summary, retry } = useCatalogSummary();
  const [hash, setHash] = useState(() => window.location.hash);
  useEffect(() => {
    const update = () => setHash(window.location.hash);
    window.addEventListener('hashchange', update);
    return () => window.removeEventListener('hashchange', update);
  }, []);
  return (
    <header className="app-header sticky top-0 z-40">
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
          <ExportButton summary={summary} label="Export dataset" compact />

          {/* Theme switcher toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'Dark Space' : 'Warm Liquid Glass'} mode`}
            className="flex items-center gap-1.5 rounded-full border border-orange-500/20 bg-white/70 dark:bg-black/30 px-2.5 py-1 text-xs font-mono text-dim transition-all hover:border-amber hover:text-amber"
          >
            <span>{theme === 'light' ? '☀️ Light' : '🌙 Dark'}</span>
          </button>
        </div>
      </div>
      <nav aria-label="Project navigation" className="mx-auto flex max-w-6xl flex-wrap gap-x-5 gap-y-3 px-4 pb-3 text-sm sm:px-6">
        {([['/', 'Home'], ['/dashboard', 'Dashboard'], ['/#console', 'Scenario'], ['/library', 'Library'], ['/compare', 'Compare'], ['/methods', 'Methods'], ['/sources', 'Sources']] as const).map(([url,label]) => {
          const path = window.location.pathname.replace(/\/$/, '') || '/';
          const inScenario = path === '/' && /^#(console|s[1-5]|experiment-.+)$/.test(hash);
          const current = url === '/#console' ? inScenario
            : (path === url && !inScenario) || (url === '/library' && path.startsWith('/library/'));
          return <a key={url} href={url} aria-current={current ? 'page' : undefined} className={current ? 'text-amber underline underline-offset-4' : 'text-dim hover:text-text'}>{label}</a>;
        })}
      </nav>
    </header>
  );
}
