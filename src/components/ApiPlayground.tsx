"use client";

import { useState } from "react";
import { typescriptSdkSnippet } from "@/lib/sdk-snippet";

const examples = [
  { label: "Health", method: "GET", path: "/api/health", body: "" },
  { label: "Vineyards", method: "GET", path: "/api/vineyards", body: "" },
  { label: "Search", method: "POST", path: "/api/vineyards/search", body: '{ "countries": ["France"], "maxHarvestRisk": 55 }' },
  { label: "Score", method: "POST", path: "/api/score", body: '{ "opportunityId": "domaine-valclaire" }' },
  { label: "Weather", method: "GET", path: "/api/weather?lat=43.61&lng=3.88", body: "" },
  { label: "STAC status", method: "GET", path: "/api/stac/status", body: "" },
  { label: "OrbitAI task", method: "POST", path: "/api/orbitai/task-prompt", body: '{ "opportunityId": "domaine-valclaire" }' },
  {
    label: "Buyer profile",
    method: "POST",
    path: "/api/buyer-profile",
    protected: true,
    body:
      '{ "companyName": "Demo Importer", "targetCountries": ["France", "Canada"], "preferredDealTypes": ["supply_contract"], "riskAppetite": "medium" }'
  },
  {
    label: "Eye-of-God evidence",
    method: "POST",
    path: "/api/orbitai/evidence",
    protected: true,
    body:
      '{ "opportunityId": "domaine-valclaire", "title": "Eye-of-God manual handoff", "rawText": "Confidence: high. Vigor appears uniform with limited drought stress in the selected block." }'
  },
  {
    label: "CSV import",
    method: "POST",
    path: "/api/vineyards/import-csv",
    protected: true,
    body:
      '{ "csv": "name,region,country,lat,lng,hectares,varietals\\\\nDemo Import Estate,Test Valley,France,43.7,3.9,12,Syrah|Grenache" }'
  },
  {
    label: "Alert webhook",
    method: "POST",
    path: "/api/webhooks/alerts",
    protected: true,
    body: '{ "opportunityId": "domaine-valclaire", "title": "Webhook mock: follow-up due", "severity": "medium" }'
  }
];

export function ApiPlayground() {
  const [example, setExample] = useState(examples[0]);
  const [body, setBody] = useState(examples[0].body);
  const [adminToken, setAdminToken] = useState("");
  const [result, setResult] = useState("");

  async function run() {
    const headers = new Headers();
    if (example.method === "POST") headers.set("content-type", "application/json");
    if (example.protected && adminToken) headers.set("x-vinescout-admin-token", adminToken);
    const response = await fetch(example.path, {
      method: example.method,
      headers,
      body: example.method === "POST" ? body : undefined
    });
    const text = await response.text();
    try {
      setResult(JSON.stringify(JSON.parse(text), null, 2));
    } catch {
      setResult(text);
    }
  }

  return (
    <div className="grid two">
      <section className="workspace">
        <label>
          Endpoint
          <select
            value={example.label}
            onChange={(event) => {
              const next = examples.find((item) => item.label === event.target.value) ?? examples[0];
              setExample(next);
              setBody(next.body);
            }}
          >
            {examples.map((item) => (
              <option key={item.label}>{item.label}</option>
            ))}
          </select>
        </label>
        {example.protected ? (
          <label>
            Admin token
            <input
              type="password"
              value={adminToken}
              onChange={(event) => setAdminToken(event.target.value)}
              placeholder="Required only for protected hosted writes"
            />
          </label>
        ) : null}
        <pre>{`curl -X ${example.method} ${example.path}${example.body ? ` \\\n  -H "content-type: application/json"` : ""}${
          example.protected ? ` \\\n  -H "x-vinescout-admin-token: <admin-token>"` : ""
        }${example.body ? ` \\\n  -d '${body}'` : ""}`}</pre>
        {example.body ? <textarea value={body} onChange={(event) => setBody(event.target.value)} /> : null}
        {example.protected ? <p className="caveat">Hosted write endpoints stay server-only and require an admin token.</p> : null}
        <button className="button" type="button" onClick={run}>
          Try endpoint
        </button>
      </section>
      <aside className="grid">
        <div className="memo-output">{result || "Endpoint response appears here."}</div>
        <div className="workspace">
          <h3>SDK snippet</h3>
          <pre>{typescriptSdkSnippet}</pre>
        </div>
      </aside>
    </div>
  );
}
