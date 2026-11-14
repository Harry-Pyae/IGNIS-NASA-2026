import { useEffect, useMemo, useRef, useState } from 'react';
import type { VerifiedCatalog } from '../../lib/catalog';
import type { ResolvedScenario } from '../../lib/types';
import { decodeShare, SHARE_PARAM, shareCatalogStatus } from './shareLink';

export function useScenarioShare(
  catalog: VerifiedCatalog,
  restore: (scenario: ResolvedScenario) => void,
) {
  const [incoming] = useState(() => {
    const values = new URLSearchParams(window.location.search).getAll(SHARE_PARAM);
    return { present: values.length > 0, link: values.length === 1 ? decodeShare(values[0] ?? '') : null };
  });
  const restored = useRef(false);
  useEffect(() => {
    if (!incoming.link || restored.current) return;
    restored.current = true;
    restore(incoming.link.scenario);
  }, [incoming, restore]);

  const status = useMemo(
    () => incoming.link ? shareCatalogStatus(incoming.link, catalog) : null,
    [incoming, catalog],
  );
  return { invalid: incoming.present && !incoming.link, status };
}
