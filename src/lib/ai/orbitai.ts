import type { AiRequest, AiResponse } from "../types";
import { parseAiJsonContent } from "./parse";

type ChatChoice = {
  message?: {
    content?: string;
  };
};

type ChatResponse = {
  choices?: ChatChoice[];
};

function buildOrbitEndpoint(baseUrl: string) {
  const trimmed = baseUrl.replace(/\/$/, "");
  return trimmed.endsWith("/chat/completions") ? trimmed : `${trimmed}/chat/completions`;
}

export async function orbitAi<T = unknown>(request: AiRequest): Promise<AiResponse<T>> {
  const apiKey = process.env.ORBITAI_API_KEY;
  const baseUrl = process.env.ORBITAI_API_BASE_URL;
  const configuredModel = process.env.ORBITAI_MODEL;
  const model = configuredModel && configuredModel !== "orbitai-relay" ? configuredModel : "gpt-5.4";
  if (!apiKey || !baseUrl) {
    return {
      provider: "orbitai",
      model,
      ok: false,
      error: "OrbitAI is not configured."
    };
  }

  try {
    let lastError = "OrbitAI returned no valid content.";
    for (let attempt = 0; attempt < 2; attempt += 1) {
      const response = await fetch(buildOrbitEndpoint(baseUrl), {
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
              content: `${JSON.stringify(request)}${attempt ? "\nReturn only valid JSON matching the requested schema." : ""}`
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
      if (!content) {
        lastError = "OrbitAI returned no content.";
        continue;
      }
      const parsed = parseAiJsonContent<T>(content);
      if (parsed.ok) {
        return {
          provider: "orbitai",
          model,
          ok: true,
          data: parsed.data
        };
      }
      lastError = parsed.error;
    }
    return { provider: "orbitai", model, ok: false, error: lastError };
  } catch (error) {
    return {
      provider: "orbitai",
      model,
      ok: false,
      error: error instanceof Error ? error.message : "Unknown OrbitAI error."
    };
  }
}
