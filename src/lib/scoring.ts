import type { BuyerProfile, DealMemo, HarvestSignal, ScoreBreakdown, VineyardOpportunity } from "./types";
import { clampScore } from "./utils";

export function calculateHarvestRisk(signal: HarvestSignal): number {
  return clampScore(
    0.25 * signal.droughtStress +
      0.2 * signal.heatRisk +
      0.15 * signal.frostRisk +
      0.15 * signal.smokeRisk +
      0.15 * signal.diseaseAnomalyProxy +
      0.1 * (100 - signal.canopyUniformity)
  );
}

export function averageHarvestRisk(signals: HarvestSignal[]): number {
  if (signals.length === 0) return 55;
  return clampScore(signals.reduce((sum, signal) => sum + calculateHarvestRisk(signal), 0) / signals.length);
}

export function calculateDealTypeFit(opportunity: VineyardOpportunity, profile: BuyerProfile): number {
  const matches = opportunity.dealTypes.filter((dealType) => profile.preferredDealTypes.includes(dealType));
  if (matches.length === 0) return 25;
  return clampScore(60 + (matches.length / profile.preferredDealTypes.length) * 40);
}

export function calculateBudgetFit(opportunity: VineyardOpportunity, profile: BuyerProfile): number {
  const minBudget = profile.budgetMinUsd ?? 0;
  const maxBudget = profile.budgetMaxUsd ?? Number.POSITIVE_INFINITY;
  const price = opportunity.indicativePriceUsd ?? opportunity.investmentRangeUsd?.[0];
  if (!price) return 70;
  if (price >= minBudget && price <= maxBudget) return 100;
  if (price < minBudget) return 82;
  const overage = (price - maxBudget) / Math.max(maxBudget, 1);
  return clampScore(85 - overage * 100);
}

export function calculateConfidence(opportunity: VineyardOpportunity): number {
  const sources = new Set(opportunity.evidence.map((item) => item.source));
  let confidence = 78;
  if (sources.has("eye_of_god_handoff")) confidence += 10;
  if (sources.has("orbitai_relay")) confidence += 6;
  if (sources.has("live_public")) confidence += 4;
  if (sources.has("unavailable")) confidence -= 12;
  if (sources.size === 1 && sources.has("seeded_demo")) confidence -= 8;
  return clampScore(confidence);
}

export function calculateOverallFit(opportunity: VineyardOpportunity, profile: BuyerProfile): ScoreBreakdown {
  const harvestRisk = averageHarvestRisk(opportunity.signals);
  const harvestRiskInverted = 100 - harvestRisk;
  const dealTypeFit = calculateDealTypeFit(opportunity, profile);
  const budgetFit = calculateBudgetFit(opportunity, profile);
  const overallFit = clampScore(
    0.25 * opportunity.chinaPremiumFitScore +
      0.2 * dealTypeFit +
      0.2 * opportunity.exportReadinessScore +
      0.15 * harvestRiskInverted +
      0.1 * opportunity.ownerOpennessScore +
      0.1 * budgetFit
  );

  const recommendation = recommend(opportunity, {
    overallFit,
    dealTypeFit,
    budgetFit,
    harvestRisk,
    harvestRiskInverted,
    confidence: calculateConfidence(opportunity),
    recommendation: "watch",
    explanation: []
  });

  return {
    overallFit,
    dealTypeFit,
    budgetFit,
    harvestRisk,
    harvestRiskInverted,
    confidence: calculateConfidence(opportunity),
    recommendation,
    explanation: [
      `Overall fit uses 25% China premium fit, 20% deal type fit, 20% export readiness, 15% inverted harvest risk, 10% owner openness, and 10% budget fit.`,
      `Harvest risk is ${harvestRisk}/100 based on drought, heat, frost, smoke, disease-anomaly proxy, and canopy uniformity.`,
      `Confidence reflects available provenance and is lower for seeded-only evidence.`
    ]
  };
}

function recommend(opportunity: VineyardOpportunity, score: ScoreBreakdown): DealMemo["recommendation"] {
  if (score.harvestRisk >= 72 || opportunity.exportReadinessScore < 45 || score.budgetFit < 35) return "reject";
  if (score.confidence < 62 || score.harvestRisk >= 58) return "watch";
  if (
    opportunity.dealTypes.includes("acquisition") &&
    score.overallFit >= 82 &&
    opportunity.climateRiskScore <= 52 &&
    opportunity.ownerOpennessScore >= 70 &&
    opportunity.exportReadinessScore >= 70 &&
    score.budgetFit >= 75
  ) {
    return "acquire";
  }
  if (
    opportunity.dealTypes.includes("minority_investment") &&
    score.overallFit >= 78 &&
    score.harvestRisk <= 55 &&
    opportunity.ownerOpennessScore >= 70
  ) {
    return "invest";
  }
  if (opportunity.exportReadinessScore >= 70 && opportunity.chinaPremiumFitScore >= 72 && score.harvestRisk <= 60) {
    return "buy_supply";
  }
  return "watch";
}

export function rankOpportunities(opportunities: VineyardOpportunity[], profile: BuyerProfile[]): VineyardOpportunity[];
export function rankOpportunities(opportunities: VineyardOpportunity[], profile: BuyerProfile): VineyardOpportunity[];
export function rankOpportunities(
  opportunities: VineyardOpportunity[],
  profile: BuyerProfile | BuyerProfile[]
): VineyardOpportunity[] {
  const buyerProfile = Array.isArray(profile) ? profile[0] : profile;
  return opportunities
    .map((opportunity) => {
      const score = calculateOverallFit(opportunity, buyerProfile);
      return {
        ...opportunity,
        harvestRiskScore: score.harvestRisk,
        overallFitScore: score.overallFit,
        confidence: score.confidence
      };
    })
    .sort((a, b) => b.overallFitScore - a.overallFitScore);
}
