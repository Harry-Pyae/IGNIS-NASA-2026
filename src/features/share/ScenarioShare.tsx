import { useState } from 'react';
import { Button } from '../../components/ui';
import type { ResolvedScenario } from '../../lib/types';
import { useFlash } from '../../lib/useFlash';
import { t } from '../../i18n';
import { encodeShare, SHARE_PARAM } from './shareLink';
import type { useScenarioShare } from './useScenarioShare';
export function ShareBanner({ share }: { share: ReturnType<typeof useScenarioShare> }) {
  const { invalid, status } = share;
  if (!invalid && !status) return null;
  return <div role="status" className="my-3 rounded-xl border border-border p-4 text-sm">
    {invalid && <p>Can’t read this link. Confirm a scenario to create a new share link.</p>}
    {status?.state === 'loading' && <p>Checking the shared scenario against the verified catalog…</p>}
    {status?.state === 'unavailable' && <p>The verified catalog is unavailable. Shared matches cannot be checked yet.</p>}
    {status?.state === 'current' && <p>Shared scenario is current with catalog.</p>}
    {status?.state === 'updated' && <>
      <p>{!status.added.length && !status.dropped.length && !status.changed?.length
        ? 'The catalog changed since this link was made, but this scenario finds the same records.'
        : 'The catalog changed since this link was made.'}</p>
      <ul className="mt-2 break-words">
        <li>Added IDs · {status.added.join(', ') || 'None'}</li>
        <li>Dropped IDs · {status.dropped.join(', ') || 'None'}</li>
        <li>Cited cards updated since · {status.changed == null ? 'not recorded in this older link' : status.changed.join(', ') || 'None'}</li>
      </ul>
      <p className="mt-2 text-dim">The earlier result can’t be rebuilt exactly; these are today’s verified records.</p>
    </>}
  </div>;
}

export function CopyShareLink({ scenario, revision, rankedIds, versions }: {
  scenario: ResolvedScenario;
  /** A8: ranked card id → updated_at, so a reopened link can name cited cards that changed. */
  versions?: Record<string, string>;
  revision: string;
  rankedIds: string[];
}) {
  const [message, setMessage] = useState('');
  const [copied, flash] = useFlash();
  async function copy() {
    try {
      const url = new URL('/', window.location.origin);
      url.searchParams.set(SHARE_PARAM, encodeShare(scenario, revision, rankedIds, versions));
      url.hash = 'console';
      await navigator.clipboard.writeText(url.href);
      setMessage('Share link copied.');
      flash();
    } catch {
      setMessage('Could not copy the share link.');
    }
  }
  return <div className="my-3 flex flex-wrap items-center gap-2">
    <Button size="sm" className="min-w-36" onClick={() => void copy()}>{copied ? `✓ ${t('copied')}` : 'Copy share link'}</Button>
    <span role="status" className="text-sm text-dim">{message}</span>
  </div>;
}
