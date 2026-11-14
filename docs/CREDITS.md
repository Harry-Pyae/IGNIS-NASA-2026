# IGNIS credits and licenses

## Use of AI ("Super Intelligence") tools

- **Development:** an AI coding assistant (Claude Code, by Anthropic) wrote most of the code under the team lead's
  direction. The team lead reviewed, tested and merged every change.
- **Current refinement:** OpenAI Codex assisted with the unified specification's code, tests and execution documents
  on 2026-11-13; Claude Code added the mission-gate and map-axes commits and the Day 1 runbook. Scientific and participant reviews are
  not represented as completed by the coding agent. The specification consolidates Gemini and Google AI Mode suggestions.
- **In the product:** Groq-hosted `openai/gpt-oss-120b` (primary) and Google Gemini `gemini-3.5-flash-lite` (backup)
  turn a typed scenario into structured fields, which the user confirms, and narrate retrieved evidence as structured
  claims that the server validates. They also draft card extractions that a named human verifies before anything is
  published. The LLMs never classify materials, rank matches or explain matches; that is deterministic code.
- **Branding art** (`public/art/*`): AI-generated illustrations made with **ChatGPT, with Claude assistance**
  (tools confirmed by the team lead on 2026-11-13), then
  post-processed programmatically (gradient rebuild and added grain). They are used for branding only, never as experiment data, and the flame illustration is captioned
  "Illustration — not NASA experiment imagery."

## Third-party components and credits

| Component | Use | License |
|---|---|---|
| React, React DOM | UI | MIT |
| Zod | Schema validation | MIT |
| @supabase/supabase-js | Database client | MIT |
| Supabase (hosted Postgres) | Database | Hosted service |
| Vite, @vitejs/plugin-react, Vitest | Build and tests | MIT |
| Tailwind CSS | Styling | MIT |
| TypeScript | Language | Apache-2.0 |
| ESLint, typescript-eslint | Linting | MIT |
| Space Grotesk, IBM Plex Mono | Fonts (self-hosted) | SIL Open Font License 1.1 (license files in `public/fonts/`) |
| Vercel | Hosting and serverless functions | Hosted service |
| Groq API (`openai/gpt-oss-120b`), Google Gemini API | LLM calls | Hosted services; not redistributed |
| NASA Technical Reports Server, NASA Physical Sciences Informatics | Experiment sources | Each card cites its source, page and locator, quoting short excerpts |
| Pyroverse (a teammate's practice build) | Content and UX patterns adapted in Round 5: context entries, environment-preset ideas, a Burmese draft, the step-guide pattern. No code and no data values | Used with her permission; see `docs/DECISIONS-ROUND5.md` |
| NASA imagery (when added) | Card stills | Recorded with origin and credit in the media ledger, following NASA's media usage guidelines |

**Project license:** [Apache-2.0](../LICENSE) (chosen 2026-11-10), for the team's own code and docs. Third-party
components keep their own licenses (table above), and NASA material stays under NASA's media usage guidelines.
