# VineScout AI demo and hosting guide

## Local demo path

1. Open `/app` locally or `https://vinescout-ai.vercel.app/app` on Vercel.
2. Show the DragonCellar Premium profile summary.
3. Go to `/app/search` and filter the ranked fictional vineyard portfolio.
4. Open `/app/vineyards/domaine-valclaire`.
5. Show harvest-risk signals, provenance labels, caveats, memo, and outreach.
6. Go to `/app/orbitai`, generate an Eye-of-God prompt, and attach the seeded pasted result.
7. Show `/app/api-playground` and `/api/openapi.json`.

## 90-second narration

Chinese premium wine and beverage companies are moving from simple importing to supply control and Western brand localization.
VineScout AI turns that process into one diligence room.
The buyer defines budget, target products, channels, and preferred deal structures.
The app ranks fictional European and North American vineyard opportunities with transparent formulas for China fit, export readiness, owner openness, budget fit, and harvest-risk proxies.
In the diligence room, harvest-risk prediction is clearly caveated: satellite and weather signals estimate vineyard health and harvest risk, not final wine taste or investment suitability.
For premium validation, VineScout generates an OrbitAI Eye-of-God handoff prompt. The user runs the task externally, pastes the result, and the evidence is attached with `eye_of_god_handoff` provenance.
The same workflow generates a deal memo, owner outreach, watchlist alerts, and an OpenAPI-backed developer surface.

## Video and voice production

- Capture the app with the route order above.
- Use the narration as voiceover, or generate voice with a TTS provider outside the app.
- Keep any real API keys, browser profiles, terminal prompts, and local paths out of the recording.
- For AI-generated video support on Vercel, current Vercel AI Gateway documentation describes beta video generation and model/provider options.
- Proof-of-Build-style demo tools can turn screenshots, terminal output, and logs into narrated videos, but review privacy settings before uploading artifacts.

## Vercel hosting

1. Push the repository to GitHub.
2. Import it in Vercel as a Next.js project.
3. Set server-only environment variables only in Vercel project settings:
   - `ORBITAI_API_BASE_URL`
   - `ORBITAI_API_KEY`
   - `ORBITAI_MODEL`
   - `OPENAI_API_KEY`
   - `OPENAI_MODEL`
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `VINESCOUT_ADMIN_TOKEN`
4. Do not create `NEXT_PUBLIC_` variables for secrets.
5. Build command: `npm run build`.
6. The app runs without credentials in seeded demo mode.
7. Smoke-test the deployment with `E2E_BASE_URL=https://vinescout-ai.vercel.app npm run test:e2e`.
