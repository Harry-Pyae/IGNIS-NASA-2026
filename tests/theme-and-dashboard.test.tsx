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
    // Navigation items
    expect(markup).toContain('Mission Intelligence');
    expect(markup).toContain('Scenario Console');
    expect(markup).toContain('Research Library');
    expect(markup).toContain('Compare Tests');
    expect(markup).toContain('Methods &amp; Models');
    expect(markup).toContain('NASA Sources');
    // Telemetry items
    expect(markup).toContain('Oxygen Conc.');
    expect(markup).toContain('Cabin Pressure');
    expect(markup).toContain('Forced Airflow');
    expect(markup).toContain('Gravity Field');
    // Dense glass card backing for readability
    expect(markup).toContain('glass-dense-card');
    // Mobile responsive container
    expect(markup).toContain('NASA Experiments Mobile Cards');
    expect(markup).toContain('NASA Experiments Table');
    // Provenance
    expect(markup).toContain('NASA Glenn Provenance');
  });
});
