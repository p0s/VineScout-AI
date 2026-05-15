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
    label: "CSV import",
    method: "POST",
    path: "/api/vineyards/import-csv",
    body:
      '{ "csv": "name,region,country,lat,lng,hectares,varietals\\\\nDemo Import Estate,Test Valley,France,43.7,3.9,12,Syrah|Grenache" }'
  },
  {
    label: "Alert webhook",
    method: "POST",
    path: "/api/webhooks/alerts",
    body: '{ "opportunityId": "domaine-valclaire", "title": "Webhook mock: follow-up due", "severity": "medium" }'
  }
];

export function ApiPlayground() {
  const [example, setExample] = useState(examples[0]);
  const [result, setResult] = useState("");

  async function run() {
    const response = await fetch(example.path, {
      method: example.method,
      headers: example.method === "POST" ? { "content-type": "application/json" } : undefined,
      body: example.method === "POST" ? example.body : undefined
    });
    setResult(JSON.stringify(await response.json(), null, 2));
  }

  return (
    <div className="grid two">
      <section className="workspace">
        <label>
          Endpoint
          <select
            value={example.label}
            onChange={(event) => setExample(examples.find((item) => item.label === event.target.value) ?? examples[0])}
          >
            {examples.map((item) => (
              <option key={item.label}>{item.label}</option>
            ))}
          </select>
        </label>
        <pre>{`curl -X ${example.method} ${example.path}${example.body ? ` \\\n  -H "content-type: application/json" \\\n  -d '${example.body}'` : ""}`}</pre>
        {example.body ? <textarea value={example.body} readOnly /> : null}
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
