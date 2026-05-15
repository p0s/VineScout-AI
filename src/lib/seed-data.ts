import type { BuyerProfile, DealType, EvidenceItem, HarvestSignal, VineyardOpportunity, WatchAlert } from "./types";
import { averageHarvestRisk, calculateConfidence, calculateOverallFit } from "./scoring";

const now = "2026-05-15T00:00:00.000Z";

export const demoBuyerProfile: BuyerProfile = {
  id: "buyer_dragoncellar",
  companyName: "DragonCellar Premium",
  companyType: "dtc_brand",
  channels: ["Tmall/JD", "restaurants", "private clubs", "direct subscriptions"],
  targetProducts: ["premium red", "white", "private label", "luxury estate"],
  targetCountries: ["France", "Portugal", "Germany", "Spain", "USA", "Canada"],
  preferredDealTypes: ["supply_contract", "minority_investment", "acquisition"],
  budgetMinUsd: 3_000_000,
  budgetMaxUsd: 12_000_000,
  targetChinaPriceTier: "premium",
  riskAppetite: "medium",
  timeline: "Secure two partner vineyards and one acquisition target before Q4 harvest.",
  notes:
    "Wants proprietary Western supply for premium red and white bundles with credible estate storytelling.",
  createdAt: now,
  updatedAt: now
};

type VineyardSeed = {
  id: string;
  name: string;
  region: string;
  country: string;
  lat: number;
  lng: number;
  hectares: number;
  varietals: string[];
  production: number;
  dealTypes: DealType[];
  price?: number;
  range?: [number, number];
  owner: number;
  exportReady: number;
  chinaFit: number;
  climate: number;
  reasons: string[];
  flags: string[];
  contact: string;
  signalBase: Omit<HarvestSignal, "id" | "vineyardId" | "date" | "source">;
};

function signals(id: string, base: VineyardSeed["signalBase"]): HarvestSignal[] {
  const months = ["2025-07-01", "2025-08-01", "2025-09-01", "2026-04-15", "2026-05-01"];
  return months.map((date, index) => ({
    id: `${id}_signal_${index + 1}`,
    vineyardId: id,
    date,
    ndviProxy: Math.max(0, Math.min(100, base.ndviProxy + index * 2 - 3)),
    eviProxy: Math.max(0, Math.min(100, base.eviProxy + index - 2)),
    canopyUniformity: Math.max(0, Math.min(100, base.canopyUniformity + (index % 2 === 0 ? 2 : -2))),
    droughtStress: Math.max(0, Math.min(100, base.droughtStress + index * 2)),
    heatRisk: Math.max(0, Math.min(100, base.heatRisk + index)),
    frostRisk: Math.max(0, Math.min(100, base.frostRisk - index)),
    smokeRisk: Math.max(0, Math.min(100, base.smokeRisk + (index === 2 ? 4 : 0))),
    diseaseAnomalyProxy: Math.max(0, Math.min(100, base.diseaseAnomalyProxy + (index % 2))),
    source: "seeded_demo",
    notes: "Synthetic satellite/weather proxy for demo mode."
  }));
}

function evidence(id: string, country: string): EvidenceItem[] {
  return [
    {
      id: `${id}_evidence_satellite`,
      opportunityId: id,
      type: "satellite_proxy",
      source: "seeded_demo",
      title: "Seeded canopy proxy history",
      summary: "Demo NDVI/EVI-like signals estimate vigor, drought pressure, and parcel uniformity.",
      confidence: 70,
      observedAt: "2026-05-01",
      createdAt: now
    },
    {
      id: `${id}_evidence_export`,
      opportunityId: id,
      type: "export",
      source: "seeded_demo",
      title: `${country} export-readiness proxy`,
      summary: "Fictional compliance readiness derived from documentation, certifications, and broker notes.",
      confidence: 66,
      observedAt: "2026-04-18",
      createdAt: now
    }
  ];
}

const seeds: VineyardSeed[] = [
  {
    id: "domaine-valclaire",
    name: "Domaine Valclaire",
    region: "Languedoc",
    country: "France",
    lat: 43.61,
    lng: 3.88,
    hectares: 41,
    varietals: ["Syrah", "Grenache", "Mourvedre"],
    production: 210000,
    dealTypes: ["supply_contract", "minority_investment", "acquisition"],
    price: 8_600_000,
    owner: 82,
    exportReady: 78,
    chinaFit: 88,
    climate: 55,
    reasons: ["Strong acquisition fit inside budget", "Premium red blend story maps well to China channels"],
    flags: ["Moderate drought pressure requires OrbitAI validation"],
    contact: "Claire Montaud",
    signalBase: {
      ndviProxy: 73,
      eviProxy: 69,
      canopyUniformity: 76,
      droughtStress: 42,
      heatRisk: 48,
      frostRisk: 18,
      smokeRisk: 14,
      diseaseAnomalyProxy: 22
    }
  },
  {
    id: "quinta-vale-claro",
    name: "Quinta Vale Claro",
    region: "Douro",
    country: "Portugal",
    lat: 41.17,
    lng: -7.79,
    hectares: 28,
    varietals: ["Touriga Nacional", "Tinta Roriz", "Touriga Franca"],
    production: 165000,
    dealTypes: ["supply_contract", "minority_investment", "joint_venture"],
    range: [2_500_000, 7_200_000],
    owner: 76,
    exportReady: 84,
    chinaFit: 91,
    climate: 50,
    reasons: ["High China premium fit", "Strong export documentation and fortified-wine adjacency"],
    flags: ["Terraced parcels need local yield verification"],
    contact: "Miguel Teixeira",
    signalBase: {
      ndviProxy: 76,
      eviProxy: 71,
      canopyUniformity: 80,
      droughtStress: 39,
      heatRisk: 45,
      frostRisk: 11,
      smokeRisk: 12,
      diseaseAnomalyProxy: 18
    }
  },
  {
    id: "weingut-rheinblick",
    name: "Weingut Rheinblick",
    region: "Rheinhessen",
    country: "Germany",
    lat: 49.99,
    lng: 8.27,
    hectares: 22,
    varietals: ["Riesling", "Pinot Blanc", "Silvaner"],
    production: 120000,
    dealTypes: ["supply_contract", "minority_investment"],
    range: [1_800_000, 4_500_000],
    owner: 74,
    exportReady: 89,
    chinaFit: 84,
    climate: 30,
    reasons: ["Low heat risk and strong white-wine growth thesis", "Export-ready documentation"],
    flags: ["Smaller scale may limit private-label volume"],
    contact: "Anna Keller",
    signalBase: {
      ndviProxy: 81,
      eviProxy: 77,
      canopyUniformity: 85,
      droughtStress: 22,
      heatRisk: 24,
      frostRisk: 28,
      smokeRisk: 5,
      diseaseAnomalyProxy: 15
    }
  },
  {
    id: "bodega-sierra-azul",
    name: "Bodega Sierra Azul",
    region: "Rioja",
    country: "Spain",
    lat: 42.46,
    lng: -2.45,
    hectares: 36,
    varietals: ["Tempranillo", "Garnacha", "Graciano"],
    production: 240000,
    dealTypes: ["supply_contract", "joint_venture", "minority_investment"],
    range: [3_200_000, 9_000_000],
    owner: 67,
    exportReady: 81,
    chinaFit: 87,
    climate: 44,
    reasons: ["Recognizable red-wine region", "Good price-to-brand storytelling ratio"],
    flags: ["Owner openness is medium; broker approach must be careful"],
    contact: "Lucia Herrera",
    signalBase: {
      ndviProxy: 75,
      eviProxy: 70,
      canopyUniformity: 77,
      droughtStress: 35,
      heatRisk: 38,
      frostRisk: 20,
      smokeRisk: 9,
      diseaseAnomalyProxy: 20
    }
  },
  {
    id: "willamette-crest-vineyard",
    name: "Willamette Crest Vineyard",
    region: "Willamette Valley",
    country: "USA",
    lat: 45.21,
    lng: -123.08,
    hectares: 18,
    varietals: ["Pinot Noir", "Chardonnay"],
    production: 95000,
    dealTypes: ["minority_investment", "supply_contract"],
    range: [5_500_000, 13_500_000],
    owner: 69,
    exportReady: 76,
    chinaFit: 86,
    climate: 42,
    reasons: ["Premium pinot brand fit", "Compelling boutique estate story"],
    flags: ["High price may exceed acquisition budget", "Wildfire-smoke monitoring required"],
    contact: "Evan Brooks",
    signalBase: {
      ndviProxy: 78,
      eviProxy: 73,
      canopyUniformity: 79,
      droughtStress: 27,
      heatRisk: 31,
      frostRisk: 18,
      smokeRisk: 36,
      diseaseAnomalyProxy: 16
    }
  },
  {
    id: "okanagan-north-bench",
    name: "Okanagan North Bench",
    region: "Okanagan Valley",
    country: "Canada",
    lat: 49.49,
    lng: -119.59,
    hectares: 16,
    varietals: ["Merlot", "Pinot Gris", "Riesling"],
    production: 78000,
    dealTypes: ["supply_contract", "joint_venture"],
    range: [1_400_000, 3_900_000],
    owner: 71,
    exportReady: 64,
    chinaFit: 75,
    climate: 49,
    reasons: ["Distinct climate story", "Accessible entry point for pilot supply"],
    flags: ["Medium export readiness and smaller volume"],
    contact: "Sophie Grant",
    signalBase: {
      ndviProxy: 72,
      eviProxy: 68,
      canopyUniformity: 74,
      droughtStress: 34,
      heatRisk: 33,
      frostRisk: 39,
      smokeRisk: 30,
      diseaseAnomalyProxy: 19
    }
  },
  {
    id: "clos-saint-arden",
    name: "Clos Saint-Arden",
    region: "Loire",
    country: "France",
    lat: 47.39,
    lng: 0.68,
    hectares: 19,
    varietals: ["Cabernet Franc", "Chenin Blanc"],
    production: 102000,
    dealTypes: ["supply_contract", "acquisition"],
    price: 5_200_000,
    owner: 73,
    exportReady: 73,
    chinaFit: 79,
    climate: 37,
    reasons: ["Balanced red-white portfolio", "Acquisition price fits DragonCellar budget"],
    flags: ["Brand awareness in China needs building"],
    contact: "Marion Lefevre",
    signalBase: {
      ndviProxy: 77,
      eviProxy: 72,
      canopyUniformity: 82,
      droughtStress: 28,
      heatRisk: 26,
      frostRisk: 31,
      smokeRisk: 7,
      diseaseAnomalyProxy: 17
    }
  },
  {
    id: "cote-de-lumiere-estate",
    name: "Cote de Lumiere Estate",
    region: "Burgundy-adjacent",
    country: "France",
    lat: 46.98,
    lng: 4.78,
    hectares: 12,
    varietals: ["Pinot Noir", "Chardonnay"],
    production: 56000,
    dealTypes: ["minority_investment", "joint_venture"],
    range: [6_000_000, 14_000_000],
    owner: 62,
    exportReady: 82,
    chinaFit: 90,
    climate: 35,
    reasons: ["Luxury-style Burgundy adjacency", "High China brand resonance"],
    flags: ["Limited volume and high valuation"],
    contact: "Etienne Morel",
    signalBase: {
      ndviProxy: 80,
      eviProxy: 76,
      canopyUniformity: 84,
      droughtStress: 24,
      heatRisk: 27,
      frostRisk: 32,
      smokeRisk: 6,
      diseaseAnomalyProxy: 14
    }
  },
  {
    id: "ribera-solana",
    name: "Ribera Solana",
    region: "Ribera del Duero",
    country: "Spain",
    lat: 41.66,
    lng: -3.69,
    hectares: 44,
    varietals: ["Tempranillo", "Cabernet Sauvignon"],
    production: 265000,
    dealTypes: ["supply_contract", "acquisition"],
    price: 10_800_000,
    owner: 78,
    exportReady: 74,
    chinaFit: 83,
    climate: 58,
    reasons: ["Scale supports private-label program", "Acquisition path is available"],
    flags: ["Heat and drought trend is elevated"],
    contact: "Diego Salvatierra",
    signalBase: {
      ndviProxy: 69,
      eviProxy: 65,
      canopyUniformity: 71,
      droughtStress: 53,
      heatRisk: 57,
      frostRisk: 19,
      smokeRisk: 10,
      diseaseAnomalyProxy: 23
    }
  },
  {
    id: "herdade-pedra-dourada",
    name: "Herdade Pedra Dourada",
    region: "Alentejo",
    country: "Portugal",
    lat: 38.57,
    lng: -7.91,
    hectares: 52,
    varietals: ["Alicante Bouschet", "Aragonez", "Antao Vaz"],
    production: 310000,
    dealTypes: ["supply_contract", "joint_venture", "acquisition"],
    price: 7_900_000,
    owner: 81,
    exportReady: 69,
    chinaFit: 77,
    climate: 63,
    reasons: ["Large volume and owner openness", "Flexible deal structures"],
    flags: ["High heat-risk validation needed before acquisition"],
    contact: "Ines Carvalho",
    signalBase: {
      ndviProxy: 67,
      eviProxy: 64,
      canopyUniformity: 69,
      droughtStress: 59,
      heatRisk: 62,
      frostRisk: 8,
      smokeRisk: 13,
      diseaseAnomalyProxy: 21
    }
  },
  {
    id: "tenuta-argento-poggio",
    name: "Tenuta Argento Poggio",
    region: "Tuscany",
    country: "Italy",
    lat: 43.32,
    lng: 11.33,
    hectares: 31,
    varietals: ["Sangiovese", "Merlot", "Vermentino"],
    production: 175000,
    dealTypes: ["supply_contract", "minority_investment"],
    range: [4_200_000, 11_000_000],
    owner: 66,
    exportReady: 86,
    chinaFit: 89,
    climate: 46,
    reasons: ["Tuscany has strong premium recognition", "Export readiness is high"],
    flags: ["Minority terms may be competitive"],
    contact: "Giulia Rinaldi",
    signalBase: {
      ndviProxy: 76,
      eviProxy: 72,
      canopyUniformity: 78,
      droughtStress: 38,
      heatRisk: 43,
      frostRisk: 17,
      smokeRisk: 8,
      diseaseAnomalyProxy: 18
    }
  },
  {
    id: "veneto-laguna-vines",
    name: "Veneto Laguna Vines",
    region: "Veneto",
    country: "Italy",
    lat: 45.44,
    lng: 11.0,
    hectares: 25,
    varietals: ["Glera", "Corvina", "Pinot Grigio"],
    production: 220000,
    dealTypes: ["supply_contract", "joint_venture"],
    range: [2_200_000, 6_300_000],
    owner: 72,
    exportReady: 83,
    chinaFit: 80,
    climate: 41,
    reasons: ["Sparkling and lighter styles support portfolio breadth", "Good export processes"],
    flags: ["Not an acquisition candidate in current owner posture"],
    contact: "Marco Bellini",
    signalBase: {
      ndviProxy: 74,
      eviProxy: 70,
      canopyUniformity: 79,
      droughtStress: 31,
      heatRisk: 34,
      frostRisk: 23,
      smokeRisk: 6,
      diseaseAnomalyProxy: 19
    }
  },
  {
    id: "santa-lucia-coastal-vines",
    name: "Santa Lucia Coastal Vines",
    region: "California Central Coast",
    country: "USA",
    lat: 36.52,
    lng: -121.46,
    hectares: 34,
    varietals: ["Chardonnay", "Pinot Noir", "Syrah"],
    production: 180000,
    dealTypes: ["supply_contract", "minority_investment"],
    range: [5_000_000, 12_500_000],
    owner: 68,
    exportReady: 77,
    chinaFit: 82,
    climate: 54,
    reasons: ["Coastal premium positioning", "Strong private-label sourcing potential"],
    flags: ["Wildfire and water-risk monitoring required"],
    contact: "Nora Castillo",
    signalBase: {
      ndviProxy: 71,
      eviProxy: 67,
      canopyUniformity: 75,
      droughtStress: 49,
      heatRisk: 41,
      frostRisk: 12,
      smokeRisk: 39,
      diseaseAnomalyProxy: 18
    }
  }
];

export const seededVineyards: VineyardOpportunity[] = seeds.map((seed) => {
  const vineyardSignals = signals(seed.id, seed.signalBase);
  const base: VineyardOpportunity = {
    id: seed.id,
    name: seed.name,
    fictionalDemo: true,
    region: seed.region,
    country: seed.country,
    lat: seed.lat,
    lng: seed.lng,
    hectares: seed.hectares,
    varietals: seed.varietals,
    annualProductionBottles: seed.production,
    dealTypes: seed.dealTypes,
    indicativePriceUsd: seed.price,
    investmentRangeUsd: seed.range,
    ownerOpennessScore: seed.owner,
    exportReadinessScore: seed.exportReady,
    chinaPremiumFitScore: seed.chinaFit,
    climateRiskScore: seed.climate,
    harvestRiskScore: averageHarvestRisk(vineyardSignals),
    overallFitScore: 0,
    confidence: 0,
    topReasons: seed.reasons,
    redFlags: seed.flags,
    evidence: evidence(seed.id, seed.country),
    signals: vineyardSignals,
    dueDiligenceNotes: [
      "Confirm title, water rights, grower contracts, and export licensing before exclusivity.",
      "Request parcel maps, last three harvest reports, lab chemistry, and customer concentration.",
      "Use OrbitAI Eye-of-God handoff to validate satellite-observable stress and parcel uniformity."
    ],
    contact: {
      name: seed.contact,
      role: "Owner/broker placeholder",
      email: `${seed.contact.toLowerCase().replaceAll(" ", ".")}@example-vineyard.test`
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
});

export const seededAlerts: WatchAlert[] = [
  {
    id: "alert_valclaire_drought",
    opportunityId: "domaine-valclaire",
    title: "Drought stress rose in the latest seeded signal window.",
    severity: "medium",
    source: "seeded_demo",
    createdAt: now
  },
  {
    id: "alert_willamette_smoke",
    opportunityId: "willamette-crest-vineyard",
    title: "Smoke-risk proxy remains above portfolio median.",
    severity: "high",
    source: "seeded_demo",
    createdAt: now
  },
  {
    id: "alert_rheinblick_ready",
    opportunityId: "weingut-rheinblick",
    title: "Export readiness makes this a strong supply-contract follow-up.",
    severity: "low",
    source: "seeded_demo",
    createdAt: now
  }
];

export const seededEyeOfGodResult = `Observation: Domaine Valclaire shows generally stable canopy vigor across the central and western parcels, with lower vigor on the southern slope edge.
Confidence: Medium. Evidence appears consistent with moderate drought stress rather than disease-like anomaly.
Satellite-observable notes: Canopy uniformity is acceptable, heat stress should be monitored, and no obvious smoke or flood damage is visible in the supplied period.
Caveat: This handoff does not prove final wine taste, chemistry, ownership value, or investment suitability. Ground truth and vineyard records are still required.
Recommended relevance: Continue acquisition diligence, request irrigation and water-rights records, and compare 2024/2025 harvest lots before final valuation.`;
