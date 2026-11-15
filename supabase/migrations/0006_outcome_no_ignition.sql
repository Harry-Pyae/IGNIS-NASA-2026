-- Outcome `no_ignition` (team lead decision 2026-11-15): ignition was attempted and the sample did not ignite.
-- An observation like any other outcome (retrievable, counts as tested at its conditions), never a gap.
-- Additive: widens the 0001 check constraint; no existing row changes. Apply BEFORE saving any no_ignition card
-- (a deploy without it only means /curate can't save that value yet; nothing else breaks).
alter table public.experiments drop constraint if exists experiments_outcome_check;
alter table public.experiments add constraint experiments_outcome_check
  check (outcome in ('sustained', 'extinguished', 'transition', 'partial', 'no_ignition'));
