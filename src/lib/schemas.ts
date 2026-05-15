import { z } from "zod";
import { dealTypes, evidenceSources } from "./types";

export const dealTypeSchema = z.enum(dealTypes);
export const evidenceSourceSchema = z.enum(evidenceSources);

export const buyerProfileSchema = z.object({
  id: z.string(),
  companyName: z.string().min(1),
  companyType: z.enum([
    "importer",
    "dtc_brand",
    "distributor",
    "strategic_investor",
    "family_office",
    "other"
  ]),
  channels: z.array(z.string()),
  targetProducts: z.array(z.string()),
  targetCountries: z.array(z.string()),
  preferredDealTypes: z.array(dealTypeSchema),
  budgetMinUsd: z.number().optional(),
  budgetMaxUsd: z.number().optional(),
  targetChinaPriceTier: z.enum(["value", "premium", "luxury", "mixed"]),
  riskAppetite: z.enum(["low", "medium", "high"]),
  timeline: z.string(),
  notes: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string()
});

export const buyerProfileInputSchema = buyerProfileSchema
  .omit({ id: true, createdAt: true, updatedAt: true })
  .partial()
  .extend({
    companyName: z.string().min(1).default("DragonCellar Premium"),
    companyType: z
      .enum([
        "importer",
        "dtc_brand",
        "distributor",
        "strategic_investor",
        "family_office",
        "other"
      ])
      .default("dtc_brand"),
    channels: z.array(z.string()).default(["Tmall/JD", "direct subscriptions"]),
    targetProducts: z.array(z.string()).default(["premium red", "white"]),
    targetCountries: z.array(z.string()).default(["France", "Portugal", "Germany", "USA"]),
    preferredDealTypes: z
      .array(dealTypeSchema)
      .default(["supply_contract", "minority_investment", "acquisition"]),
    targetChinaPriceTier: z.enum(["value", "premium", "luxury", "mixed"]).default("premium"),
    riskAppetite: z.enum(["low", "medium", "high"]).default("medium"),
    timeline: z.string().default("Before Q4 harvest")
  });

export const vineyardSearchSchema = z.object({
  countries: z.array(z.string()).optional(),
  varietal: z.string().optional(),
  dealType: dealTypeSchema.optional(),
  minOverallFit: z.number().optional(),
  maxHarvestRisk: z.number().optional(),
  minChinaFit: z.number().optional(),
  minExportReadiness: z.number().optional(),
  query: z.string().optional()
});

export const evidenceInputSchema = z.object({
  opportunityId: z.string(),
  rawText: z.string().min(10),
  title: z.string().default("Eye-of-God pasted result")
});

export const aiJsonResponseSchema = z.object({
  summary: z.string(),
  confidence: z.number().min(0).max(100),
  nextActions: z.array(z.string()).default([])
});
