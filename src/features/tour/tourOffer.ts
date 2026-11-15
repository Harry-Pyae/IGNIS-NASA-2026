/**
 * The tour offer is shown once per browser: never again after it was shown, dismissed or completed, and never to a
 * returning visitor (one who already dismissed the older first-visit note). Blocked storage = no offer, so it can't
 * reappear on every visit; the tour stays one click away in Help either way.
 */
export const TOUR_OFFER_KEY = 'ignis-tour-offered';
const LEGACY_INTRO_KEY = 'ignis-scenario-intro-dismissed';
/** /?tour=1#console (Help → "Replay the tour") starts the tour directly. */
export const TOUR_PARAM = 'tour';

type Store = Pick<Storage, 'getItem' | 'setItem'>;
const local = (): Store => window.localStorage;

export function shouldOfferTour(store: () => Store = local): boolean {
  try {
    const s = store();
    return s.getItem(TOUR_OFFER_KEY) === null && s.getItem(LEGACY_INTRO_KEY) === null;
  } catch {
    return false;
  }
}

export function markTourOffered(store: () => Store = local) {
  try {
    store().setItem(TOUR_OFFER_KEY, '1');
  } catch { /* Storage blocked: shouldOfferTour already said no. */ }
}

/** A replay link (Help → "Replay the tour"): read on mount, then dropTourReplay() so a reload doesn't restart it. */
export const wantsTourReplay = () => new URLSearchParams(window.location.search).has(TOUR_PARAM);
export function dropTourReplay() {
  if (!wantsTourReplay()) return;
  const url = new URL(window.location.href);
  if (!url.searchParams.has(TOUR_PARAM)) return;
  url.searchParams.delete(TOUR_PARAM);
  history.replaceState(history.state, '', url);
}
