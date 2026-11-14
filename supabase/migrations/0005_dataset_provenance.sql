-- Optional dataset provenance: the PSI dataset behind a card, beside the paper citation (ntrs_id/doi/page...).
-- Additive and nullable. null = not recorded, never guessed. Apply BEFORE deploying code that writes these columns:
-- /api/curate-write sends every record field, so a deploy without this migration makes every /curate save fail.
alter table public.experiments
  add column psi_investigation_id text,   -- e.g. 'PSI-25' (the PSI investigation identifier)
  add column dataset_doi text,            -- the dataset's own DOI, bare (10.xxxx/...)
  add column dataset_version text,        -- e.g. 'v4'
  add column dataset_file text,           -- file name inside the PSI dataset
  add column dataset_row_or_time text;    -- row, run or time locator inside that file
