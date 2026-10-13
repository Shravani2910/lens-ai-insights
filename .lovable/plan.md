# Lens — See What Matters

## Goal
Replace the placeholder home page with a complete, responsive startup-research workspace. Real research must come only from the configured API; sample data stays clearly marked and separate.

## Work
- Establish a restrained monochrome editorial design system and build the Lens workspace at `/`, including research question entry, example prompts, workflow stages, result/report views, and responsive layouts.
- Add a typed browser API service configured by `VITE_RESEARCH_API_URL`. Validate successful responses; show honest loading, empty, configuration, network/API error, and retry states without inventing research.
- Add an explicitly labeled sample-report preview that is isolated from real API state, plus focused tests for the research service/state behavior and route metadata.
- Give `/` unique, app-specific title, description, Open Graph, and Twitter metadata. Document the feature-module/API-service structure in `AGENTS.md`.

## Technical details
- Use React, TypeScript, Tailwind v4, existing shadcn controls, and Lucide icons; do not add a database or mock backend.
- Request contract: `POST {VITE_RESEARCH_API_URL}` with `{ "question": string }`; accept only a validated report response containing a title/summary, findings with evidence/source links, and recommendations. Any mismatch is an error, not a sample result.
