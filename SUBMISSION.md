# VineScout AI Hackathon Submission

## Demo start

- Hosted app: https://vinescout-ai.vercel.app/app
- Best path: Dashboard -> Intake -> Search -> Domaine Valclaire diligence -> OrbitAI task studio -> Memos -> API Playground.

## What to show

- Seeded demo data across Europe and North America.
- Transparent scoring and harvest-risk caveats.
- OrbitAI Eye-of-God prompt generation plus manual result paste.
- Deal memo and outreach generation.
- Protected write APIs with local demo fallbacks.
- OpenAPI document at `/api/openapi.json`.

## Recording checklist

- Use the hosted `/app` route as the first screen.
- Show that no credentials are needed for the demo path.
- State that OrbitAI/OpenAI keys are server-only and optional.
- State that harvest-risk signals are diligence proxies, not proof of final wine quality or investment suitability.
- End on the API playground or generated memo to make the app look productized.

## Environment notes

OrbitAI relay requires `ORBITAI_API_KEY`, `ORBITAI_API_BASE_URL`, and optionally `ORBITAI_MODEL`. Protected hosted writes require `VINESCOUT_ADMIN_TOKEN`. Without those variables, the app remains fully demoable with seeded data and local browser fallbacks.
