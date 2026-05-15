export const evidenceSources = [
  "seeded_demo",
  "live_public",
  "orbitai_relay",
  "eye_of_god_handoff",
  "user_uploaded",
  "unavailable"
] as const;

export type EvidenceSource = (typeof evidenceSources)[number];

export const dealTypes = [
  "supply_contract",
  "minority_investment",
  "acquisition",
  "joint_venture"
] as const;

export type DealType = (typeof dealTypes)[number];

export type BuyerProfile = {
  id: string;
  companyName: string;
  companyType:
    | "importer"
    | "dtc_brand"
    | "distributor"
    | "strategic_investor"
    | "family_office"
    | "other";
  channels: string[];
  targetProducts: string[];
  targetCountries: string[];
  preferredDealTypes: DealType[];
  budgetMinUsd?: number;
  budgetMaxUsd?: number;
  targetChinaPriceTier: "value" | "premium" | "luxury" | "mixed";
  riskAppetite: "low" | "medium" | "high";
  timeline: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

export type HarvestSignal = {
  id: string;
  vineyardId: string;
  date: string;
  ndviProxy: number;
  eviProxy: number;
  canopyUniformity: number;
  droughtStress: number;
  heatRisk: number;
  frostRisk: number;
  smokeRisk: number;
  diseaseAnomalyProxy: number;
  source: EvidenceSource;
  notes?: string;
};

export type EvidenceItem = {
  id: string;
  opportunityId?: string;
  type:
    | "satellite_proxy"
    | "weather"
    | "market"
    | "export"
    | "owner"
    | "orbitai"
    | "user_document";
  source: EvidenceSource;
  title: string;
  summary: string;
  confidence: number;
  observedAt?: string;
  url?: string;
  rawText?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
};

export type VineyardOpportunity = {
  id: string;
  name: string;
  fictionalDemo: boolean;
  region: string;
  country: string;
  lat: number;
  lng: number;
  hectares: number;
  varietals: string[];
  annualProductionBottles?: number;
  dealTypes: DealType[];
  indicativePriceUsd?: number;
  investmentRangeUsd?: [number, number];
  ownerOpennessScore: number;
  exportReadinessScore: number;
  chinaPremiumFitScore: number;
  climateRiskScore: number;
  harvestRiskScore: number;
  overallFitScore: number;
  confidence: number;
  topReasons: string[];
  redFlags: string[];
  evidence: EvidenceItem[];
  signals: HarvestSignal[];
  dueDiligenceNotes: string[];
  contact: {
    name: string;
    role: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
};

export type DealMemo = {
  id: string;
  opportunityId: string;
  buyerProfileId: string;
  recommendation: "buy_supply" | "invest" | "acquire" | "watch" | "reject";
  markdown: string;
  chineseSummary: string;
  aiModel?: string;
  confidence: number;
  createdAt: string;
  updatedAt: string;
};

export type OutreachPack = {
  opportunityId: string;
  ownerEmail: string;
  followUpEmail: string;
  shortMessage: string;
  meetingAgenda: string[];
  ndaRequestList: string[];
  chineseSummary: string;
};

export type ScoreBreakdown = {
  overallFit: number;
  dealTypeFit: number;
  budgetFit: number;
  harvestRisk: number;
  harvestRiskInverted: number;
  confidence: number;
  recommendation: DealMemo["recommendation"];
  explanation: string[];
};

export type WatchAlert = {
  id: string;
  opportunityId: string;
  title: string;
  severity: "low" | "medium" | "high";
  source: EvidenceSource;
  createdAt: string;
};

export type AiProviderName = "mock" | "orbitai" | "openai";

export type AiTask =
  | "buyer_strategy"
  | "score_explanation"
  | "harvest_risk"
  | "deal_memo"
  | "outreach"
  | "eye_of_god_prompt"
  | "chinese_summary";

export type AiRequest = {
  task: AiTask;
  prompt: string;
  context?: Record<string, unknown>;
};

export type AiResponse<T = unknown> = {
  provider: AiProviderName;
  model: string;
  ok: boolean;
  data?: T;
  error?: string;
  usedFallback?: boolean;
};
