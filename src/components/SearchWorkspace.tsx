"use client";

import { useMemo, useState } from "react";
import type { VineyardOpportunity } from "@/lib/types";
import { OpportunityMap } from "./OpportunityMap";
import { VineyardCard } from "./VineyardCard";

export function SearchWorkspace({ vineyards }: { vineyards: VineyardOpportunity[] }) {
  const [country, setCountry] = useState("All");
  const [region, setRegion] = useState("All");
  const [dealType, setDealType] = useState("All");
  const [maxPrice, setMaxPrice] = useState(25000000);
  const [maxRisk, setMaxRisk] = useState(100);
  const [minChinaFit, setMinChinaFit] = useState(0);
  const [minExportReadiness, setMinExportReadiness] = useState(0);
  const [query, setQuery] = useState("");

  const countries = useMemo(() => ["All", ...Array.from(new Set(vineyards.map((vineyard) => vineyard.country))).sort()], [vineyards]);
  const regions = useMemo(() => ["All", ...Array.from(new Set(vineyards.map((vineyard) => vineyard.region))).sort()], [vineyards]);
  const filtered = useMemo(
    () =>
      vineyards.filter((vineyard) => {
        if (country !== "All" && vineyard.country !== country) return false;
        if (region !== "All" && vineyard.region !== region) return false;
        if (dealType !== "All" && !vineyard.dealTypes.includes(dealType as never)) return false;
        const price = vineyard.indicativePriceUsd ?? vineyard.investmentRangeUsd?.[0] ?? 0;
        if (price > maxPrice) return false;
        if (vineyard.harvestRiskScore > maxRisk) return false;
        if (vineyard.chinaPremiumFitScore < minChinaFit) return false;
        if (vineyard.exportReadinessScore < minExportReadiness) return false;
        if (
          query &&
          !`${vineyard.name} ${vineyard.region} ${vineyard.country} ${vineyard.varietals.join(" ")}`.toLowerCase().includes(query.toLowerCase())
        ) {
          return false;
        }
        return true;
      }),
    [country, dealType, maxPrice, maxRisk, minChinaFit, minExportReadiness, query, region, vineyards]
  );
  const visibleCards = filtered.slice(0, 36);

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
              Region
              <select value={region} onChange={(event) => setRegion(event.target.value)}>
                {regions.map((item) => (
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
              Max price: ${(maxPrice / 1000000).toFixed(0)}M
              <input min="1000000" max="25000000" step="500000" type="range" value={maxPrice} onChange={(event) => setMaxPrice(Number(event.target.value))} />
            </label>
            <label>
              Max harvest risk: {maxRisk}
              <input min="0" max="100" type="range" value={maxRisk} onChange={(event) => setMaxRisk(Number(event.target.value))} />
            </label>
            <label>
              Min China fit: {minChinaFit}
              <input min="0" max="100" type="range" value={minChinaFit} onChange={(event) => setMinChinaFit(Number(event.target.value))} />
            </label>
            <label>
              Min export readiness: {minExportReadiness}
              <input
                min="0"
                max="100"
                type="range"
                value={minExportReadiness}
                onChange={(event) => setMinExportReadiness(Number(event.target.value))}
              />
            </label>
          </div>
        </div>
        <p className="muted">
          Showing top {visibleCards.length} ranked cards from {filtered.length} globe-mapped opportunities.
        </p>
        <div className="opportunity-list">
          {visibleCards.map((vineyard) => (
            <VineyardCard vineyard={vineyard} key={vineyard.id} />
          ))}
        </div>
      </section>
      <aside className="globe-panel">
        <h3>3D vineyard globe</h3>
        <OpportunityMap vineyards={filtered} />
        <p>{filtered.length} matching fictional opportunities. Scores update deterministically from the transparent formulas.</p>
      </aside>
    </div>
  );
}
