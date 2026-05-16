const baseUrl = (process.env.E2E_BASE_URL ?? "http://127.0.0.1:3000").replace(/\/$/, "");

const pages = [
  ["/", "VineScout AI"],
  ["/app", "Opportunity command room"],
  ["/app/intake", "Buyer profile"],
  ["/app/search", "3D vineyard globe"],
  ["/app/vineyards/domaine-valclaire", "Domaine Valclaire"],
  ["/app/orbitai", "Eye-of-God manual handoff"],
  ["/app/memos", "Deal memo"],
  ["/app/api-playground", "SDK snippet"],
  ["/presentation", "wine import rebound needs better vineyard deal flow"]
];

const apiChecks = [
  ["GET", "/api/health"],
  ["GET", "/api/openapi.json"],
  ["POST", "/api/vineyards/search", { countries: ["France"], maxHarvestRisk: 60 }],
  ["POST", "/api/score", { opportunityId: "domaine-valclaire" }],
  ["POST", "/api/orbitai/task-prompt", { opportunityId: "domaine-valclaire" }],
  ["POST", "/api/memos", { opportunityId: "domaine-valclaire" }],
  ["POST", "/api/outreach", { opportunityId: "domaine-valclaire" }]
];

async function readText(path, init) {
  const response = await fetch(`${baseUrl}${path}`, init);
  const text = await response.text();
  return { response, text };
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

for (const [path, marker] of pages) {
  const { response, text } = await readText(path);
  assert(response.ok, `${path} returned ${response.status}`);
  assert(text.includes(marker), `${path} did not include marker ${marker}`);
}

for (const [method, path, body] of apiChecks) {
  const { response, text } = await readText(path, {
    method,
    headers: body ? { "content-type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined
  });
  assert(response.ok, `${method} ${path} returned ${response.status}: ${text.slice(0, 160)}`);
}

for (const [path, body] of [
  ["/api/buyer-profile", { companyName: "E2E Demo Importer" }],
  ["/api/orbitai/evidence", { opportunityId: "domaine-valclaire", rawText: "Confidence: high. E2E evidence paste." }],
  ["/api/webhooks/alerts", { opportunityId: "domaine-valclaire", title: "E2E alert" }]
]) {
  const { response } = await readText(path, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body)
  });
  assert([200, 401, 503].includes(response.status), `protected ${path} returned unexpected ${response.status}`);
}

console.log(
  JSON.stringify(
    {
      ok: true,
      baseUrl,
      pages: pages.length,
      apiChecks: apiChecks.length,
      protectedWritePolicy: "anonymous hosted writes return 401 or 503; local dev may return 200"
    },
    null,
    2
  )
);
