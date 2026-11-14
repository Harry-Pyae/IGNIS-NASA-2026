# Share and compare integration

## Console integration

The Match Panel displays the banner and copy button. The console calls the
restoration hook with the current catalog and a callback.

```tsx
const share = useScenarioShare(catalog, restoreSharedScenario);
```

The callback takes a `ResolvedScenario` and leaves it unconfirmed.
The share hook reruns deterministic retrieval for catalog comparison without
requesting a Brief. The visitor must click Confirm to generate the Brief.
The callback restores the editor fields and maps a resolved
material's canonical name to `fuel_material_raw` and `materialChoice`.

The console renders the copy button when both `confirmed` and `views` exist.

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

## Comparison route

The console links the selected pair to the lazy-loaded
`/compare?ids=<first-id>,<second-id>` route. The page uses the verified catalog
and the existing CardComparison. For a smoke check, open a link with two
verified solid-material IDs and inspect the reported
conditions and source locators. Repeat with one unknown ID and check that
the page names it. Then copy and reopen a confirmed scenario in the console.
