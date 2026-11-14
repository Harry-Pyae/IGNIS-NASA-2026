import { Button } from '../components/ui';
import { useVerifiedCatalog } from '../lib/catalog';
import { MISSION_CASE, missionEntry } from '../engine/mission';
import { COPY } from '../lib/copy';
import { t } from '../i18n';
import { requestGuidedMission } from './consoleLoader';

export function MissionActions({ explore }: { explore: () => void }) {
  return <>
    <div className="flex flex-wrap items-center gap-3">
      {MISSION_CASE && <MissionStartControl />}
      <Button variant={MISSION_CASE ? 'ghost' : 'primary'} size="lg" iconRight="arrow-right" glow={!MISSION_CASE} onClick={explore}>{COPY.landingCta.explore}</Button>
    </div>
    {!MISSION_CASE && <p className="mt-3 max-w-lg text-[14px] leading-snug text-dim">{COPY.missionAvailability}</p>}
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
