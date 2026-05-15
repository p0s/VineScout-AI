import type { AiRequest, AiResponse } from "../types";

export async function mockAi<T = unknown>(request: AiRequest): Promise<AiResponse<T>> {
  const summary = deterministicSummary(request);
  return {
    provider: "mock",
    model: "mock-deterministic-v1",
    ok: true,
    data: {
      summary,
      confidence: 74,
      nextActions: [
        "Review provenance labels before relying on the output.",
        "Use OrbitAI Eye-of-God handoff for satellite-observable validation.",
        "Request ground-truth records before investment or acquisition decisions."
      ]
    } as T
  };
}

function deterministicSummary(request: AiRequest): string {
  switch (request.task) {
    case "buyer_strategy":
      return "Prioritize export-ready vineyards with clear China premium fit, manageable harvest-risk proxies, and owners open to structured supply or investment discussions.";
    case "harvest_risk":
      return "The seeded signals suggest harvest-risk should be treated as an early diligence screen, not proof of wine quality.";
    case "eye_of_god_prompt":
      return "Generate a precise satellite-observable prompt that asks for canopy vigor, stress, parcel comparison, confidence, caveats, and sourcing relevance.";
    case "deal_memo":
      return "Create a concise investment committee-style memo with recommendation, evidence, red flags, and the next 14 days.";
    case "outreach":
      return "Lead with strategic supply control, request a short call, and move sensitive details behind an NDA.";
    case "chinese_summary":
      return "中文摘要应强调尽调加速、证据来源和风险边界，避免宣称卫星可以证明最终酒质。";
    default:
      return "VineScout uses deterministic seeded outputs unless a server-only AI provider is configured.";
  }
}
