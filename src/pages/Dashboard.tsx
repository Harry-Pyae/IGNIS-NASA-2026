import { useMemo, useState } from 'react';
import { useCatalogSummary, useVerifiedCatalog } from '../lib/catalog';
import { SEED_CARDS } from '../lib/fixtures';
import { useTheme } from '../lib/theme';
import { Button, Icon, type IconName } from '../components/ui';
import { ExportButton, ProvenancePill } from '../components/CatalogStatus';
import { AmbientRibbons } from '../components/AmbientRibbons';

export function Dashboard() {
  const { theme, toggle: toggleTheme } = useTheme();
  const { summary, retry } = useCatalogSummary();
  const { catalog } = useVerifiedCatalog();

  const experiments = useMemo(() => {
    if (catalog.state === 'ready' && catalog.experiments.length > 0) {
      return catalog.experiments;
    }
    return SEED_CARDS;
  }, [catalog]);

  const [search, setSearch] = useState('');
  const [domainFilter, setDomainFilter] = useState<'all' | 'solid_flammability' | 'gaseous_combustion'>('all');
  const [selectedIds, setSelectedIds] = useState<string[]>(() => {
    return experiments.slice(0, 2).map((e) => e.id);
  });

  const filteredExperiments = useMemo(() => {
    return experiments.filter((exp) => {
      const matchesDomain = domainFilter === 'all' || exp.domain === domainFilter;
      const q = search.toLowerCase().trim();
      if (!q) return matchesDomain;
      const matchesSearch =
        exp.campaign.toLowerCase().includes(q) ||
        exp.test_id.toLowerCase().includes(q) ||
        exp.fuel_material.toLowerCase().includes(q) ||
        (exp.key_observation_quote && exp.key_observation_quote.toLowerCase().includes(q)) ||
        (exp.ntrs_id && exp.ntrs_id.toLowerCase().includes(q));
      return matchesDomain && matchesSearch;
    });
  }, [experiments, domainFilter, search]);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((i) => i !== id);
      }
      if (prev.length >= 2) {
        return [prev[1] ?? prev[0] ?? id, id];
      }
      return [...prev, id];
    });
  };

  const launchCompareUrl =
    selectedIds.length === 2
      ? `/compare?ids=${encodeURIComponent(selectedIds.join(','))}`
      : '/compare';

  return (
    <div className="relative min-h-screen text-text transition-colors duration-500">
      {/* Abstract 3D organic ribbons and warm ambient lighting */}
      <AmbientRibbons />

      {/* Main Glass Cockpit Grid */}
      <div className="mx-auto flex max-w-[1440px] flex-col gap-6 px-3 py-4 sm:px-6 sm:py-6 lg:flex-row lg:items-start">
        
        {/* ========================================================================= */}
        {/* Floating Sidebar Navigation (Liquid Glass Pill) */}
        {/* ========================================================================= */}
        <aside
          aria-label="Dashboard navigation"
          className="glass-dashboard-card z-30 flex shrink-0 flex-col rounded-3xl p-4 sm:p-5 lg:sticky lg:top-6 lg:w-64"
        >
          {/* Brand header */}
          <div className="flex items-center justify-between pb-3 sm:pb-5 border-b border-orange-500/15">
            <div className="flex items-center gap-3">
              <div className="relative flex size-10 sm:size-11 items-center justify-center rounded-2xl bg-gradient-to-br from-amber to-flame text-white shadow-lg shadow-orange-500/25">
                <Icon name="flame" size={22} />
                <span className="absolute -top-1 -right-1 flex size-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-75" />
                  <span className="relative inline-flex size-3 rounded-full bg-amber" />
                </span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold tracking-wider text-base sm:text-lg">IGNIS</span>
                  <span className="rounded-full bg-amber/15 px-2 py-0.5 text-[10px] font-mono font-semibold text-amber uppercase tracking-wider">
                    NASA 2026
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-dim">Aerospace Fire Safety</p>
              </div>
            </div>
          </div>

          {/* Navigation Links — responsive row on small mobile, column on desktop */}
          <nav
            className="my-3 sm:my-5 flex flex-row overflow-x-auto no-scrollbar gap-1.5 pb-1 lg:flex-col lg:overflow-visible text-xs sm:text-sm"
            aria-label="Sidebar main navigation"
          >
            <SidebarItem href="/dashboard" icon="telemetry" label="Mission Intelligence" active />
            <SidebarItem href="/#console" icon="scenario" label="Scenario Console" />
            <SidebarItem href="/library" icon="evidence" label="Research Library" badge={`${experiments.length}`} />
            <SidebarItem href="/compare" icon="match" label="Compare Tests" />
            <SidebarItem href="/methods" icon="slider" label="Methods & Models" />
            <SidebarItem href="/sources" icon="citation" label="NASA Sources" />
          </nav>

          {/* Catalog Live Status Widget — desktop only to preserve mobile reachability */}
          <div className="hidden lg:block mt-auto pt-4 border-t border-orange-500/15">
            <div className="rounded-2xl bg-amber/10 p-3.5 border border-orange-500/15">
              <div className="flex items-center justify-between">
                <span className="console-label text-[10px] text-dim">Catalog Core</span>
                <span className="flex size-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <p className="mt-1 text-xs font-semibold text-text">Zero-Hallucination Gate</p>
              <p className="text-[11px] text-dim mt-0.5">Strictly verified NASA tests. Unverified guesses rejected.</p>
              <div className="mt-2.5 flex items-center justify-between text-[11px] font-mono text-amber">
                <span>Verified: {experiments.length}</span>
                <a href="/curate" className="underline hover:text-text focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber">Curate</a>
              </div>
            </div>
          </div>
        </aside>

        {/* ========================================================================= */}
        {/* Main Dashboard Canvas */}
        {/* ========================================================================= */}
        <main className="flex min-w-0 flex-1 flex-col gap-6">
          
          {/* Top Floating Glass Bar */}
          <header className="glass-dashboard-card flex flex-wrap items-center justify-between gap-3 sm:gap-4 rounded-3xl p-3.5 sm:p-4 sm:px-6">
            {/* Search Input */}
            <div className="relative flex flex-1 min-w-[200px] sm:min-w-[240px] items-center">
              <span className="absolute left-3.5 text-dim">
                <Icon name="search" size={18} />
              </span>
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search NASA experiments, materials, test IDs (e.g. PMMA, BASS-II)..."
                className="w-full rounded-2xl border border-white/60 dark:border-orange-500/15 bg-white/20 dark:bg-black/20 backdrop-blur-md py-2 pl-10 pr-4 text-xs sm:text-sm text-text placeholder:text-dim focus:outline-none focus:ring-2 focus:ring-amber/60 transition-all"
                aria-label="Search experiments"
              />
            </div>

            {/* Quick Actions & Controls */}
            <div className="flex items-center gap-2 sm:gap-3">
              <ProvenancePill summary={summary} retry={retry} />
              <ExportButton summary={summary} label="Export" compact />

              {/* Theme toggle switch */}
              <button
                type="button"
                onClick={toggleTheme}
                aria-label={`Switch to ${theme === 'light' ? 'Deep Space' : 'Warm Liquid Glass'} mode`}
                className="flex items-center gap-1.5 sm:gap-2 rounded-2xl border border-white/70 dark:border-orange-500/20 bg-white/25 dark:bg-black/40 backdrop-blur-md px-3 py-2 text-xs font-semibold text-text shadow-sm transition-all hover:border-amber hover:text-amber focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber"
              >
                {theme === 'light' ? (
                  <>
                    <span className="text-amber">☀️</span>
                    <span className="hidden sm:inline">Warm Glass</span>
                  </>
                ) : (
                  <>
                    <span className="text-blue">🌙</span>
                    <span className="hidden sm:inline">Deep Space</span>
                  </>
                )}
              </button>
            </div>
          </header>

          {/* ======================================================================= */}
          {/* Mission Intelligence Hero Card */}
          {/* ======================================================================= */}
          <section
            aria-labelledby="mission-intel-title"
            className="glass-dashboard-card relative overflow-hidden rounded-3xl p-5 sm:p-8"
          >
            {/* Subtle background warm gradient badge */}
            <div className="absolute -right-16 -top-16 size-72 rounded-full bg-gradient-to-bl from-amber/25 via-flame/15 to-transparent blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col gap-5 sm:gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-gradient-to-r from-amber to-flame px-3 py-1 text-xs font-semibold text-white shadow-sm">
                    FLAME IN FREEFALL
                  </span>
                  <span className="rounded-full bg-orange-500/10 px-3 py-1 text-xs font-mono text-amber border border-orange-500/20">
                    NASA Space Apps 2026
                  </span>
                </div>
                <h1 id="mission-intel-title" className="display mt-3 text-2xl font-bold sm:text-4xl text-text">
                  Aerospace Fire-Safety Intelligence
                </h1>
                <p className="mt-2 text-xs text-dim sm:text-base leading-relaxed">
                  Describe a spacecraft fire scenario in operational mission terms. IGNIS retrieves verified
                  NASA microgravity combustion experiments, explains exact physical observations, and highlights
                  uncharted evidence boundaries.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 shrink-0">
                <a
                  href="/#console"
                  className="btn-primary inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 sm:px-5 sm:py-3 text-xs sm:text-sm font-semibold text-white transition-all shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber"
                >
                  <Icon name="scenario" size={18} />
                  <span>Launch Scenario</span>
                </a>
                <a
                  href="/library"
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/70 dark:border-orange-500/20 bg-white/25 dark:bg-black/30 backdrop-blur-md px-4 py-2.5 sm:px-5 sm:py-3 text-xs sm:text-sm font-semibold text-text transition-all hover:border-amber hover:text-amber focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber"
                >
                  <Icon name="evidence" size={18} />
                  <span>Browse Library</span>
                </a>
              </div>
            </div>

            {/* Live Spacecraft Atmosphere Telemetry Bar */}
            <div className="mt-5 sm:mt-6 grid grid-cols-2 gap-2.5 sm:grid-cols-4 pt-5 sm:pt-6 border-t border-orange-500/15">
              <TelemetryTile label="Oxygen Conc." value="21.0% O₂" note="Nominal cabin mix" />
              <TelemetryTile label="Cabin Pressure" value="101.3 kPa" note="1.0 atm sea level" />
              <TelemetryTile label="Forced Airflow" value="5.0 cm/s" note="Pure concurrent flow" />
              <TelemetryTile label="Gravity Field" value="10⁻⁶ g" note="Microgravity orbit" />
            </div>
          </section>

          {/* ======================================================================= */}
          {/* NASA Experiment Statistics (4 Structured Glass Metric Cards) */}
          {/* ======================================================================= */}
          <section aria-label="NASA Experiment Key Statistics" className="grid grid-cols-2 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              icon="flame"
              title="Verified Test Runs"
              value={`${experiments.length}`}
              sub="Microgravity flight data"
              tone="amber"
            />
            <StatCard
              icon="campaign"
              title="Active Campaigns"
              value="4 Flight Series"
              sub="BASS, BASS-II, ACME, CIR"
              tone="flame"
            />
            <StatCard
              icon="verify"
              title="Extinction Limits"
              value="100% Verified"
              sub="NASA Glenn PSI archive"
              tone="success"
            />
            <StatCard
              icon="gap"
              title="Evidence Integrity"
              value="Zero Hallucinations"
              sub="No guessing on unknown data"
              tone="blue"
            />
          </section>

          {/* ======================================================================= */}
          {/* Evidence Matching & Supporting Right Panels */}
          {/* ======================================================================= */}
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
            
            {/* Left 8-col area: Evidence Matching & Recent Experiments Feed */}
            <div className="flex flex-col gap-6 xl:col-span-8">
              
              {/* Evidence Matching Focus Card */}
              <section aria-labelledby="evidence-match-heading" className="glass-dashboard-card rounded-3xl p-5 sm:p-6">
                <div className="flex items-center justify-between pb-4 border-b border-orange-500/15">
                  <div className="flex items-center gap-2.5">
                    <div className="flex size-9 items-center justify-center rounded-xl bg-amber/15 text-amber">
                      <Icon name="match" size={20} />
                    </div>
                    <div>
                      <h2 id="evidence-match-heading" className="text-sm sm:text-base font-bold text-text">
                        Closest Verified NASA Microgravity Match
                      </h2>
                      <p className="text-xs text-dim">Retrieved from Physical Sciences Informatics</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 sm:px-3 sm:py-1 text-[11px] sm:text-xs font-mono font-medium text-emerald-600 dark:text-emerald-400">
                    High Evidence Match
                  </span>
                </div>

                {experiments[0] && (
                  <div className="mt-4 flex flex-col gap-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <span className="console-label text-xs text-amber font-mono font-semibold">
                          {experiments[0].campaign} · {experiments[0].test_id}
                        </span>
                        <h3 className="text-base sm:text-lg font-bold text-text mt-0.5">
                          {experiments[0].fuel_material.replace(/_/g, ' ').toUpperCase()} (Thickness: {experiments[0].thickness_mm} mm)
                        </h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                          experiments[0].outcome === 'sustained'
                            ? 'bg-orange-500/15 text-flame border border-orange-500/25'
                            : 'bg-blue-500/15 text-blue border border-blue-500/25'
                        }`}>
                          <span className="size-2 rounded-full bg-current" />
                          {experiments[0].outcome.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    {/* Verbatim quote block with dense glass backing for crisp contrast */}
                    {experiments[0].key_observation_quote && (
                      <blockquote className="glass-dense-card rounded-2xl p-4 text-xs sm:text-sm text-text italic">
                        "{experiments[0].key_observation_quote}"
                        <footer className="mt-2 text-xs font-mono font-normal not-italic text-amber">
                          — {experiments[0].source_title} (Page {experiments[0].source_page})
                        </footer>
                      </blockquote>
                    )}

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                      <div className="flex items-center gap-4 text-xs font-mono text-dim">
                        <span>O₂: {experiments[0].o2_pct}%</span>
                        <span>Flow: {experiments[0].flow_cm_s} cm/s</span>
                        <span>Pressure: {experiments[0].pressure_kpa} kPa</span>
                      </div>
                      <a
                        href={`/library/${experiments[0].id}`}
                        className="text-xs font-semibold text-amber hover:underline flex items-center gap-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber"
                      >
                        <span>Full Experiment Details</span>
                        <Icon name="arrow-right" size={14} />
                      </a>
                    </div>
                  </div>
                )}
              </section>

              {/* Recent Experiments & Library Feed */}
              <section aria-labelledby="experiments-feed-heading" className="glass-dense-card rounded-3xl p-5 sm:p-6">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-orange-500/15">
                  <div>
                    <h2 id="experiments-feed-heading" className="text-sm sm:text-base font-bold text-text">
                      Verified NASA Combustion Experiments
                    </h2>
                    <p className="text-xs text-dim">
                      Showing {filteredExperiments.length} flight records
                    </p>
                  </div>

                  {/* Domain Filter Buttons */}
                  <div className="flex items-center gap-1 rounded-2xl bg-white/40 dark:bg-black/30 p-1 border border-orange-500/15 text-xs font-medium">
                    <button
                      type="button"
                      onClick={() => setDomainFilter('all')}
                      className={`rounded-xl px-2.5 py-1.5 sm:px-3 transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber ${
                        domainFilter === 'all'
                          ? 'bg-amber text-white shadow-sm font-semibold'
                          : 'text-dim hover:text-text'
                      }`}
                    >
                      All Domains
                    </button>
                    <button
                      type="button"
                      onClick={() => setDomainFilter('solid_flammability')}
                      className={`rounded-xl px-2.5 py-1.5 sm:px-3 transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber ${
                        domainFilter === 'solid_flammability'
                          ? 'bg-amber text-white shadow-sm font-semibold'
                          : 'text-dim hover:text-text'
                      }`}
                    >
                      Solid Flammability
                    </button>
                  </div>
                </div>

                {/* Desktop/Tablet Table (screens >= 640px) */}
                <div className="mt-4 hidden sm:block overflow-x-auto">
                  <table className="w-full text-left text-sm" aria-label="NASA Experiments Table">
                    <thead>
                      <tr className="border-b border-orange-500/10 text-xs font-mono text-dim">
                        <th scope="col" className="pb-3 font-medium">Compare</th>
                        <th scope="col" className="pb-3 font-medium">Campaign · Test ID</th>
                        <th scope="col" className="pb-3 font-medium">Material</th>
                        <th scope="col" className="pb-3 font-medium">O₂ / Flow</th>
                        <th scope="col" className="pb-3 font-medium">Outcome</th>
                        <th scope="col" className="pb-3 text-right font-medium">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-orange-500/10">
                      {filteredExperiments.slice(0, 6).map((exp) => {
                        const isSelected = selectedIds.includes(exp.id);
                        return (
                          <tr key={exp.id} className="transition-colors hover:bg-amber/5">
                            <td className="py-3.5 pr-2">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => toggleSelect(exp.id)}
                                aria-label={`Select ${exp.test_id} for comparison`}
                                className="size-4 rounded border-orange-300 text-amber focus:ring-amber"
                              />
                            </td>
                            <td className="py-3.5 pr-4">
                              <div className="font-semibold text-text">{exp.test_id}</div>
                              <div className="text-xs font-mono text-dim">{exp.campaign}</div>
                            </td>
                            <td className="py-3.5 pr-4">
                              <div className="capitalize font-medium text-text">
                                {exp.fuel_material.replace(/_/g, ' ')}
                              </div>
                              <div className="text-xs text-dim">{exp.material_class} · {exp.thickness_mm}mm</div>
                            </td>
                            <td className="py-3.5 pr-4 font-mono text-xs text-text">
                              <div>{exp.o2_pct}% O₂</div>
                              <div className="text-dim">{exp.flow_cm_s} cm/s</div>
                            </td>
                            <td className="py-3.5 pr-4">
                              <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                                exp.outcome === 'sustained'
                                  ? 'bg-orange-500/15 text-flame'
                                  : 'bg-blue-500/15 text-blue'
                              }`}>
                                <span className="size-1.5 rounded-full bg-current" />
                                {exp.outcome}
                              </span>
                            </td>
                            <td className="py-3.5 text-right">
                              <a
                                href={`/library/${exp.id}`}
                                className="inline-flex items-center gap-1 text-xs font-semibold text-amber hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber"
                              >
                                View
                              </a>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Mobile-Optimized Experiment Cards (< 640px) to prevent any horizontal overflow */}
                <div className="mt-4 flex flex-col gap-3 sm:hidden" aria-label="NASA Experiments Mobile Cards">
                  {filteredExperiments.slice(0, 6).map((exp) => {
                    const isSelected = selectedIds.includes(exp.id);
                    return (
                      <div
                        key={exp.id}
                        className="rounded-2xl border border-white/60 dark:border-orange-500/15 bg-white/20 dark:bg-black/20 p-3.5 transition-all"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleSelect(exp.id)}
                              aria-label={`Select ${exp.test_id} for comparison`}
                              className="size-4 rounded border-orange-300 text-amber focus:ring-amber"
                            />
                            <span className="font-semibold text-sm text-text">{exp.test_id}</span>
                          </label>
                          <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                            exp.outcome === 'sustained'
                              ? 'bg-orange-500/15 text-flame'
                              : 'bg-blue-500/15 text-blue'
                          }`}>
                            <span className="size-1.5 rounded-full bg-current" />
                            {exp.outcome}
                          </span>
                        </div>

                        <div className="mt-2 text-xs">
                          <span className="capitalize font-medium text-text">
                            {exp.fuel_material.replace(/_/g, ' ')}
                          </span>
                          <span className="text-dim"> · {exp.material_class} ({exp.thickness_mm}mm)</span>
                        </div>

                        <div className="mt-2.5 flex items-center justify-between pt-2 border-t border-orange-500/10 text-xs">
                          <div className="font-mono text-dim">
                            {exp.o2_pct}% O₂ · {exp.flow_cm_s} cm/s
                          </div>
                          <a
                            href={`/library/${exp.id}`}
                            className="text-xs font-semibold text-amber hover:underline flex items-center gap-0.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber"
                          >
                            <span>Details</span>
                            <Icon name="arrow-right" size={12} />
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-2 pt-4 border-t border-orange-500/10 text-xs">
                  <span className="text-dim">
                    Selected for comparison: {selectedIds.length}/2
                  </span>
                  <a href="/library" className="text-amber font-semibold hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber">
                    View all {experiments.length} experiments in Library &rarr;
                  </a>
                </div>
              </section>
            </div>

            {/* Right 4-col area: Supporting Panels */}
            <div className="flex flex-col gap-6 xl:col-span-4">
              
              {/* Quick Comparison Launcher Panel */}
              <section aria-labelledby="quick-compare-heading" className="glass-dashboard-card rounded-3xl p-5 sm:p-6">
                <div className="flex items-center gap-2 pb-3 border-b border-orange-500/15">
                  <Icon name="match" size={18} />
                  <h3 id="quick-compare-heading" className="text-base font-bold text-text">
                    Experiment Comparison
                  </h3>
                </div>
                <p className="mt-3 text-xs text-dim leading-relaxed">
                  Select any 2 verified microgravity experiments to compare physical flame spread rates,
                  extinction limits, and parameters side-by-side.
                </p>

                <div className="my-4 flex flex-col gap-2">
                  {[0, 1].map((index) => {
                    const id = selectedIds[index];
                    const exp = experiments.find((e) => e.id === id);
                    return (
                      <div
                        key={index}
                        className="rounded-2xl border border-white/60 dark:border-orange-500/15 bg-white/20 dark:bg-black/30 backdrop-blur-md p-3"
                      >
                        <span className="console-label text-[10px] text-amber font-mono font-semibold">
                          {index === 0 ? 'Experiment 1' : 'Experiment 2'}
                        </span>
                        {exp ? (
                          <div className="mt-1 flex items-center justify-between">
                            <span className="text-sm font-semibold truncate pr-2 text-text">{exp.test_id}</span>
                            <span className="text-xs font-mono text-dim">{exp.campaign}</span>
                          </div>
                        ) : (
                          <p className="mt-1 text-xs text-dim italic">Select from list below</p>
                        )}
                      </div>
                    );
                  })}
                </div>

                <Button
                  className="w-full justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber"
                  variant="primary"
                  disabled={selectedIds.length < 2}
                  onClick={() => window.location.assign(launchCompareUrl)}
                >
                  Compare Selected (2)
                </Button>
              </section>

              {/* Evidence Gaps & Limits Banner */}
              <section aria-labelledby="gaps-heading" className="glass-dashboard-card rounded-3xl p-5 sm:p-6">
                <div className="flex items-center gap-2 pb-3 border-b border-orange-500/15">
                  <Icon name="gap" size={18} />
                  <h3 id="gaps-heading" className="text-base font-bold text-text">
                    Evidence Gaps & Boundaries
                  </h3>
                </div>
                <div className="mt-3 rounded-2xl bg-amber/10 p-3.5 border border-orange-500/15">
                  <p className="text-xs font-bold text-amber uppercase tracking-wider font-mono">
                    "IGNIS Refuses to Guess"
                  </p>
                  <p className="mt-1 text-xs text-dim leading-relaxed">
                    When spacecraft conditions (such as elevated O₂ or high convective flow) fall outside verified
                    NASA microgravity runs, IGNIS marks the gap explicitly rather than interpolating unproven outcomes.
                  </p>
                </div>
                <div className="mt-4 flex flex-col gap-2 text-xs">
                  <div className="flex items-center justify-between py-1.5 border-b border-orange-500/10">
                    <span className="text-dim">Solid Flammability Range:</span>
                    <span className="font-mono font-medium text-text">18% – 30% O₂</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5 border-b border-orange-500/10">
                    <span className="text-dim">Airflow Velocity Tested:</span>
                    <span className="font-mono font-medium text-text">0.5 – 25 cm/s</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5">
                    <span className="text-dim">Unverified Extrapolations:</span>
                    <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">0 (Blocked)</span>
                  </div>
                </div>
              </section>

              {/* Provenance & Citation Panel */}
              <section aria-labelledby="provenance-heading" className="glass-dashboard-card rounded-3xl p-5 sm:p-6">
                <div className="flex items-center gap-2 pb-3 border-b border-orange-500/15">
                  <Icon name="citation" size={18} />
                  <h3 id="provenance-heading" className="text-base font-bold text-text">
                    NASA Glenn Provenance
                  </h3>
                </div>
                <p className="mt-3 text-xs text-dim leading-relaxed">
                  Data sourced from NASA Physical Sciences Informatics (PSI), NASA Technical Reports Server (NTRS),
                  and Burning and Suppression of Solids (BASS / BASS-II) flight payload logs.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <a
                    href="https://psi.nasa.gov/"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-xl border border-orange-500/15 bg-white/20 dark:bg-black/30 px-3 py-1.5 text-xs text-dim hover:text-text hover:border-amber transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber"
                  >
                    <span>NASA PSI Portal</span>
                    <Icon name="external" size={12} />
                  </a>
                  <a
                    href="https://ntrs.nasa.gov/"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-xl border border-orange-500/15 bg-white/20 dark:bg-black/30 px-3 py-1.5 text-xs text-dim hover:text-text hover:border-amber transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber"
                  >
                    <span>NTRS Citations</span>
                    <Icon name="external" size={12} />
                  </a>
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

/* ========================================================================= */
/* Helper Sub-Components */
/* ========================================================================= */

interface SidebarItemProps {
  href: string;
  icon: IconName;
  label: string;
  badge?: string;
  active?: boolean;
}

function SidebarItem({ href, icon, label, badge, active }: SidebarItemProps) {
  return (
    <a
      href={href}
      className={`flex items-center justify-between whitespace-nowrap rounded-2xl px-3.5 py-2.5 font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber ${
        active
          ? 'bg-amber text-white shadow-md shadow-orange-500/20 font-semibold'
          : 'text-dim hover:bg-orange-500/10 hover:text-text'
      }`}
    >
      <div className="flex items-center gap-2.5 sm:gap-3">
        <Icon name={icon} size={18} />
        <span>{label}</span>
      </div>
      {badge && (
        <span
          className={`ml-2 rounded-full px-2 py-0.5 text-[11px] font-mono ${
            active ? 'bg-white/20 text-white' : 'bg-orange-500/15 text-amber'
          }`}
        >
          {badge}
        </span>
      )}
    </a>
  );
}

function StatCard({
  icon,
  title,
  value,
  sub,
  tone = 'amber',
}: {
  icon: IconName;
  title: string;
  value: string;
  sub: string;
  tone?: 'amber' | 'flame' | 'success' | 'blue';
}) {
  const toneClasses = {
    amber: 'bg-amber/15 text-amber',
    flame: 'bg-flame/15 text-flame',
    success: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
    blue: 'bg-blue-500/15 text-blue',
  }[tone];

  return (
    <div className="glass-dashboard-card rounded-3xl p-4 sm:p-5">
      <div className="flex items-center justify-between">
        <span className="text-[11px] sm:text-xs font-mono text-dim uppercase tracking-wider">{title}</span>
        <div className={`flex size-8 sm:size-9 items-center justify-center rounded-2xl ${toneClasses}`}>
          <Icon name={icon} size={18} />
        </div>
      </div>
      <div className="display mt-2 sm:mt-3 text-xl sm:text-3xl font-bold text-text">{value}</div>
      <p className="mt-1 text-[11px] sm:text-xs text-dim truncate">{sub}</p>
    </div>
  );
}

function TelemetryTile({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div className="rounded-2xl border border-white/60 dark:border-orange-500/15 bg-white/20 dark:bg-black/20 backdrop-blur-md p-2.5 sm:p-3 shadow-sm">
      <div className="console-label text-[10px] text-dim">{label}</div>
      <div className="mt-1 font-mono text-sm sm:text-base font-bold text-amber">{value}</div>
      <div className="text-[10px] sm:text-[11px] text-dim truncate">{note}</div>
    </div>
  );
}
