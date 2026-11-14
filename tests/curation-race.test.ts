/**
 * Round 3, item 4 (review §2C): a delayed save followed by "New card" must not attach the new
 * draft to the previous card. This drives Curate's own primitives (createFormSessions + writeBody)
 * through the same state transitions as src/pages/Curate.tsx, against a server whose replies we
 * release by hand. (No DOM test environment in this repo; the UI also disables New while busy.)
 */
import { describe, expect, it } from 'vitest';
import { createFormSessions, type Editing, valuesToRecord, writeBody } from '../src/lib/curation';
import type { CurateRecord } from '../src/lib/types';

const OLD_ID = '22222222-2222-4222-8222-222222222222';
const record = (test_id: string) => {
  const r = valuesToRecord({
    domain: 'solid_flammability', campaign: 'BASS', test_id, fuel_material: 'PMMA', material_class: 'thermoplastic',
    fuel_form: 'flat_sheet', outcome: 'sustained', key_observation_quote: 'q', source_title: 't', source_url: 'https://example.org/x',
  });
  if ('errors' in r) throw new Error(r.errors.join());
  return r.record;
};

/** The parts of Curate's state that decide which card a write goes to. */
function curateForm(guarded = true) {
  const sessions = createFormSessions();
  const state = { editing: null as Editing, sent: [] as ReturnType<typeof writeBody>[] };
  const replies: (() => void)[] = [];
  /** Curate.save(): the write goes out now; its reply arrives when released. */
  const save = (r: CurateRecord) => {
    const live = guarded ? sessions.begin() : () => true;
    const body = writeBody(r, state.editing, false, '');
    state.sent.push(body);
    return new Promise<void>((done) =>
      replies.push(() => {
        const experiment = { id: body.id ?? OLD_ID, verified_by: null };
        if (live()) state.editing = { id: experiment.id, status: 'draft', updated_at: 't1' };
        done();
      }),
    );
  };
  /** Curate.newCard(). */
  const newCard = () => {
    sessions.switchForm();
    state.editing = null;
  };
  /** Curate.reopen(): switches the form, then fills it when the reply lands. */
  const reopen = (id: string) => {
    sessions.switchForm();
    const live = guarded ? sessions.begin() : () => true;
    return new Promise<void>((done) => replies.push(() => (live() && (state.editing = { id, status: 'draft', updated_at: 't0' }), done())));
  };
  return { state, save, newCard, reopen, release: (i: number) => replies[i]!() };
}

describe('curation: superseded responses never re-bind the form', () => {
  it('delayed save of the old card, then New: the next save creates a NEW card', async () => {
    const form = curateForm();
    form.state.editing = { id: OLD_ID, status: 'draft', updated_at: 't0' }; // curator is editing the old card
    const pending = form.save(record('OLD-CARD')); // Save… (reply delayed)
    form.newCard(); // …clicks New before it returns
    form.release(0); // the old save's reply finally lands
    await pending;
    expect(form.state.editing).toBeNull(); // still a new card

    void form.save(record('NEW-CARD')); // fills the form and saves
    expect(form.state.sent[1]).toMatchObject({ action: 'save_draft', id: undefined }); // never OLD_ID
    expect(form.state.sent[1]!.record.test_id).toBe('NEW-CARD');
  });

  it('control: without the guard, the same sequence WOULD overwrite the old card', async () => {
    const form = curateForm(false);
    form.state.editing = { id: OLD_ID, status: 'draft', updated_at: 't0' };
    const pending = form.save(record('OLD-CARD'));
    form.newCard();
    form.release(0);
    await pending;
    void form.save(record('NEW-CARD'));
    expect(form.state.sent[1]!.id).toBe(OLD_ID); // the bug the guard prevents
  });

  it('a slow Reopen of card A, then New: A never loads into the new form', async () => {
    const form = curateForm();
    const pending = form.reopen(OLD_ID);
    form.newCard();
    form.release(0);
    await pending;
    expect(form.state.editing).toBeNull();
  });

  it('an operation that is still current applies normally', async () => {
    const form = curateForm();
    const pending = form.save(record('FIRST'));
    form.release(0);
    await pending;
    expect(form.state.editing).toEqual({ id: OLD_ID, status: 'draft', updated_at: 't1' }); // bound to the version the save returned
  });
});

describe('A2 · edits carry the version they were read at', () => {
  it('writeBody sends expected_updated_at for an existing card, and nothing for a new one', () => {
    expect(writeBody(record('X'), { id: OLD_ID, status: 'draft', updated_at: '2026-11-14T04:17:26.679064+00:00' }, false, ''))
      .toMatchObject({ action: 'save_draft', id: OLD_ID, expected_updated_at: '2026-11-14T04:17:26.679064+00:00' });
    expect(writeBody(record('X'), null, true, 'Ada Reviewer')).toMatchObject({ action: 'publish', id: undefined, expected_updated_at: undefined });
  });
});

describe('Round 8 · curate per-tab draft', () => {
  it('keeps only record form fields — never the secret, signature, quotes or flags — and round-trips', async () => {
    const { parseDraft, serializeDraft, EMPTY_FORM } = await import('../src/lib/curation');
    const values = { ...EMPTY_FORM, test_id: 'BASS GMT96-T7', o2_pct: '21', 'x-curator-secret': 'nope', verified_by: 'Ada', field_quotes: '{}' } as Record<string, string>;
    const raw = serializeDraft(values, { id: OLD_ID, status: 'published', updated_at: 't0' }, new Date('2026-11-14T10:00:00Z'))!;
    expect(raw).not.toMatch(/nope|Ada|field_quotes|x-curator-secret/);
    expect(parseDraft(raw)).toEqual({ v: 1, values: { domain: 'solid_flammability', test_id: 'BASS GMT96-T7', o2_pct: '21' }, editing: { id: OLD_ID, status: 'published', updated_at: 't0' }, saved_at: '2026-11-14T10:00:00.000Z' });
  });

  it('a blank new card is not worth keeping; corrupted or foreign storage is ignored', async () => {
    const { parseDraft, serializeDraft, EMPTY_FORM } = await import('../src/lib/curation');
    expect(serializeDraft(EMPTY_FORM, null)).toBeNull();
    for (const bad of ['{', 'null', '{"v":2,"values":{},"editing":null,"saved_at":"x"}', '{"v":1,"values":{},"editing":{"id":1},"saved_at":"x"}'])
      expect(parseDraft(bad)).toBeNull();
  });
});
