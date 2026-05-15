import { describe, expect, it } from "vitest";
import { demoBuyerProfile, seededVineyards } from "@/lib/seed-data";
import { calculateHarvestRisk, calculateOverallFit, rankOpportunities } from "@/lib/scoring";

describe("transparent scoring", () => {
  it("calculates harvest risk from the documented weighted formula", () => {
    const signal = {
      id: "s",
      vineyardId: "v",
      date: "2026-05-01",
      ndviProxy: 70,
      eviProxy: 70,
      canopyUniformity: 80,
      droughtStress: 40,
      heatRisk: 50,
      frostRisk: 20,
      smokeRisk: 10,
      diseaseAnomalyProxy: 30,
      source: "seeded_demo" as const
    };
    expect(calculateHarvestRisk(signal)).toBe(31);
  });

  it("ranks Domaine Valclaire as a strong DragonCellar fit", () => {
    const ranked = rankOpportunities(seededVineyards, demoBuyerProfile);
    expect(ranked[0].overallFitScore).toBeGreaterThanOrEqual(80);
    expect(ranked.map((item) => item.id)).toContain("domaine-valclaire");
  });

  it("returns a recommendation and caveated explanation", () => {
    const score = calculateOverallFit(seededVineyards[0], demoBuyerProfile);
    expect(score.recommendation).toMatch(/acquire|invest|buy_supply|watch|reject/);
    expect(score.explanation.join(" ")).toContain("Harvest risk");
  });
});
