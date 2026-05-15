# VineScout AI

AI vineyard diligence for Chinese premium wine expansion.

VineScout AI helps Chinese premium wine importers, beverage/DTC startups, and strategic investors identify Western vineyard supply, investment, and acquisition opportunities. It ranks opportunities, predicts harvest risk from satellite/weather proxies, generates OrbitAI Eye-of-God validation tasks, and turns the result into deal memos and outreach.

## MVP features

- Buyer profile intake.
- Vineyard opportunity search and ranking.
- Harvest-risk signal charts.
- OrbitAI task studio and Eye-of-God manual handoff.
- Deal memo generator.
- Outreach generator.
- Watchlist alerts.
- API playground and OpenAPI spec.
- Seeded demo mode with at least 12 fictional opportunities.

## OrbitAI usage

- Use OrbitAI API relay when configured through server-only environment variables.
- Use Eye of God through a manual handoff flow: generate prompt, run in OrbitAI, paste result back.
- Do not assume undocumented raw satellite-tasking APIs.

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
```

## Files

- `SPEC.md` — canonical product spec.
- `STATUS.md` — backlog and current status.
- `AGENTS.md` — agent coding rules.
- `DEMO_GUIDE.md` — demo narration, video/voice notes, and Vercel deployment checklist.
