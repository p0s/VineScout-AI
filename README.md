# VineScout AI

AI vineyard diligence for Chinese premium wine expansion.

VineScout AI helps Chinese premium wine importers, beverage/DTC startups, and strategic investors identify Western vineyard supply, investment, and acquisition opportunities. It ranks opportunities, predicts harvest risk from satellite/weather proxies, generates OrbitAI Eye-of-God validation tasks, and turns the result into deal memos and outreach.

## MVP features

- Buyer profile intake.
- Local buyer brief upload for demo-safe intake notes.
- Vineyard opportunity search, ranking, Three.js 3D globe map, filters, and cards.
- Harvest-risk signal charts, live public weather proxy, and transparent scoring.
- OrbitAI task studio and Eye-of-God manual handoff.
- Deal memo generator.
- Outreach generator.
- Watchlist alerts and protected webhook mock.
- API playground and OpenAPI spec with protected write examples.
- Seeded demo mode with 100 fictional opportunities.

## OrbitAI usage

- Use OrbitAI API relay when configured through server-only environment variables.
- Use Eye of God through a manual handoff flow: generate prompt, run in OrbitAI, paste result back.
- Do not assume undocumented raw satellite-tasking APIs.

Server-only environment variables:

```bash
ORBITAI_API_KEY=
ORBITAI_API_BASE_URL=https://api.orbitai.global/v1
ORBITAI_MODEL=gpt-5.4
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o-mini
VINESCOUT_ADMIN_TOKEN=
NEXT_PUBLIC_APP_URL=
```

`VINESCOUT_ADMIN_TOKEN` enables protected hosted writes such as buyer profile persistence, CSV import, webhook alerts, and pasted Eye-of-God evidence. The hosted demo still works without it through local browser fallbacks.

## Hosted demo

Start at `https://vinescout-ai.vercel.app/app`.

## Run

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Verify

```bash
npm run lint
npm run typecheck
npm test
npm run build
npm run test:e2e
```

For E2E against a specific deployment:

```bash
E2E_BASE_URL=https://vinescout-ai.vercel.app npm run test:e2e
```

## Optional Supabase

The MVP runs from seeded local data by default. A starter schema is available at `supabase/migrations/0001_vinescout_schema.sql` for teams that want to wire durable storage after the hackathon demo.
