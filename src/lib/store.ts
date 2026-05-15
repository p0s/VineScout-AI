import { parseVineyardCsv } from "./csv-import";
import type { BuyerProfile, EvidenceItem, WatchAlert, VineyardOpportunity } from "./types";
import { demoBuyerProfile, seededAlerts, seededVineyards } from "./seed-data";
import { evidenceInputSchema, vineyardSearchSchema } from "./schemas";
import { calculateOverallFit, rankOpportunities } from "./scoring";
import { getSupabaseMode } from "./supabase-adapter";
import { slugId } from "./utils";

const buyerProfiles = new Map<string, BuyerProfile>([[demoBuyerProfile.id, demoBuyerProfile]]);
const vineyards = new Map<string, VineyardOpportunity>(seededVineyards.map((vineyard) => [vineyard.id, vineyard]));
const alerts = new Map<string, WatchAlert>(seededAlerts.map((alert) => [alert.id, alert]));

export function getBuyerProfile(id = demoBuyerProfile.id): BuyerProfile {
  return buyerProfiles.get(id) ?? demoBuyerProfile;
}

export function saveBuyerProfile(input: Partial<BuyerProfile>): BuyerProfile {
  const timestamp = new Date().toISOString();
  const profile: BuyerProfile = {
    ...demoBuyerProfile,
    ...input,
    id: input.id ?? slugId("buyer"),
    createdAt: input.createdAt ?? timestamp,
    updatedAt: timestamp
  };
  buyerProfiles.set(profile.id, profile);
  return profile;
}

export function listVineyards(profile = demoBuyerProfile): VineyardOpportunity[] {
  return rankOpportunities(Array.from(vineyards.values()), profile);
}

export function getVineyard(id: string): VineyardOpportunity | undefined {
  return vineyards.get(id);
}

export function searchVineyards(payload: unknown, profile = demoBuyerProfile): VineyardOpportunity[] {
  const filters = vineyardSearchSchema.parse(payload ?? {});
  return listVineyards(profile).filter((vineyard) => {
    if (filters.countries?.length && !filters.countries.includes(vineyard.country)) return false;
    if (filters.varietal && !vineyard.varietals.some((item) => item.toLowerCase().includes(filters.varietal!.toLowerCase()))) {
      return false;
    }
    if (filters.dealType && !vineyard.dealTypes.includes(filters.dealType)) return false;
    if (filters.minOverallFit && vineyard.overallFitScore < filters.minOverallFit) return false;
    if (filters.maxHarvestRisk && vineyard.harvestRiskScore > filters.maxHarvestRisk) return false;
    if (filters.minChinaFit && vineyard.chinaPremiumFitScore < filters.minChinaFit) return false;
    if (filters.minExportReadiness && vineyard.exportReadinessScore < filters.minExportReadiness) return false;
    if (filters.query) {
      const haystack = `${vineyard.name} ${vineyard.region} ${vineyard.country} ${vineyard.varietals.join(" ")}`.toLowerCase();
      if (!haystack.includes(filters.query.toLowerCase())) return false;
    }
    return true;
  });
}

export function scoreVineyard(id: string, profile = demoBuyerProfile) {
  const vineyard = getVineyard(id);
  if (!vineyard) return undefined;
  return calculateOverallFit(vineyard, profile);
}

export function addEyeOfGodEvidence(payload: unknown): EvidenceItem {
  const input = evidenceInputSchema.parse(payload);
  const vineyard = getVineyard(input.opportunityId);
  if (!vineyard) throw new Error("Vineyard not found");
  const evidence: EvidenceItem = {
    id: slugId("evidence"),
    opportunityId: input.opportunityId,
    type: "orbitai",
    source: "eye_of_god_handoff",
    title: input.title,
    summary: input.rawText.slice(0, 240),
    rawText: input.rawText,
    confidence: input.rawText.toLowerCase().includes("confidence: high") ? 84 : 76,
    observedAt: new Date().toISOString(),
    createdAt: new Date().toISOString()
  };
  const updated = {
    ...vineyard,
    evidence: [evidence, ...vineyard.evidence],
    confidence: Math.min(100, vineyard.confidence + 8),
    updatedAt: new Date().toISOString()
  };
  vineyards.set(vineyard.id, updated);
  return evidence;
}

export function listAlerts() {
  return Array.from(alerts.values());
}

export function importVineyardCsv(csv: string) {
  const result = parseVineyardCsv(csv);
  for (const vineyard of result.imported) {
    vineyards.set(vineyard.id, vineyard);
  }
  return result;
}

export function addWebhookAlert(input: Partial<WatchAlert> & { opportunityId: string; title: string }): WatchAlert {
  const alert: WatchAlert = {
    id: input.id ?? slugId("alert"),
    opportunityId: input.opportunityId,
    title: input.title,
    severity: input.severity ?? "medium",
    source: input.source ?? "user_uploaded",
    createdAt: input.createdAt ?? new Date().toISOString()
  };
  alerts.set(alert.id, alert);
  return alert;
}

export function getStoreMode() {
  return {
    mode: "local_seeded",
    supabase: getSupabaseMode()
  };
}
