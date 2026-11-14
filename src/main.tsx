import { lazy, StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { AppHeader } from './components/AppHeader';
import { NotFound } from './pages/NotFound';
import { Home } from './pages/Home';
import './styles/index.css';

// Internal pages load on demand so the landing bundle stays small (LCP).
const Curate = lazy(() => import('./pages/Curate').then((m) => ({ default: m.Curate })));
const Kit = lazy(() => import('./pages/Kit').then((m) => ({ default: m.Kit })));
const Methods = lazy(() => import('./pages/Methods').then(m => ({default:m.Methods})));
const Sources = lazy(() => import('./pages/Sources').then(m => ({default:m.Sources})));

// ponytail: pathname switch, no router — add react-router if Coder B needs nested routes.
const ROUTES: Record<string, () => React.JSX.Element> = {
  '/': Home,
  '/methods': () => <Methods />,
  '/sources': () => <Sources />,
  '/curate': () => <Curate />,
  '/kit': () => <Kit />,
};
const path = window.location.pathname.replace(/\/$/, '') || '/';
const Page = ROUTES[path] ?? NotFound;
const title = path === '/methods' ? 'Methods' : path === '/sources' ? 'Source bibliography' : Page === NotFound ? 'Page not found' : null;
if (title) document.title = title + ' · IGNIS';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* App ambient background (bg-glow art) — replaces CSS aurora/starfield layers. */}
    <div className="ambient" aria-hidden />
    <AppHeader />
    <Suspense fallback={<main role="status" aria-busy="true" className="mx-auto max-w-4xl px-4 py-12 text-dim">Loading page…</main>}>
      <Page />
    </Suspense>
  </StrictMode>,
);
