import { useEffect, useRef, useState } from 'react';

/**
 * A short-lived "done" state for a button whose output is otherwise invisible (copy to clipboard): every press
 * shows it again, so a repeat tap visibly answers too. Returns [on, flash].
 */
export function useFlash(ms = 2000): [boolean, () => void] {
  const [on, setOn] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  return [on, () => {
    window.clearTimeout(timer.current);
    setOn(true);
    timer.current = window.setTimeout(() => setOn(false), ms);
  }];
}
