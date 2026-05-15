import type { AiRequest, AiResponse } from "../types";

type ChatChoice = {
  message?: {
    content?: string;
  };
};

type ChatResponse = {
  choices?: ChatChoice[];
};

export async function orbitAi<T = unknown>(request: AiRequest): Promise<AiResponse<T>> {
  const apiKey = process.env.ORBITAI_API_KEY;
  const baseUrl = process.env.ORBITAI_API_BASE_URL;
  const model = process.env.ORBITAI_MODEL ?? "orbitai-relay";
  if (!apiKey || !baseUrl) {
    return {
      provider: "orbitai",
      model,
      ok: false,
      error: "OrbitAI is not configured."
    };
  }

  try {
    const response = await fetch(`${baseUrl.replace(/\/$/, "")}/chat/completions`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content:
              "You are VineScout AI. Return concise structured JSON with summary, confidence, and nextActions. Never claim satellite evidence proves final wine quality or investment suitability."
          },
          {
            role: "user",
            content: JSON.stringify(request)
          }
        ]
      }),
      cache: "no-store"
    });
    if (!response.ok) {
      return { provider: "orbitai", model, ok: false, error: `OrbitAI request failed with ${response.status}.` };
    }
    const json = (await response.json()) as ChatResponse;
    const content = json.choices?.[0]?.message?.content;
    if (!content) return { provider: "orbitai", model, ok: false, error: "OrbitAI returned no content." };
    return {
      provider: "orbitai",
      model,
      ok: true,
      data: JSON.parse(content) as T
    };
  } catch (error) {
    return {
      provider: "orbitai",
      model,
      ok: false,
      error: error instanceof Error ? error.message : "Unknown OrbitAI error."
    };
  }
}
