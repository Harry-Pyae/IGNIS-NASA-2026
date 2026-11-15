import { Button, buttonClass, tapLink, textLink } from '../components/ui';
import { useVerifiedCatalog } from '../lib/catalog';
import { MISSION_CASE, missionEntry } from '../engine/mission';
import { COPY } from '../lib/copy';
import { t } from '../i18n';
import { requestGuidedMission } from './consoleLoader';
import { WalkthroughButton } from '../features/walkthrough/Walkthrough';
import { TOUR_PARAM } from '../features/tour/tourOffer';

export function MissionActions({ explore }: { explore: () => void }) {
  return <>
    <div className="flex flex-wrap items-center gap-3">
      {MISSION_CASE && <MissionStartControl />}
      {/* Round 9 (C-3): the 60-second case is the first action; the guided mission takes over once a case is reviewed. */}
      <a className={buttonClass(MISSION_CASE ? 'secondary' : 'primary', 'lg', MISSION_CASE ? undefined : 'anim-glow')} href="/case">{COPY.landingCta.case}</a>
      <Button variant="ghost" size="lg" iconRight="arrow-right" onClick={explore}>{COPY.landingCta.explore}</Button>
    </div>
    {!MISSION_CASE && <p className="mt-3 max-w-lg text-[14px] leading-snug text-dim">{COPY.missionAvailability}</p>}
    {/* Supporting links, never CTAs: the walkthrough (absent until its video ships, src/lib/walkthrough.ts) and the
        first-visit tour re-entry (?tour=1 opens it once, then drops the param). */}
    <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-[14px]">
      <WalkthroughButton variant="tertiary" />
      <a className={`${textLink} ${tapLink}`} href={`/?${TOUR_PARAM}=1#console`}>{t('tourTakeGuided')}</a>
    </div>
  </>;
}

function MissionStartControl() {
  const { catalog } = useVerifiedCatalog();
  const entry = catalog.state === 'ready' || catalog.state === 'empty'
    ? missionEntry(catalog.state === 'ready' ? catalog.experiments : [])
    : null;
  if (entry?.state === 'available') {
    return <Button variant="primary" size="lg" icon="play" glow onClick={() => requestGuidedMission(entry.case.preset_id)}>{COPY.landingCta.mission}</Button>;
  }
  return <p role="status" className="max-w-lg text-[14px] leading-snug text-dim">{entry?.state === 'unavailable' ? entry.message : catalog.state === 'loading' ? t('catalogConnecting') : t('matchCatalogUnavailable')}</p>;
}
