# STATUS.md — VineScout AI

## Current state

Working MVP implemented as a Next.js + TypeScript app with 100 seeded vineyard opportunities, deterministic scoring, a Three.js 3D globe map, server-only optional AI providers, OrbitAI handoff, demo-safe local fallbacks, memos, outreach, watchlist alerts, developer API, OpenAPI spec, and repeatable E2E smoke checks.

## Backlog

### P0 — Build the working MVP

- [x] Initialize Next.js TypeScript app.
- [x] Add Tailwind/shadcn or equivalent component system.
- [x] Create seeded demo dataset with 100 fictional vineyard opportunities.
- [x] Implement buyer profile intake with local demo upload.
- [x] Implement vineyard search, ranking, Three.js globe map, filters, and cards.
- [x] Implement vineyard diligence room.
- [x] Implement harvest-risk signal charts and transparent scoring.
- [x] Implement AI provider adapter: mock, OrbitAI, optional OpenAI fallback.
- [x] Implement OrbitAI task studio with Eye-of-God manual handoff.
- [x] Implement deal memo generator.
- [x] Implement outreach generator.
- [x] Implement watchlist/alerts.
- [x] Implement API playground and `/api/openapi.json`.
- [x] Document protected write APIs and admin-token behavior in the playground/OpenAPI spec.
- [x] Add bilingual summary toggle for memos.
- [x] Add Supabase support with local fallback.
- [x] Add tests for scoring, AI fallback, API health, and core demo path.
- [x] Add repeatable hosted/local E2E smoke script.
- [x] Verify lint, typecheck, tests, and build.

### P1 — Prize polish

- [x] Add demo-mode banner and provenance labels everywhere.
- [x] Add screenshot-ready landing page.
- [x] Add print/export view for deal memo.
- [x] Add preloaded OrbitAI Eye-of-God result for demo reliability.
- [x] Add pitch-friendly metrics: time saved, risk reduced, next actions.
- [x] Add concise “why AI is core” section.

### P2 — Nice to have

- [x] Add optional live weather adapter.
- [x] Surface live weather proxy inside vineyard diligence rooms.
- [x] Add optional STAC/Copernicus adapter skeleton.
- [x] Add CSV import for vineyard candidates.
- [x] Add webhook alert mock.
- [x] Add SDK snippet package.
- [x] Add starter Supabase migration for durable storage follow-up.

## Known risks

- Satellite evidence predicts vineyard-health proxies, not final wine quality.
- OrbitAI direct satellite tasking must not be assumed without real docs.
- The public OrbitAI relay endpoint/model must be verified with current OrbitAI docs; the app falls back safely when relay calls fail.
