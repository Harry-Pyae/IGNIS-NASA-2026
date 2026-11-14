import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { Fit, MonoLabel, panel, Rise, Value } from '../components/common';
import { C, easeInOut, MONO, monoLabel, OUTCOME, SANS } from '../theme';
import type { EvidenceCard, VideoData } from '../types';

function Card({ c, labels }: { c: EvidenceCard; labels: VideoData['labels'] }) {
  return (
    <div style={{ ...panel, flex: '1 1 0', minWidth: 0, padding: 26, display: 'flex', flexDirection: 'column', gap: 14 }}>
      {c.still && (
        <div style={{ position: 'relative' }}>
          <Img src={staticFile(c.still)} style={{ width: '100%', height: 170, objectFit: 'cover', borderRadius: 10, display: 'block' }} />
          <div style={{ position: 'absolute', left: 8, bottom: 8, ...monoLabel, fontSize: 15, color: C.text, background: `${C.bg}cc`, padding: '3px 8px', borderRadius: 6 }}>
            {labels.campaignContext}
          </div>
        </div>
      )}
      <div style={{ fontFamily: MONO, fontSize: 20, color: C.amber, wordBreak: 'break-word' }}>{c.id}</div>
      <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 30, lineHeight: 1.2, color: C.text }}>{c.material}</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', columnGap: 18, rowGap: 6, fontSize: 21 }}>
        {c.rows.map((r, i) => [
          <span key={`l${i}`} style={{ fontFamily: MONO, color: C.dim }}>{r.label}</span>,
          <span key={`v${i}`} style={{ wordBreak: 'break-word' }}><Value v={r.value} notReported={labels.notReported} /></span>,
        ])}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontFamily: MONO, fontSize: 21, color: C.text }}>
        <span style={{ width: 14, height: 14, borderRadius: 7, background: OUTCOME[c.outcome], flex: 'none' }} />
        {c.outcomeLabel}
      </div>
      <div style={{ fontFamily: MONO, fontSize: 17, color: C.faint }}>
        {labels.verifiedBy} {c.verifiedBy}
      </div>
    </div>
  );
}

/** Three verified cards, then a zoom into one source: quote → locator → source ID. Short cuts skip the zoom. */
export function Evidence({ d, labels }: { d: VideoData['evidence']; labels: VideoData['labels'] }) {
  const f = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();
  const showQuote = durationInFrames >= 8 * fps;
  const q = Math.round(durationInFrames * 0.5);
  const zoom = showQuote ? interpolate(f, [q, q + 20], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easeInOut }) : 0;

  return (
    <AbsoluteFill style={{ padding: '120px 90px 190px' }}>
      <Fit style={{ flex: 1 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 34 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 60, opacity: 1 - zoom * 0.85 }}>
        <Rise>
          <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 52, color: C.text, maxWidth: 820, lineHeight: 1.15 }}>{d.heading}</div>
          <div style={{ display: 'flex', gap: 40, marginTop: 18, flexWrap: 'wrap' }}>
            {d.stats.map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                <span style={{ fontFamily: MONO, fontSize: 36, color: C.amber }}>{s.value}</span>
                <MonoLabel size={18}>{s.label}</MonoLabel>
              </div>
            ))}
          </div>
        </Rise>
        <Rise at={6}>
          <div style={{ ...panel, padding: '16px 22px', maxWidth: 700 }}>
            <MonoLabel size={16} color={C.amber}>{labels.scenario}</MonoLabel>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 24px', marginTop: 8, fontSize: 21 }}>
              {d.scenario.map((s, i) => (
                <span key={i}>
                  <span style={{ fontFamily: MONO, color: C.dim }}>{s.label} </span>
                  <Value v={s.value} notReported={labels.notReported} />
                </span>
              ))}
            </div>
          </div>
        </Rise>
      </div>

      <div style={{ display: 'flex', gap: 30, justifyContent: 'center', alignItems: 'flex-start', transformOrigin: '15% 30%', transform: `scale(${1 + zoom * 0.5})`, opacity: 1 - zoom * 0.92 }}>
        {d.cards.map((c, i) => (
          <Rise key={i} at={14 + i * 6} style={{ flex: '1 1 0', minWidth: 0, display: 'flex' }}>
            <Card c={c} labels={labels} />
          </Rise>
        ))}
      </div>
      </div>
      </Fit>

      {showQuote && f >= q && (
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', padding: '80px 160px 200px' }}>
          <div style={{ ...panel, borderLeft: `4px solid ${C.amber}`, padding: '44px 54px', maxWidth: 1500, opacity: zoom, transform: `scale(${0.96 + zoom * 0.04})` }}>
            <div style={{ fontFamily: SANS, fontSize: 40, lineHeight: 1.4, color: C.text }}>“{d.quote.text}”</div>
            <Rise at={q + 26}>
              <div style={{ fontFamily: MONO, fontSize: 24, color: C.dim, marginTop: 26 }}>{d.quote.locator}</div>
            </Rise>
            <Rise at={q + 44}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 28px', marginTop: 12, fontFamily: MONO, fontSize: 24 }}>
                <span style={{ color: C.amber }}>{d.quote.sourceId}</span>
                <span style={{ color: C.blue, wordBreak: 'break-all' }}>{d.quote.url}</span>
              </div>
            </Rise>
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
}
