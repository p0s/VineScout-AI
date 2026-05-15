const json = { "application/json": { schema: { type: "object" } } };

const adminSecurity = [{ AdminToken: [] }];

export const openApiSpec = {
  openapi: "3.1.0",
  info: {
    title: "VineScout AI API",
    version: "0.1.0",
    description:
      "Developer API for seeded vineyard diligence, transparent scoring, harvest-risk signals, OrbitAI handoff prompts, memos, outreach, imports, and watchlist alerts."
  },
  servers: [{ url: "/api" }],
  paths: {
    "/health": {
      get: {
        summary: "Health and provider status",
        responses: { "200": { description: "OK", content: json } }
      }
    },
    "/vineyards": {
      get: {
        summary: "List ranked seeded vineyards",
        responses: { "200": { description: "Ranked vineyards", content: json } }
      }
    },
    "/vineyards/{id}": {
      get: {
        summary: "Get vineyard diligence data",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          "200": { description: "Vineyard", content: json },
          "404": { description: "Not found", content: json }
        }
      }
    },
    "/vineyards/search": {
      post: {
        summary: "Search and filter ranked vineyards",
        requestBody: {
          required: false,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/VineyardSearch" },
              examples: {
                franceLowRisk: { value: { countries: ["France"], maxHarvestRisk: 55, minChinaFit: 70 } }
              }
            }
          }
        },
        responses: { "200": { description: "Search results", content: json } }
      }
    },
    "/vineyards/import-csv": {
      post: {
        summary: "Import vineyard candidates from CSV",
        security: adminSecurity,
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { type: "object", required: ["csv"], properties: { csv: { type: "string" } } }
            }
          }
        },
        responses: {
          "200": { description: "Import result", content: json },
          "401": { description: "Admin token required", content: json },
          "503": { description: "Hosted write API disabled", content: json }
        }
      }
    },
    "/buyer-profile": {
      post: {
        summary: "Create or update a buyer profile",
        security: adminSecurity,
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/BuyerProfileInput" } } }
        },
        responses: {
          "200": { description: "Buyer profile and strategy", content: json },
          "401": { description: "Admin token required", content: json },
          "503": { description: "Hosted write API disabled", content: json }
        }
      }
    },
    "/score": {
      post: {
        summary: "Score a vineyard against the demo buyer profile",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { type: "object", required: ["opportunityId"], properties: { opportunityId: { type: "string" } } }
            }
          }
        },
        responses: { "200": { description: "Score", content: json } }
      }
    },
    "/weather": {
      get: {
        summary: "Fetch optional Open-Meteo weather risk proxy",
        parameters: [
          { name: "lat", in: "query", required: true, schema: { type: "number" } },
          { name: "lng", in: "query", required: true, schema: { type: "number" } }
        ],
        responses: { "200": { description: "Weather risk or unavailable provenance", content: json } }
      }
    },
    "/stac/status": {
      get: {
        summary: "Report optional STAC/Copernicus adapter status",
        responses: { "200": { description: "STAC status", content: json } }
      }
    },
    "/orbitai/task-prompt": {
      post: {
        summary: "Generate Eye-of-God handoff prompt",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { type: "object", required: ["opportunityId"], properties: { opportunityId: { type: "string" } } }
            }
          }
        },
        responses: { "200": { description: "Prompt", content: json } }
      }
    },
    "/orbitai/evidence": {
      post: {
        summary: "Attach pasted Eye-of-God result",
        security: adminSecurity,
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/EvidenceInput" } } }
        },
        responses: {
          "200": { description: "Evidence item", content: json },
          "401": { description: "Admin token required", content: json },
          "503": { description: "Hosted write API disabled", content: json }
        }
      }
    },
    "/memos": {
      post: {
        summary: "Generate a deal memo",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { type: "object", required: ["opportunityId"], properties: { opportunityId: { type: "string" } } }
            }
          }
        },
        responses: { "200": { description: "Deal memo", content: json } }
      }
    },
    "/outreach": {
      post: {
        summary: "Generate outreach pack",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { type: "object", required: ["opportunityId"], properties: { opportunityId: { type: "string" } } }
            }
          }
        },
        responses: { "200": { description: "Outreach pack", content: json } }
      }
    },
    "/webhooks/alerts": {
      post: {
        summary: "Mock inbound alert webhook",
        security: adminSecurity,
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["opportunityId", "title"],
                properties: {
                  opportunityId: { type: "string" },
                  title: { type: "string" },
                  severity: { type: "string", enum: ["low", "medium", "high"] }
                }
              }
            }
          }
        },
        responses: {
          "200": { description: "Alert", content: json },
          "401": { description: "Admin token required", content: json },
          "503": { description: "Hosted write API disabled", content: json }
        }
      }
    },
    "/openapi.json": {
      get: {
        summary: "OpenAPI document",
        responses: { "200": { description: "OpenAPI", content: { "application/json": { schema: { type: "object" } } } } }
      }
    }
  },
  components: {
    securitySchemes: {
      AdminToken: {
        type: "apiKey",
        in: "header",
        name: "x-vinescout-admin-token"
      }
    },
    schemas: {
      EvidenceSource: {
        type: "string",
        enum: ["seeded_demo", "live_public", "orbitai_relay", "eye_of_god_handoff", "user_uploaded", "unavailable"]
      },
      DealType: {
        type: "string",
        enum: ["supply_contract", "minority_investment", "acquisition", "joint_venture"]
      },
      BuyerProfileInput: {
        type: "object",
        required: ["companyName"],
        properties: {
          companyName: { type: "string" },
          companyType: { type: "string", enum: ["importer", "dtc_brand", "distributor", "strategic_investor", "family_office", "other"] },
          channels: { type: "array", items: { type: "string" } },
          targetProducts: { type: "array", items: { type: "string" } },
          targetCountries: { type: "array", items: { type: "string" } },
          preferredDealTypes: { type: "array", items: { $ref: "#/components/schemas/DealType" } },
          budgetMinUsd: { type: "number" },
          budgetMaxUsd: { type: "number" },
          targetChinaPriceTier: { type: "string", enum: ["value", "premium", "luxury", "mixed"] },
          riskAppetite: { type: "string", enum: ["low", "medium", "high"] },
          timeline: { type: "string" },
          notes: { type: "string", description: "Optional user-uploaded text summary; files are read client-side in the demo UI." }
        }
      },
      VineyardSearch: {
        type: "object",
        properties: {
          countries: { type: "array", items: { type: "string" } },
          varietal: { type: "string" },
          dealType: { $ref: "#/components/schemas/DealType" },
          minOverallFit: { type: "number" },
          maxHarvestRisk: { type: "number" },
          minChinaFit: { type: "number" },
          minExportReadiness: { type: "number" },
          query: { type: "string" }
        }
      },
      EvidenceInput: {
        type: "object",
        required: ["opportunityId", "rawText"],
        properties: {
          opportunityId: { type: "string" },
          rawText: { type: "string", minLength: 10 },
          title: { type: "string", default: "Eye-of-God pasted result" }
        }
      }
    }
  }
};
