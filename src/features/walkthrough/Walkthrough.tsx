import { useRef } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '../../components/ui';
import type { ButtonSize, ButtonVariant } from '../../components/ui';
import { COPY } from '../../lib/copy';
import { WALKTHROUGH, walkthroughLabelSeconds, type Walkthrough } from '../../lib/walkthrough';
import { t } from '../../i18n';

/**
 * "Watch the N-second walkthrough": opens the local MP4 in a native modal <dialog> (focus stays inside, Escape closes,
 * focus returns to the button). Poster frame, manual play only, captions burned in. Absent while WALKTHROUGH is null.
 */
export function WalkthroughButton({ variant = 'secondary', size = 'md', short, onOpen, returnFocus, video = WALKTHROUGH }: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** "Watch the walkthrough" without the length (tight spots). */
  short?: boolean;
  /** Runs before the dialog opens (the tour closes itself first). */
  onOpen?: () => void;
  /** Where focus goes on close when the button itself is gone (inside the closed tour). */
  returnFocus?: () => HTMLElement | null;
  video?: Walkthrough | null;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement | null>(null);
  if (!video) return null;
  const close = () => dialog.current?.close();
  return <>
    <Button variant={variant} size={size} icon="play" onClick={(event) => {
      trigger.current = event.currentTarget;
      onOpen?.();
      dialog.current?.showModal();
    }}>{short ? t('walkthroughShort') : COPY.plain.walkthrough.label(walkthroughLabelSeconds(video))}</Button>
    {/* On <body>: opened from inside the tour, it must not live in the tour dialog that closes. */}
    {createPortal(<dialog ref={dialog} aria-labelledby="walkthrough-title" aria-describedby="walkthrough-note"
      className="walkthrough-dialog m-auto w-[min(960px,calc(100vw-32px))] max-w-none rounded-panel border border-border bg-bg p-0 text-text"
      onClose={() => {
        dialog.current?.querySelector('video')?.pause();
        const back = returnFocus?.() ?? trigger.current;
        if (back?.isConnected) back.focus({ preventScroll: true });
      }}
      onClick={(event) => { if (event.target === dialog.current) close(); }}>
      <div className="flex items-center gap-3 border-b border-border px-4 py-3">
        <h2 id="walkthrough-title" className="min-w-0 flex-1 text-base font-semibold">{t('walkthroughTitle')}</h2>
        <Button size="sm" icon="close" onClick={close}>{t('walkthroughClose')}</Button>
      </div>
      {/* Manual play only: no autoplay, preload metadata so the poster shows without downloading the file. */}
      <video src={video.src} poster={video.poster} controls playsInline preload="metadata" className="block aspect-video w-full bg-black" />
      <p id="walkthrough-note" className="px-4 py-3 text-sm text-dim">{t('walkthroughCaptioned')}</p>
    </dialog>, document.body)}
  </>;
}

/** Help: the walkthrough's caption lines as plain text, with the revision it was recorded on. */
export function WalkthroughTranscript({ video = WALKTHROUGH }: { video?: Walkthrough | null }) {
  if (!video) return null;
  return <details className="mt-3">
    <summary className="cursor-pointer text-amber">{t('walkthroughTranscript')}</summary>
    <ol className="mt-2 grid gap-1 text-dim">{video.transcript.map((line, i) => <li key={i}>{line}</li>)}</ol>
    <p className="mt-2 text-sm text-faint">{COPY.plain.walkthrough.recordedOn(video.catalogRevision.slice(0, 8))}</p>
  </details>;
}
