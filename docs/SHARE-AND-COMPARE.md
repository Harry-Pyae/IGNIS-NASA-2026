# Share and compare integration

## Console (Coder B)

Import `CopyShareLink` and `ShareBanner` from
`../features/share/ScenarioShare`. Import `useScenarioShare` from
`../features/share/useScenarioShare`. Mount the banner alongside the scenario
editor. Wire restoration with one hook call.

```tsx
const share = useScenarioShare(catalog, restoreSharedScenario);
```

`restoreSharedScenario` takes a `ResolvedScenario`. Set it as confirmed so
the console's existing `evidenceViews` runs. Set the editor's fields from the
same scenario, mapping a resolved material's canonical name to
`fuel_material_raw` and `materialChoice`. Clear the active preset, previous
description, selected match and edited-state flag. Render
`<ShareBanner share={share} />`.

When both `confirmed` and `views` exist, render the copy button.

```tsx
<CopyShareLink
  scenario={confirmed}
  revision={views.revision}
  rankedIds={views.top_k.map(({ experiment }) => experiment.id)}
/>
```

Generated links include `#console`, which already mounts the lazy console.
The query payload carries the confirmed scenario and omits the raw material
phrase and material candidate list. Increment the share engine version when
retrieval changes invalidate prior links.

## Routes (Coder A)

Lazy-load the named `Compare` export from `src/pages/Compare.tsx` and register
`/compare` in the pathname switch. Link to it as
`/compare?ids=<first-id>,<second-id>`. The page uses the verified catalog
and the existing CardComparison. For a smoke check, open a link with two
verified solid-material IDs, expand the comparison, and inspect the reported
conditions and source locators. Repeat with one unknown ID and check that
the page names it. Then copy and reopen a confirmed scenario in the console.
