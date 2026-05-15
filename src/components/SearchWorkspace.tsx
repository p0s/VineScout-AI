"use client";

import { useMemo, useState } from "react";
import type { VineyardOpportunity } from "@/lib/types";
import { OpportunityMap } from "./OpportunityMap";
import { VineyardCard } from "./VineyardCard";

export function SearchWorkspace({ vineyards }: { vineyards: VineyardOpportunity[] }) {
  const [country, setCountry] = useState("All");
  const [dealType, setDealType] = useState("All");
  const [maxRisk, setMaxRisk] = useState(100);
  const [query, setQuery] = useState("");

  const countries = useMemo(() => ["All", ...Array.from(new Set(vineyards.map((vineyard) => vineyard.country))).sort()], [vineyards]);
  const filtered = vineyards.filter((vineyard) => {
    if (country !== "All" && vineyard.country !== country) return false;
    if (dealType !== "All" && !vineyard.dealTypes.includes(dealType as never)) return false;
    if (vineyard.harvestRiskScore > maxRisk) return false;
    if (query && !`${vineyard.name} ${vineyard.region} ${vineyard.varietals.join(" ")}`.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="grid two">
      <section className="grid">
        <div className="workspace">
          <div className="form-grid">
            <label>
              Search
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Rioja, Riesling, Pinot..." />
            </label>
            <label>
              Country
              <select value={country} onChange={(event) => setCountry(event.target.value)}>
                {countries.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
            <label>
              Deal type
              <select value={dealType} onChange={(event) => setDealType(event.target.value)}>
                <option>All</option>
                <option value="supply_contract">Supply contract</option>
                <option value="minority_investment">Minority investment</option>
                <option value="acquisition">Acquisition</option>
                <option value="joint_venture">Joint venture</option>
              </select>
            </label>
            <label>
              Max harvest risk: {maxRisk}
              <input min="0" max="100" type="range" value={maxRisk} onChange={(event) => setMaxRisk(Number(event.target.value))} />
            </label>
          </div>
        </div>
        <div className="opportunity-list">
          {filtered.map((vineyard) => (
            <VineyardCard vineyard={vineyard} key={vineyard.id} />
          ))}
        </div>
      </section>
      <aside className="workspace">
        <h3>Ranked map</h3>
        <OpportunityMap vineyards={filtered} />
        <p>{filtered.length} matching fictional opportunities. Scores update deterministically from the transparent formulas.</p>
      </aside>
    </div>
  );
}
