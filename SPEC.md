# SPEC.md — VineScout AI

## Product decision

Build **VineScout AI**: an AI diligence room for Chinese wine importers, premium beverage groups, and consumer/DTC wine companies that want to source from, invest in, or acquire vineyards in Europe and North America.

Frame the product as:

> **VineScout AI helps fast-growing Chinese premium beverage and wine-commerce companies execute Western market localization through vineyard sourcing, strategic investment, and acquisition diligence — with AI and OrbitAI-powered harvest-risk evidence at the core.**

The winning demo should not be “generic wine importer lead generation.” It should be:

> A Chinese premium wine/DTC company wants to secure Western supply and possibly acquire a European or North American vineyard. VineScout AI ranks regions and estates, predicts harvest risk from remote-sensing proxies, creates a deal memo, generates owner/broker outreach, and produces an OrbitAI Eye-of-God task for satellite evidence.

## Goal

Create a live, polished, English-first web app that can be deployed on Vercel and run locally with seeded data. It must work without external credentials, but become stronger when OrbitAI, Supabase, or other optional keys are configured.

The app must let a user:

1. Define a buyer/investor profile.
2. Search and compare Western vineyards or vineyard-backed suppliers.
3. Score each opportunity for sourcing, minority investment, and acquisition.
4. Generate harvest-quality and harvest-risk predictions using remote-sensing proxies, weather risk, and AI reasoning.
5. Create an OrbitAI task prompt / handoff for Eye of God validation.
6. Produce a professional deal memo, diligence checklist, outreach emails, and watchlist alerts.
7. Expose a small developer API and OpenAPI spec.

## Hackathon-fit position

### Why it can work

- The problem is specific: Chinese wine/import/premium beverage companies struggle to evaluate distant Western vineyards before buying supply, investing, or acquiring.
- The app produces concrete artifacts: ranked vineyard targets, harvest-risk evidence, diligence memo, outreach, alerts.
- AI is central: parsing investor goals, scoring fit, interpreting harvest signals, generating deal memos, creating outreach, and producing OrbitAI task briefs.
- OrbitAI is highly relevant because vineyard vigor, stress, drought, canopy uniformity, harvest timing, wildfire smoke risk, and land-use signals are satellite-observable proxies.
- It can impress operations/supply-chain-minded judges with a real cross-border diligence workflow.

### Required framing for a strong pitch

Use this exact framing:

> **China’s premium wine and beverage companies are moving from simple importing to supply control and brand localization. VineScout AI gives them an AI diligence room to find Western vineyards, validate harvest risk with satellite intelligence, and move from shortlisting to deal outreach in one day.**

Do not pitch it as:

- “A marketplace for wine importers.”
- “Satellite AI predicts the best wine.”
- “We know final wine quality from imagery.”
- “A financial investment advisor.”

## Target customer

Primary ICP:

- Chinese premium wine importers, wine-commerce startups, private-label beverage groups, and cross-border DTC companies.
- Stage: Seed to Series B, or owner-operated importers with revenue roughly $500K–$50M.
- Team size: 10–500.
- Ambition: secure Western wine supply, develop private-label brands, acquire or invest in vineyards, or build Western-origin brand credibility.

Secondary ICP:

- Chinese family offices and strategic investors focused on wine, agri-food, hospitality, or luxury consumer assets.
- Western vineyard owners, brokers, and regional development agencies that want qualified Asian buyers.

Hero persona:

- **Liu**, founder of a Shanghai premium wine-commerce startup.
- Domestic traction: 80,000 customers, top-selling imported wine bundles, wants proprietary Western supply.
- Goal: Find two European or North American vineyard partners and one possible acquisition target before Q4 harvest.
- Constraints: budget, brand fit, China import/export readiness, climate risk, quality consistency, owner openness, and deal timeline.

## Core product name

**VineScout AI**

Tagline options:

1. **AI vineyard diligence for Chinese premium wine expansion.**
2. **Find, verify, and win Western vineyard deals.**
3. **From vineyard shortlist to harvest-risk evidence and deal memo in minutes.**

Use option 2 in UI header and option 1 in pitch materials.

## Product principles

- English-only product for submission, with optional Chinese summary toggle.
- AI must be the engine, not a decorative chatbot.
- Every important AI answer must include evidence, confidence, uncertainty, and next-step actions.
- The app must be fully usable with seeded demo data.
- Use hard provenance labels: `seeded_demo`, `live_public`, `orbitai_relay`, `eye_of_god_handoff`, `user_uploaded`, `unavailable`.
- Do not pretend to have raw OrbitAI satellite-tasking API access unless explicitly configured.
- Do not claim final wine quality can be known from satellite imagery alone.
- Prefer useful, specific workflows over broad dashboards.

## What OrbitAI provides today and how to use it

VineScout must work with OrbitAI’s current public/product surface:

1. **OrbitAI Space API Relay / Token Plan**
   - Use as a server-only LLM/model relay when `ORBITAI_API_KEY` and related env vars are configured.
   - All calls must go through server routes only.
   - Never expose the key in browser code or `NEXT_PUBLIC_*` variables.

2. **Eye of God manual handoff**
   - The app should generate a polished Eye-of-God prompt for a vineyard or region.
   - The user can copy the prompt, open Eye of God, run the task, and paste the result back into VineScout.
   - The pasted result becomes an `eye_of_god_handoff` evidence item and can be used to regenerate the scorecard and memo.

3. **No undocumented raw satellite tasking assumption**
   - Do not implement fake direct satellite tasking unless real docs are provided.
   - The default app should use seeded harvest-signal data and public-data adapters.
   - OrbitAI is positioned as the premium validation layer.

## Data strategy

The app must support three data modes:

### 1. Seeded demo mode

Always available. Use realistic fictional vineyard opportunities and synthetic but plausible signal histories.

Seed at least 12 opportunities across Europe and North America:

- France: Bordeaux, Languedoc, Loire, Burgundy-adjacent fictional estate.
- Spain: Rioja, Ribera del Duero.
- Portugal: Douro, Alentejo.
- Germany: Rheinhessen / Mosel.
- Italy: Tuscany / Veneto.
- US: California Central Coast, Oregon Willamette Valley.
- Canada: Okanagan Valley.

Use fictional estate names and mark them clearly as demo data.

Each opportunity must include:

- Estate name.
- Region and country.
- Coordinates / map center.
- Hectares under vine.
- Varietals.
- Annual production range.
- Indicative asking price or investment range.
- Deal type availability: supply contract, minority investment, acquisition, joint venture.
- Owner openness score.
- Export readiness score.
- China fit score.
- Climate-risk profile.
- Harvest-signal time series: NDVI/EVI-like vigor, drought stress, canopy uniformity, heat/frost/smoke risk, harvest window.
- Due-diligence notes.
- Sample broker/owner contact placeholder.

### 2. Public live mode

Optional, no-key-first where possible.

Recommended adapters:

- Open-Meteo or similar free weather API for weather and climate signals.
- Public map tiles for base maps.
- Optional STAC/Copernicus/Sentinel adapter if credentials are supplied.
- Optional property or vineyard data imports via CSV.

If a live source fails, show an honest `unavailable` or `seeded_demo` label.

### 3. OrbitAI evidence mode

When user chooses “Validate with OrbitAI,” create an Eye-of-God task prompt that requests satellite-observable evidence.

Prompt should include:

- Vineyard name and coordinates.
- Parcels or region boundary if available.
- Observation question.
- Requested time window.
- Signals to check: canopy vigor, dry stress, disease-like anomalies, fire/smoke risk, flood/hail/frost damage if observable, harvest activity, neighboring parcel comparison.
- Desired output structure: observations, confidence, images/metadata if available, caveats, investment/sourcing relevance.

The app must allow the user to paste the Eye-of-God answer and attach it to the opportunity.

## Harvest quality prediction scope

Use the phrase **harvest-risk prediction**, not “wine-quality prediction,” except in explanatory copy.

Allowed outputs:

- Vineyard vigor score.
- Canopy uniformity score.
- Drought/heat/frost/smoke/flood risk.
- Expected harvest stability.
- Likely yield stability proxy.
- Risk of inconsistency across parcels.
- Recommendation: buy supply, invest, acquire, watch, reject.

Disallowed or heavily caveated outputs:

- Final wine taste.
- Aroma profile.
- exact sugar/Brix without ground data.
- exact alcohol level.
- exact yield without local data.
- investment advice.

Use this standard disclaimer in relevant UI:

> Satellite and weather signals estimate vineyard health and harvest risk. They do not prove final wine taste, lab chemistry, ownership value, or investment suitability. Use VineScout as a diligence accelerator, not as legal, financial, or oenological advice.

## Key workflows

### Workflow A — Buyer profile intake

User enters or uploads:

- Company type: importer, premium wine DTC, private-label beverage group, distributor, strategic investor.
- Current channels: Tmall/JD, restaurants, hotels, private clubs, direct subscriptions, offline retail.
- Target product: red, white, sparkling, premium, natural/organic, low/no-alcohol, private label, luxury estate.
- Target countries/regions.
- Budget range.
- Deal type: supply contract, minority investment, acquisition, joint venture.
- Risk appetite.
- Target price tier in China.
- Required certifications/claims.
- Timeline.

AI output:

- Buyer strategy brief.
- Top region thesis.
- Fit criteria used for scoring.
- Watch-outs.

### Workflow B — Vineyard search and ranking

User clicks “Find opportunities.”

App returns ranked cards with:

- Overall fit.
- Deal type fit.
- China premium fit.
- Harvest-risk score.
- Export/compliance readiness.
- Owner openness.
- Confidence.
- Top reason to pursue.
- Top risk.
- Recommended next action.

### Workflow C — Diligence room

Each vineyard has a diligence room with tabs:

1. Overview.
2. Harvest signals.
3. OrbitAI validation.
4. Commercial fit.
5. Compliance/export.
6. Deal memo.
7. Outreach.
8. Alerts.

### Workflow D — OrbitAI task handoff

User clicks “Generate OrbitAI task.”

App creates:

- Copyable Eye-of-God prompt.
- Task metadata.
- Expected evidence schema.
- Checklist of what a useful result should contain.

User can paste result.

App then:

- Adds evidence item.
- Updates harvest-risk score.
- Updates confidence.
- Regenerates deal memo section.

### Workflow E — Deal memo generation

Generate a professional memo:

- Executive recommendation.
- Buyer profile.
- Vineyard overview.
- Strategic rationale.
- Harvest-risk evidence.
- Commercial fit.
- China market fit.
- Deal structure options.
- Red flags.
- Diligence checklist.
- Outreach plan.
- Next 14 days.

Export as markdown and PDF-like print view.

### Workflow F — Outreach generator

Generate:

- Owner/broker first email.
- Follow-up email.
- WeChat/WhatsApp short message.
- Meeting agenda.
- NDA/data request list.
- Chinese summary for internal stakeholders.

### Workflow G — Watchlist and alerts

User can add vineyards to watchlist.

Alert types:

- Harvest stress increased.
- OrbitAI evidence updated.
- Price/deal status changed.
- Region climate risk updated.
- Outreach follow-up due.

## UX / pages

Use a polished, investor-grade product aesthetic. Think “deal room + satellite intelligence,” not “agriculture dashboard.”

### `/`

Landing page with:

- Hero one-liner.
- Demo CTA.
- Three steps: Profile → Rank vineyards → Validate with OrbitAI → Deal memo.
- Judge-friendly explanation of AI core.
- “Demo with fictional European vineyard portfolio” button.

### `/app`

Main dashboard:

- Buyer profile summary.
- Opportunity funnel.
- Top ranked vineyards.
- Map.
- Alerts.
- Recent memos.

### `/app/intake`

Buyer profile form + upload.

### `/app/search`

Search/ranking table + map.

Filters:

- Country/region.
- Varietal.
- deal type.
- price range.
- harvest-risk score.
- China fit score.
- export readiness.

### `/app/vineyards/[id]`

Diligence room.

### `/app/orbitai`

OrbitAI task studio:

- Task templates.
- Generated prompts.
- Manual result paste.
- History.
- Evidence status.

### `/app/memos`

Deal memos and exports.

### `/app/api-playground`

Developer page:

- OpenAPI link.
- Try endpoints.
- SDK snippet.
- Webhook examples.

### `/api/openapi.json`

OpenAPI spec for public endpoints.

## Components

- `BuyerProfileForm`
- `OpportunityMap`
- `VineyardCard`
- `ScoreRadar`
- `SignalTimeline`
- `HarvestRiskPanel`
- `EvidenceBadge`
- `OrbitAiTaskBuilder`
- `EyeOfGodResultPasteBox`
- `DealMemoEditor`
- `OutreachComposer`
- `WatchlistPanel`
- `ApiPlayground`
- `DemoModeBanner`

## Data model

Use TypeScript types and Zod schemas.

### BuyerProfile

```ts
type BuyerProfile = {
  id: string;
  companyName: string;
  companyType: 'importer' | 'dtc_brand' | 'distributor' | 'strategic_investor' | 'family_office' | 'other';
  channels: string[];
  targetProducts: string[];
  targetCountries: string[];
  preferredDealTypes: DealType[];
  budgetMinUsd?: number;
  budgetMaxUsd?: number;
  targetChinaPriceTier: 'value' | 'premium' | 'luxury' | 'mixed';
  riskAppetite: 'low' | 'medium' | 'high';
  timeline: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};
```

### VineyardOpportunity

```ts
type DealType = 'supply_contract' | 'minority_investment' | 'acquisition' | 'joint_venture';

type VineyardOpportunity = {
  id: string;
  name: string;
  fictionalDemo: boolean;
  region: string;
  country: string;
  lat: number;
  lng: number;
  hectares: number;
  varietals: string[];
  annualProductionBottles?: number;
  dealTypes: DealType[];
  indicativePriceUsd?: number;
  investmentRangeUsd?: [number, number];
  ownerOpennessScore: number;
  exportReadinessScore: number;
  chinaPremiumFitScore: number;
  climateRiskScore: number;
  harvestRiskScore: number;
  overallFitScore: number;
  confidence: number;
  topReasons: string[];
  redFlags: string[];
  evidence: EvidenceItem[];
  signals: HarvestSignal[];
  createdAt: string;
  updatedAt: string;
};
```

### HarvestSignal

```ts
type HarvestSignal = {
  id: string;
  vineyardId: string;
  date: string;
  ndviProxy: number;
  eviProxy: number;
  canopyUniformity: number;
  droughtStress: number;
  heatRisk: number;
  frostRisk: number;
  smokeRisk: number;
  diseaseAnomalyProxy: number;
  source: EvidenceSource;
  notes?: string;
};
```

### EvidenceItem

```ts
type EvidenceSource = 'seeded_demo' | 'live_public' | 'orbitai_relay' | 'eye_of_god_handoff' | 'user_uploaded' | 'unavailable';

type EvidenceItem = {
  id: string;
  opportunityId?: string;
  type: 'satellite_proxy' | 'weather' | 'market' | 'export' | 'owner' | 'orbitai' | 'user_document';
  source: EvidenceSource;
  title: string;
  summary: string;
  confidence: number;
  observedAt?: string;
  url?: string;
  rawText?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
};
```

### DealMemo

```ts
type DealMemo = {
  id: string;
  opportunityId: string;
  buyerProfileId: string;
  recommendation: 'buy_supply' | 'invest' | 'acquire' | 'watch' | 'reject';
  markdown: string;
  aiModel?: string;
  confidence: number;
  createdAt: string;
  updatedAt: string;
};
```

## Scoring model

Implement transparent deterministic scoring first, then optional AI refinement.

### Overall fit

```
overallFit =
  0.25 * chinaPremiumFit +
  0.20 * dealTypeFit +
  0.20 * exportReadiness +
  0.15 * harvestRiskInverted +
  0.10 * ownerOpenness +
  0.10 * budgetFit
```

Where:

- `harvestRiskInverted = 100 - harvestRiskScore`
- scores are 0–100.
- confidence decreases when data source is seeded or unavailable.

### Harvest-risk score

```
harvestRisk =
  0.25 * droughtStress +
  0.20 * heatRisk +
  0.15 * frostRisk +
  0.15 * smokeRisk +
  0.15 * diseaseAnomalyProxy +
  0.10 * (100 - canopyUniformity)
```

### Recommendation

- `buy_supply`: high export readiness, good China fit, medium owner openness, acceptable harvest risk.
- `invest`: strong fit, moderate price, manageable risk, high owner openness.
- `acquire`: strong fit, low/medium climate risk, high owner openness, budget fit, high export readiness.
- `watch`: promising but low confidence or medium risk.
- `reject`: high harvest risk, low export readiness, poor budget fit, or major red flags.

## AI architecture

Use a provider adapter pattern.

```ts
type AiProvider = 'orbitai' | 'openai' | 'mock';
```

### Required adapters

1. `MockAiProvider`
   - deterministic seeded outputs.
   - always works.

2. `OrbitAiProvider`
   - server-only.
   - configured by `ORBITAI_API_BASE_URL`, `ORBITAI_API_KEY`, `ORBITAI_MODEL`.
   - use generic OpenAI-compatible chat/completions shape if possible.
   - if response fails, return structured error and let UI fall back to mock.

3. Optional `OpenAiProvider`
   - server-only fallback only if `OPENAI_API_KEY` exists.

### AI tasks

- Buyer profile extraction.
- Region thesis generation.
- Opportunity score explanation.
- Harvest-risk interpretation.
- Deal memo generation.
- Outreach generation.
- Eye-of-God prompt generation.
- Chinese summary generation.

All AI outputs must be structured JSON where possible. Use Zod validation. If parsing fails, retry once; then fall back to deterministic template.

## API endpoints

### App API

- `GET /api/health`
- `GET /api/vineyards`
- `GET /api/vineyards/:id`
- `POST /api/vineyards/search`
- `POST /api/buyer-profile`
- `POST /api/score`
- `POST /api/orbitai/task-prompt`
- `POST /api/orbitai/evidence`
- `POST /api/memos`
- `POST /api/outreach`
- `GET /api/openapi.json`

### Developer API rules

- Read-like APIs may use demo auth in local mode.
- Hosted write APIs must be server-only, admin-token protected, allowlisted, and idempotent where possible.
- No secrets in client code.
- Include example curl commands on API playground.

## Database

Use Supabase when configured; otherwise use local JSON/SQLite-like in-memory seeded store.

Required env:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` server-only, optional, never client.

Tables:

- `buyer_profiles`
- `vineyard_opportunities`
- `harvest_signals`
- `evidence_items`
- `deal_memos`
- `outreach_messages`
- `watchlist_items`
- `api_events`

Include SQL migration if Supabase is used.

## Tech stack

Recommended:

- Next.js App Router.
- TypeScript.
- Tailwind CSS.
- shadcn/ui or Radix UI.
- Zod.
- React Hook Form.
- Recharts for charts.
- MapLibre GL or Leaflet for maps without Mapbox.
- Supabase optional.
- Vitest for unit tests.
- Playwright for smoke/e2e tests.
- ESLint and TypeScript strict mode.

## Environment variables

See `.env.example`.

Important:

- `ORBITAI_API_KEY` must never be exposed in client code.
- Do not use `NEXT_PUBLIC_` for secrets.
- `NEXT_PUBLIC_*` is allowed only for non-secret public flags, app URL, and public map style URLs.

## Demo data requirements

Seeded hero story:

> Shanghai company **DragonCellar Premium** wants to secure proprietary European/North American supply for premium red and white wine bundles. They have a $3M–$12M strategic investment budget and want one supply contract, one minority investment, and one acquisition candidate.

Seeded top opportunities:

1. **Domaine Valclaire** — Languedoc, France — strong acquisition fit, moderate drought risk.
2. **Quinta Vale Claro** — Douro, Portugal — strong supply/investment fit, high China premium fit.
3. **Weingut Rheinblick** — Rheinhessen, Germany — white wine growth thesis, low heat risk, strong export readiness.
4. **Bodega Sierra Azul** — Rioja, Spain — strong red wine brand fit, medium owner openness.
5. **Willamette Crest Vineyard** — Oregon, USA — premium pinot, high price, strong brand fit.
6. **Okanagan North Bench** — Canada — climate story, smaller scale, medium export readiness.

Add at least six more candidates.

## Visual design

- Professional, premium, international.
- Avoid cheesy wine imagery.
- Use a dark/navy or off-white deal-room interface with burgundy/gold accents if desired.
- Map + scorecards must be highly demoable.
- Evidence provenance labels must be visible.
- Bilingual summaries are useful, but primary UI must be English.

## Pitch/demo path

The demo should take 60–90 seconds:

1. “Chinese wine companies are moving from simple importing to supply control.”
2. Open VineScout with DragonCellar profile.
3. Show ranked vineyard shortlist.
4. Open Domaine Valclaire diligence room.
5. Show harvest-risk signals and evidence labels.
6. Click “Generate OrbitAI validation task.”
7. Paste seeded Eye-of-God result or show pre-loaded result.
8. Generate deal memo and owner outreach.
9. Show watchlist/API page briefly.
10. Close with: “This turns weeks of cross-border vineyard diligence into one AI workflow.”

## Acceptance criteria

A build is acceptable only if all are true:

- App runs locally without external credentials.
- App can deploy to Vercel.
- Landing page, dashboard, intake, search, vineyard diligence room, OrbitAI task studio, memo generation, and API playground exist.
- At least 12 seeded opportunities exist.
- The hero demo path works end-to-end.
- AI provider fallback works when OrbitAI key is missing.
- OrbitAI provider can be configured by env and is server-only.
- Eye-of-God manual handoff exists.
- Harvest-risk outputs include caveats.
- Deal memo generation works.
- Outreach generation works.
- Map and charts render.
- OpenAPI JSON exists.
- Tests cover scoring, AI fallback, and API health.
- Lint/typecheck/test/build pass before final commit when practical.

## Verification plan

Codex must run, at minimum:

```bash
npm install
npm run lint
npm run typecheck
npm test
npm run build
```

If Playwright is implemented:

```bash
npm run test:e2e
```

For UI changes, generate screenshots if practical:

- Landing page.
- Search/ranking page.
- Vineyard diligence room.
- OrbitAI task studio.
- Deal memo page.

## Security and privacy

- Do not commit `.env`, API keys, generated wallets, local DBs, keystores, logs containing secrets, or local paths.
- Do not expose server secrets through `NEXT_PUBLIC_*` variables or browser code.
- Hosted write APIs must stay server-only, admin-token protected, allowlisted, idempotent where possible, and testnet-only if any chain feature is added.
- Remove author names, local machine paths, and personal identifiers from committed files.

## Non-goals

- No real investment advice.
- No real legal advice.
- No claim that satellite data proves final wine quality.
- No fake direct satellite tasking.
- No marketplace payments in the MVP.
- No scraping private broker listings without permission.
- No alcohol-commerce checkout or consumer alcohol sales.

## Product risks and mitigations

| Risk | Mitigation |
|---|---|
| Off-brief versus hackathon sectors | Frame as consumer/DTC + Western localization and strategic supply acquisition. |
| Wine importers are not startups | Pitch Chinese premium beverage startups and DTC companies, not traditional importers only. |
| Satellite quality overclaim | Use harvest-risk and vineyard-health proxies; add caveats. |
| Data availability | Seeded demo plus optional live adapters. |
| OrbitAI access uncertainty | Use API relay if available and Eye-of-God manual handoff always. |
| Niche market | Emphasize high-value diligence, acquisition, and supply-control workflow. |

## Final implementation direction

Build VineScout AI as a polished, working, end-to-end app. It should feel credible enough that a Chinese premium wine company could use it next week to shortlist vineyard opportunities and prepare first outreach, while clearly marking which signals are seeded, public, or OrbitAI-validated.
