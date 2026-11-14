/**
 * POST /api/check-claim — Beat 2 of the 60-second case ("Check against source"). One claim against one VERIFIED card,
 * through the production claim validator (checkClaim → claimProblem, src/server/claims.ts). Deterministic, no LLM.
 * The card is re-read as the public role (RLS: verified rows only), so the client can't supply its own "source".
 */
import { ClaimCheckRequestSchema } from '../src/lib/types.js';
import { readVerifiedCatalog } from '../src/server/catalog.js';
import { checkClaim } from '../src/server/claims.js';
import { anonClient } from '../src/server/db.js';
import { apiError, json, readJson, route } from '../src/server/http.js';
import { rateLimit } from '../src/server/rateLimit.js';

export const POST = route(async (req) => {
  const limited = await rateLimit(req, 'check-claim', 30);
  if (limited) return limited;
  const { data, response } = await readJson(req, ClaimCheckRequestSchema);
  if (response) return response;

  const db = anonClient();
  if (!db) return apiError(503, 'not_configured', 'Supabase is not configured on the server');
  const read = await readVerifiedCatalog(db);
  if (!read.ok) return read.response;
  const card = read.catalog.find((e) => e.id === data.experiment_id);
  if (!card) return apiError(404, 'not_found', 'No verified card with that id');
  return json(checkClaim(card, data.field, data.value));
});
