import { useSyncExternalStore } from 'react';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'ignis-theme';

export function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'light';
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'light' || saved === 'dark') return saved;
  } catch {
    /* Storage unavailable or restricted. */
  }
  // Default to light mode as requested for the warm liquid glass visual identity
  return 'light';
}

let currentTheme: Theme = getInitialTheme();
const listeners = new Set<() => void>();

export function applyTheme(theme: Theme) {
  currentTheme = theme;
  if (typeof document !== 'undefined') {
    const root = document.documentElement;
    if (theme === 'light') {
      root.classList.add('light');
      root.setAttribute('data-theme', 'light');
    } else {
      root.classList.remove('light');
      root.setAttribute('data-theme', 'dark');
    }
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      /* Storage unavailable or restricted. */
    }
  }
  listeners.forEach((listener) => listener());
}

export function toggleTheme(): Theme {
  const next = currentTheme === 'light' ? 'dark' : 'light';
  applyTheme(next);
  return next;
}

export function useTheme(): { theme: Theme; toggle: () => Theme; set: (t: Theme) => void } {
  const theme = useSyncExternalStore(
    (onStoreChange) => {
      listeners.add(onStoreChange);
      return () => listeners.delete(onStoreChange);
    },
    () => currentTheme,
    (): Theme => 'light',
  );

  return {
    theme,
    toggle: toggleTheme,
    set: applyTheme,
  };
}

// Automatically apply theme on initial module evaluation
if (typeof document !== 'undefined') {
  applyTheme(currentTheme);
}
