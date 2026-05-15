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

type RegionTemplate = {
  region: string;
  country: string;
  lat: number;
  lng: number;
  varietals: string[];
  dealTypes: DealType[];
  climate: number;
  exportReady: number;
  chinaFit: number;
  owner: number;
  priceBase: number;
};

const generatedRegionTemplates: RegionTemplate[] = [
  { region: "Bordeaux", country: "France", lat: 44.84, lng: -0.58, varietals: ["Merlot", "Cabernet Sauvignon", "Cabernet Franc"], dealTypes: ["supply_contract", "minority_investment", "acquisition"], climate: 39, exportReady: 88, chinaFit: 91, owner: 67, priceBase: 12_000_000 },
  { region: "Champagne", country: "France", lat: 49.05, lng: 4.01, varietals: ["Chardonnay", "Pinot Noir", "Meunier"], dealTypes: ["supply_contract", "minority_investment"], climate: 31, exportReady: 92, chinaFit: 88, owner: 58, priceBase: 16_500_000 },
  { region: "Alsace", country: "France", lat: 48.08, lng: 7.36, varietals: ["Riesling", "Gewurztraminer", "Pinot Gris"], dealTypes: ["supply_contract", "joint_venture"], climate: 29, exportReady: 82, chinaFit: 79, owner: 72, priceBase: 4_800_000 },
  { region: "Provence", country: "France", lat: 43.53, lng: 6.05, varietals: ["Grenache", "Cinsault", "Syrah"], dealTypes: ["supply_contract", "minority_investment", "acquisition"], climate: 56, exportReady: 79, chinaFit: 82, owner: 74, priceBase: 8_900_000 },
  { region: "Beaujolais", country: "France", lat: 46.12, lng: 4.72, varietals: ["Gamay", "Chardonnay"], dealTypes: ["supply_contract", "acquisition"], climate: 36, exportReady: 75, chinaFit: 76, owner: 77, priceBase: 4_200_000 },
  { region: "Cahors", country: "France", lat: 44.45, lng: 1.44, varietals: ["Malbec", "Merlot"], dealTypes: ["supply_contract", "minority_investment"], climate: 46, exportReady: 71, chinaFit: 81, owner: 78, priceBase: 3_900_000 },
  { region: "Priorat", country: "Spain", lat: 41.15, lng: 0.82, varietals: ["Garnacha", "Carinena", "Syrah"], dealTypes: ["supply_contract", "minority_investment"], climate: 52, exportReady: 80, chinaFit: 86, owner: 65, priceBase: 7_600_000 },
  { region: "Rias Baixas", country: "Spain", lat: 42.47, lng: -8.64, varietals: ["Albarino", "Treixadura"], dealTypes: ["supply_contract", "joint_venture"], climate: 33, exportReady: 78, chinaFit: 75, owner: 73, priceBase: 3_800_000 },
  { region: "Navarra", country: "Spain", lat: 42.62, lng: -1.64, varietals: ["Tempranillo", "Garnacha", "Graciano"], dealTypes: ["supply_contract", "acquisition"], climate: 43, exportReady: 74, chinaFit: 78, owner: 76, priceBase: 5_100_000 },
  { region: "Penedes", country: "Spain", lat: 41.35, lng: 1.7, varietals: ["Xarel-lo", "Macabeo", "Parellada"], dealTypes: ["supply_contract", "joint_venture"], climate: 45, exportReady: 82, chinaFit: 77, owner: 70, priceBase: 4_600_000 },
  { region: "Dao", country: "Portugal", lat: 40.62, lng: -7.91, varietals: ["Touriga Nacional", "Jaen", "Encruzado"], dealTypes: ["supply_contract", "minority_investment", "acquisition"], climate: 42, exportReady: 76, chinaFit: 83, owner: 82, priceBase: 4_400_000 },
  { region: "Vinho Verde", country: "Portugal", lat: 41.55, lng: -8.42, varietals: ["Alvarinho", "Loureiro", "Arinto"], dealTypes: ["supply_contract", "joint_venture"], climate: 32, exportReady: 77, chinaFit: 72, owner: 75, priceBase: 3_100_000 },
  { region: "Bairrada", country: "Portugal", lat: 40.42, lng: -8.45, varietals: ["Baga", "Touriga Nacional", "Bical"], dealTypes: ["supply_contract", "acquisition"], climate: 38, exportReady: 73, chinaFit: 76, owner: 79, priceBase: 3_700_000 },
  { region: "Mosel", country: "Germany", lat: 49.92, lng: 7.06, varietals: ["Riesling", "Elbling"], dealTypes: ["supply_contract", "minority_investment"], climate: 27, exportReady: 87, chinaFit: 82, owner: 68, priceBase: 5_800_000 },
  { region: "Pfalz", country: "Germany", lat: 49.31, lng: 8.13, varietals: ["Riesling", "Pinot Noir", "Dornfelder"], dealTypes: ["supply_contract", "joint_venture"], climate: 34, exportReady: 84, chinaFit: 80, owner: 74, priceBase: 4_900_000 },
  { region: "Baden", country: "Germany", lat: 48.02, lng: 7.84, varietals: ["Spatburgunder", "Pinot Gris", "Riesling"], dealTypes: ["supply_contract", "minority_investment"], climate: 35, exportReady: 82, chinaFit: 79, owner: 70, priceBase: 5_200_000 },
  { region: "Piedmont", country: "Italy", lat: 44.7, lng: 8.04, varietals: ["Nebbiolo", "Barbera", "Dolcetto"], dealTypes: ["supply_contract", "minority_investment"], climate: 37, exportReady: 87, chinaFit: 89, owner: 59, priceBase: 13_500_000 },
  { region: "Etna", country: "Italy", lat: 37.75, lng: 15.0, varietals: ["Nerello Mascalese", "Carricante"], dealTypes: ["supply_contract", "joint_venture"], climate: 48, exportReady: 78, chinaFit: 84, owner: 71, priceBase: 6_100_000 },
  { region: "Friuli", country: "Italy", lat: 46.0, lng: 13.24, varietals: ["Friulano", "Sauvignon Blanc", "Merlot"], dealTypes: ["supply_contract", "minority_investment"], climate: 36, exportReady: 80, chinaFit: 75, owner: 73, priceBase: 4_700_000 },
  { region: "Trentino", country: "Italy", lat: 46.07, lng: 11.12, varietals: ["Pinot Grigio", "Lagrein", "Chardonnay"], dealTypes: ["supply_contract", "joint_venture"], climate: 33, exportReady: 81, chinaFit: 76, owner: 72, priceBase: 4_300_000 },
  { region: "Napa Valley", country: "USA", lat: 38.5, lng: -122.36, varietals: ["Cabernet Sauvignon", "Merlot", "Sauvignon Blanc"], dealTypes: ["minority_investment", "supply_contract"], climate: 50, exportReady: 83, chinaFit: 92, owner: 55, priceBase: 19_000_000 },
  { region: "Sonoma County", country: "USA", lat: 38.43, lng: -122.77, varietals: ["Pinot Noir", "Chardonnay", "Zinfandel"], dealTypes: ["supply_contract", "minority_investment"], climate: 48, exportReady: 80, chinaFit: 85, owner: 64, priceBase: 11_500_000 },
  { region: "Walla Walla", country: "USA", lat: 46.07, lng: -118.34, varietals: ["Cabernet Sauvignon", "Syrah", "Merlot"], dealTypes: ["supply_contract", "joint_venture"], climate: 52, exportReady: 73, chinaFit: 80, owner: 75, priceBase: 6_900_000 },
  { region: "Columbia Valley", country: "USA", lat: 46.25, lng: -119.21, varietals: ["Riesling", "Cabernet Sauvignon", "Syrah"], dealTypes: ["supply_contract", "acquisition"], climate: 51, exportReady: 72, chinaFit: 78, owner: 79, priceBase: 5_600_000 },
  { region: "Finger Lakes", country: "USA", lat: 42.68, lng: -76.89, varietals: ["Riesling", "Cabernet Franc", "Gewurztraminer"], dealTypes: ["supply_contract", "minority_investment"], climate: 36, exportReady: 69, chinaFit: 73, owner: 78, priceBase: 3_600_000 },
  { region: "Paso Robles", country: "USA", lat: 35.64, lng: -120.69, varietals: ["Cabernet Sauvignon", "Zinfandel", "Syrah"], dealTypes: ["supply_contract", "acquisition"], climate: 58, exportReady: 77, chinaFit: 82, owner: 72, priceBase: 8_200_000 },
  { region: "Niagara Peninsula", country: "Canada", lat: 43.16, lng: -79.24, varietals: ["Riesling", "Cabernet Franc", "Chardonnay"], dealTypes: ["supply_contract", "joint_venture"], climate: 35, exportReady: 68, chinaFit: 74, owner: 76, priceBase: 3_400_000 },
  { region: "Similkameen Valley", country: "Canada", lat: 49.2, lng: -119.83, varietals: ["Merlot", "Cabernet Franc", "Syrah"], dealTypes: ["supply_contract", "minority_investment"], climate: 47, exportReady: 66, chinaFit: 73, owner: 80, priceBase: 3_800_000 },
  { region: "Vancouver Island", country: "Canada", lat: 48.79, lng: -123.7, varietals: ["Pinot Noir", "Pinot Gris", "Ortega"], dealTypes: ["supply_contract", "joint_venture"], climate: 38, exportReady: 63, chinaFit: 70, owner: 77, priceBase: 2_900_000 }
];

const estatePrefixes = ["Aster", "Cedar", "Marble", "Juniper", "Lunar", "Sable", "Copper", "Silver", "Falcon", "Harbor"];
const estateSuffixes = ["Ridge", "Bench", "Terrace", "Hollow", "Crest", "Stone", "Meadow", "Slope", "Haven", "Field"];
const contactNames = ["Elena Cross", "Marc Vidal", "Sofia Lang", "Hugo Perrin", "Isabel Costa", "Lena Hart", "Nicolas Frey", "Clara Stone"];

function generatedOffset(index: number, span: number) {
  return Math.sin(index * 12.9898) * span + Math.cos(index * 78.233) * (span / 2);
}

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function clampMetric(value: number) {
  return Math.max(8, Math.min(96, Math.round(value)));
}

function createGeneratedSeeds(existing: VineyardSeed[], targetCount: number): VineyardSeed[] {
  const generated: VineyardSeed[] = [];
  const usedIds = new Set(existing.map((seed) => seed.id));
  for (let index = 0; existing.length + generated.length < targetCount; index += 1) {
    const template = generatedRegionTemplates[index % generatedRegionTemplates.length];
    const cycle = Math.floor(index / generatedRegionTemplates.length);
    const prefix = estatePrefixes[(index * 3 + cycle) % estatePrefixes.length];
    const suffix = estateSuffixes[(index * 5 + cycle) % estateSuffixes.length];
    const name = `${prefix} ${template.region} ${suffix}`;
    let id = slugify(name);
    if (usedIds.has(id)) id = `${id}-${cycle + 1}`;
    usedIds.add(id);
    const signalClimate = clampMetric(template.climate + generatedOffset(index + 2, 7));
    const heatRisk = clampMetric(signalClimate + generatedOffset(index + 5, 6));
    const droughtStress = clampMetric(signalClimate + generatedOffset(index + 7, 7) - 4);
    const frostRisk = clampMetric(62 - template.climate + generatedOffset(index + 11, 8));
    const smokeRisk = clampMetric(template.country === "USA" || template.country === "Canada" ? 24 + generatedOffset(index + 13, 12) : 8 + generatedOffset(index + 13, 6));
    const highPrice = Math.round(template.priceBase * (0.82 + ((index % 7) * 0.07)));
    const lowPrice = Math.round(highPrice * 0.42);
    generated.push({
      id,
      name,
      region: template.region,
      country: template.country,
      lat: Number((template.lat + generatedOffset(index + 17, 0.42)).toFixed(3)),
      lng: Number((template.lng + generatedOffset(index + 19, 0.58)).toFixed(3)),
      hectares: Math.round(11 + ((index * 7) % 52)),
      varietals: template.varietals,
      production: Math.round(55_000 + ((index * 23_000) % 295_000)),
      dealTypes: template.dealTypes,
      range: [lowPrice, highPrice],
      owner: clampMetric(template.owner + generatedOffset(index + 23, 9)),
      exportReady: clampMetric(template.exportReady + generatedOffset(index + 29, 7)),
      chinaFit: clampMetric(template.chinaFit + generatedOffset(index + 31, 7)),
      climate: signalClimate,
      reasons: [
        `${template.region} adds ${template.varietals[0]} depth to the Western supply map`,
        `${template.country} provenance supports premium portfolio storytelling`
      ],
      flags: [
        signalClimate > 55
          ? "Elevated climate proxy requires OrbitAI validation before exclusivity"
          : "Ground records are still required before commercial commitment"
      ],
      contact: contactNames[index % contactNames.length],
      signalBase: {
        ndviProxy: clampMetric(82 - signalClimate / 4 + generatedOffset(index + 37, 5)),
        eviProxy: clampMetric(78 - signalClimate / 5 + generatedOffset(index + 41, 5)),
        canopyUniformity: clampMetric(83 - signalClimate / 6 + generatedOffset(index + 43, 6)),
        droughtStress,
        heatRisk,
        frostRisk,
        smokeRisk,
        diseaseAnomalyProxy: clampMetric(14 + generatedOffset(index + 47, 9))
      }
    });
  }
  return generated;
}

const expandedSeeds = [...seeds, ...createGeneratedSeeds(seeds, 100)];

export const seededVineyards: VineyardOpportunity[] = expandedSeeds.map((seed) => {
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
