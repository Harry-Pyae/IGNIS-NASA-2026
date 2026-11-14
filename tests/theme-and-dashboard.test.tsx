import { describe, it, expect, beforeEach } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { getInitialTheme, toggleTheme, applyTheme } from '../src/lib/theme';
import { Dashboard } from '../src/pages/Dashboard';

describe('Warm Liquid Glass Theme & Dashboard', () => {
  beforeEach(() => {
    applyTheme('light');
  });

  it('initializes to light mode by default', () => {
    expect(getInitialTheme()).toBe('light');
  });

  it('toggles theme between light and dark', () => {
    applyTheme('light');
    expect(toggleTheme()).toBe('dark');
    expect(toggleTheme()).toBe('light');
  });

  it('renders the Dashboard with all core NASA intelligence sections', () => {
    const markup = renderToStaticMarkup(<Dashboard />);
    expect(markup).toContain('Aerospace Fire-Safety Intelligence');
    expect(markup).toContain('FLAME IN FREEFALL');
    expect(markup).toContain('Verified Test Runs');
    expect(markup).toContain('Active Campaigns');
    expect(markup).toContain('Closest Verified NASA Microgravity Match');
    expect(markup).toContain('IGNIS Refuses to Guess');
    expect(markup).toContain('Experiment Comparison');
  });
});
