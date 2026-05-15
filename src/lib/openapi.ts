export const openApiSpec = {
  openapi: "3.1.0",
  info: {
    title: "VineScout AI API",
    version: "0.1.0",
    description:
      "Developer API for seeded vineyard diligence, harvest-risk scoring, OrbitAI handoff prompts, memos, outreach, imports, and alerts."
  },
  servers: [{ url: "/api" }],
  paths: {
    "/health": { get: { summary: "Health and provider status", responses: { "200": { description: "OK" } } } },
    "/vineyards": { get: { summary: "List ranked seeded vineyards", responses: { "200": { description: "Vineyards" } } } },
    "/vineyards/{id}": {
      get: {
        summary: "Get vineyard diligence data",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "Vineyard" }, "404": { description: "Not found" } }
      }
    },
    "/vineyards/search": { post: { summary: "Search and filter ranked vineyards", responses: { "200": { description: "Results" } } } },
    "/vineyards/import-csv": { post: { summary: "Import vineyard candidates from CSV", responses: { "200": { description: "Import result" } } } },
    "/buyer-profile": { post: { summary: "Create or update a buyer profile", responses: { "200": { description: "Buyer profile" } } } },
    "/score": { post: { summary: "Score a vineyard against the demo buyer profile", responses: { "200": { description: "Score" } } } },
    "/weather": { get: { summary: "Fetch optional Open-Meteo weather risk proxy", responses: { "200": { description: "Weather risk" } } } },
    "/stac/status": { get: { summary: "Report optional STAC/Copernicus adapter status", responses: { "200": { description: "STAC status" } } } },
    "/orbitai/task-prompt": { post: { summary: "Generate Eye-of-God handoff prompt", responses: { "200": { description: "Prompt" } } } },
    "/orbitai/evidence": { post: { summary: "Attach pasted Eye-of-God result", responses: { "200": { description: "Evidence item" } } } },
    "/memos": { post: { summary: "Generate a deal memo", responses: { "200": { description: "Deal memo" } } } },
    "/outreach": { post: { summary: "Generate outreach pack", responses: { "200": { description: "Outreach pack" } } } },
    "/webhooks/alerts": { post: { summary: "Mock inbound alert webhook", responses: { "200": { description: "Alert" } } } },
    "/openapi.json": { get: { summary: "OpenAPI document", responses: { "200": { description: "OpenAPI" } } } }
  },
  components: {
    schemas: {
      EvidenceSource: {
        type: "string",
        enum: ["seeded_demo", "live_public", "orbitai_relay", "eye_of_god_handoff", "user_uploaded", "unavailable"]
      },
      DealType: {
        type: "string",
        enum: ["supply_contract", "minority_investment", "acquisition", "joint_venture"]
      }
    }
  }
};
