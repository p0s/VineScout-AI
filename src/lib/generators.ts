import type { BuyerProfile, DealMemo, OutreachPack, VineyardOpportunity } from "./types";
import { calculateOverallFit } from "./scoring";
import { formatDealType, formatUsd, standardCaveat } from "./utils";

export function buildBuyerStrategy(profile: BuyerProfile): string {
  return `${profile.companyName} should prioritize ${profile.targetCountries.slice(0, 3).join(", ")} vineyards that support ${profile.preferredDealTypes
    .map(formatDealType)
    .join(", ")} while keeping harvest-risk evidence tied to export readiness and China premium fit.`;
}

export function buildEyeOfGodPrompt(vineyard: VineyardOpportunity): string {
  return `Eye-of-God task for VineScout AI

Vineyard: ${vineyard.name}, ${vineyard.region}, ${vineyard.country}
Coordinates: ${vineyard.lat}, ${vineyard.lng}
Observation question: Is this vineyard showing satellite-observable harvest-risk signals that should change sourcing, investment, or acquisition diligence?
Requested window: Compare latest growing-season imagery with the prior 12-24 months where available.

Signals to check:
- Canopy vigor and NDVI/EVI-like consistency
- Dry stress, heat stress, frost/hail/flood damage if observable
- Disease-like anomalies or parcel-level inconsistency
- Fire or smoke exposure risk
- Harvest activity timing and neighboring parcel comparison

Desired output:
1. Observations with confidence.
2. Images or metadata references if available.
3. Caveats and what cannot be inferred from satellite data.
4. Investment/sourcing relevance for a Chinese premium wine company.

Important caveat: ${standardCaveat}`;
}

export function buildDealMemo(vineyard: VineyardOpportunity, profile: BuyerProfile): DealMemo {
  const score = calculateOverallFit(vineyard, profile);
  const price = vineyard.indicativePriceUsd
    ? formatUsd(vineyard.indicativePriceUsd)
    : vineyard.investmentRangeUsd
      ? `${formatUsd(vineyard.investmentRangeUsd[0])}-${formatUsd(vineyard.investmentRangeUsd[1])}`
      : "Not disclosed";

  const markdown = `# Deal memo: ${vineyard.name}

## Executive recommendation
Recommendation: **${score.recommendation.replaceAll("_", " ")}**.
Overall fit: **${score.overallFit}/100**. Harvest-risk score: **${score.harvestRisk}/100**. Confidence: **${score.confidence}/100**.

## Buyer profile
${profile.companyName} is targeting ${profile.targetProducts.join(", ")} through ${profile.channels.join(", ")} with a ${formatUsd(profile.budgetMinUsd)}-${formatUsd(profile.budgetMaxUsd)} strategic budget.

## Vineyard overview
${vineyard.name} is a fictional demo opportunity in ${vineyard.region}, ${vineyard.country}, with ${vineyard.hectares} hectares under vine and ${vineyard.annualProductionBottles?.toLocaleString("en-US")} bottles of annual production. Indicative price or investment range: ${price}.

## Strategic rationale
${vineyard.topReasons.map((reason) => `- ${reason}`).join("\n")}

## Harvest-risk evidence
- Harvest-risk formula: 25% drought stress, 20% heat risk, 15% frost risk, 15% smoke risk, 15% disease-anomaly proxy, 10% inverse canopy uniformity.
- Current provenance: ${vineyard.evidence.map((item) => item.source).join(", ")}.
- ${standardCaveat}

## Commercial fit
- Deal structures: ${vineyard.dealTypes.map(formatDealType).join(", ")}.
- China premium fit: ${vineyard.chinaPremiumFitScore}/100.
- Export readiness: ${vineyard.exportReadinessScore}/100.
- Owner openness: ${vineyard.ownerOpennessScore}/100.

## Red flags
${vineyard.redFlags.map((flag) => `- ${flag}`).join("\n")}

## Diligence checklist
${vineyard.dueDiligenceNotes.map((note) => `- ${note}`).join("\n")}

## Outreach plan
1. Send owner/broker intro focused on supply control and brand localization.
2. Request parcel maps, export documents, harvest reports, and sample availability.
3. Run OrbitAI Eye-of-God handoff before any exclusivity or valuation commitment.

## Next 14 days
- Day 1-2: Owner/broker outreach and NDA.
- Day 3-7: Document request and OrbitAI validation.
- Day 8-14: Commercial model, sample review plan, and term-sheet decision.`;

  return {
    id: `memo_${vineyard.id}`,
    opportunityId: vineyard.id,
    buyerProfileId: profile.id,
    recommendation: score.recommendation,
    markdown,
    chineseSummary: `内部摘要：${vineyard.name} 是位于 ${vineyard.country} ${vineyard.region} 的演示酒庄机会。综合匹配 ${score.overallFit}/100，采收风险 ${score.harvestRisk}/100。建议：${score.recommendation.replaceAll("_", " ")}。卫星和天气信号只能作为尽调加速器，不能证明最终酒质或投资适合性。`,
    aiModel: "mock-template",
    confidence: score.confidence,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

export function buildOutreach(vineyard: VineyardOpportunity, profile: BuyerProfile): OutreachPack {
  return {
    opportunityId: vineyard.id,
    ownerEmail: `Subject: Strategic supply and investment discussion for ${vineyard.name}

Dear ${vineyard.contact.name},

I am writing on behalf of ${profile.companyName}, a China-based premium wine commerce and beverage group evaluating Western vineyard supply partnerships, minority investments, and potential acquisitions.

${vineyard.name} stands out because of its ${vineyard.region} positioning, varietal mix, and export-readiness profile. We would like to explore whether a structured conversation around supply, brand localization, or strategic capital could be useful for both sides.

Could we schedule a 30-minute introductory call next week? We can share a short buyer profile and sign an NDA before reviewing parcel, harvest, or export documentation.

Best regards,
VineScout AI demo team`,
    followUpEmail: `Subject: Follow-up on ${vineyard.name}

Dear ${vineyard.contact.name},

Following up on the note below. ${profile.companyName} is narrowing a shortlist before Q4 harvest and would value a brief conversation about export readiness, available volumes, and any openness to strategic partnership.

Best regards`,
    shortMessage: `Hello ${vineyard.contact.name}, ${profile.companyName} is evaluating premium Western vineyard partnerships for China. Could we arrange a short call about ${vineyard.name}?`,
    meetingAgenda: [
      "Owner objectives and preferred deal structure",
      "Export history, China readiness, and channel constraints",
      "Parcel maps, harvest reports, and risk evidence",
      "Sample shipment process and next diligence steps"
    ],
    ndaRequestList: [
      "Parcel maps and planted varietal breakdown",
      "Three-year harvest volume and lab chemistry summaries",
      "Export licenses and compliance documents",
      "Water rights, irrigation, and climate-risk mitigation records",
      "Broker mandate or owner authorization"
    ],
    chineseSummary: `对外联络重点：强调 ${profile.companyName} 希望通过供应合作、少数股权或收购建立西方产区供应控制，并先签署 NDA 后审阅资料。`
  };
}
