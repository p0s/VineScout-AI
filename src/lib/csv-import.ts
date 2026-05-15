import type { VineyardOpportunity } from "./types";
import { averageHarvestRisk, calculateConfidence, calculateOverallFit } from "./scoring";
import { demoBuyerProfile } from "./seed-data";
import { slugId } from "./utils";

export type CsvImportResult = {
  imported: VineyardOpportunity[];
  skippedRows: number;
};

type CsvRow = Record<string, string>;

export function parseVineyardCsv(csv: string): CsvImportResult {
  const rows = parseCsv(csv);
  const imported = rows
    .filter((row) => row.name && row.country && row.region)
    .map((row) => buildImportedVineyard(row));
  return {
    imported,
    skippedRows: rows.length - imported.length
  };
}

function buildImportedVineyard(row: CsvRow): VineyardOpportunity {
  const id = row.id || slugId("csv_vineyard");
  const now = new Date().toISOString();
  const signal = {
    id: `${id}_signal_1`,
    vineyardId: id,
    date: now.slice(0, 10),
    ndviProxy: numberOr(row.ndviProxy, 68),
    eviProxy: numberOr(row.eviProxy, 64),
    canopyUniformity: numberOr(row.canopyUniformity, 70),
    droughtStress: numberOr(row.droughtStress, 38),
    heatRisk: numberOr(row.heatRisk, 35),
    frostRisk: numberOr(row.frostRisk, 20),
    smokeRisk: numberOr(row.smokeRisk, 12),
    diseaseAnomalyProxy: numberOr(row.diseaseAnomalyProxy, 18),
    source: "user_uploaded" as const,
    notes: "Imported from user CSV."
  };
  const base: VineyardOpportunity = {
    id,
    name: row.name,
    fictionalDemo: false,
    region: row.region,
    country: row.country,
    lat: numberOr(row.lat, 0),
    lng: numberOr(row.lng, 0),
    hectares: numberOr(row.hectares, 0),
    varietals: splitList(row.varietals || "Unknown"),
    annualProductionBottles: numberOr(row.annualProductionBottles, 0),
    dealTypes: ["supply_contract"],
    indicativePriceUsd: numberOr(row.indicativePriceUsd, 0) || undefined,
    ownerOpennessScore: numberOr(row.ownerOpennessScore, 55),
    exportReadinessScore: numberOr(row.exportReadinessScore, 55),
    chinaPremiumFitScore: numberOr(row.chinaPremiumFitScore, 55),
    climateRiskScore: numberOr(row.climateRiskScore, 45),
    harvestRiskScore: averageHarvestRisk([signal]),
    overallFitScore: 0,
    confidence: 0,
    topReasons: [row.topReason || "Imported candidate for manual diligence."],
    redFlags: [row.redFlag || "User-uploaded row requires source validation."],
    evidence: [
      {
        id: `${id}_csv_evidence`,
        opportunityId: id,
        type: "user_document",
        source: "user_uploaded",
        title: "CSV imported candidate",
        summary: "Candidate came from a user-provided CSV row.",
        confidence: 48,
        createdAt: now
      }
    ],
    signals: [signal],
    dueDiligenceNotes: ["Validate all CSV fields against owner, broker, and parcel documentation."],
    contact: {
      name: row.contactName || "CSV contact placeholder",
      role: row.contactRole || "User-uploaded contact",
      email: row.contactEmail || "csv-contact@example-vineyard.test"
    },
    createdAt: now,
    updatedAt: now
  };
  const score = calculateOverallFit(base, demoBuyerProfile);
  return {
    ...base,
    harvestRiskScore: score.harvestRisk,
    overallFitScore: score.overallFit,
    confidence: calculateConfidence(base)
  };
}

function parseCsv(csv: string): CsvRow[] {
  const lines = csv
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  if (lines.length < 2) return [];
  const headers = splitCsvLine(lines[0]).map((header) => header.trim());
  return lines.slice(1).map((line) => {
    const values = splitCsvLine(line);
    return Object.fromEntries(headers.map((header, index) => [header, values[index]?.trim() ?? ""]));
  });
}

function splitCsvLine(line: string): string[] {
  const values: string[] = [];
  let current = "";
  let quoted = false;
  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    if (char === '"') {
      quoted = !quoted;
    } else if (char === "," && !quoted) {
      values.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  values.push(current);
  return values.map((value) => value.replace(/^"|"$/g, "").replaceAll('""', '"'));
}

function splitList(value: string): string[] {
  return value
    .split(/[|;]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function numberOr(value: string | undefined, fallback: number): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}
