import type { AiRequest, AiResponse } from "../types";
import { parseAiJsonContent } from "./parse";

export async function openAi<T = unknown>(request: AiRequest): Promise<AiResponse<T>> {
  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL ?? "gpt-4o-mini";
  if (!apiKey) {
    return {
      provider: "openai",
      model,
      ok: false,
      error: "OpenAI is not configured."
    };
  }

  try {
    let lastError = "OpenAI returned no valid content.";
    for (let attempt = 0; attempt < 2; attempt += 1) {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
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
                "Return JSON with summary, confidence, and nextActions. Include caveats for vineyard harvest-risk predictions."
            },
            { role: "user", content: `${JSON.stringify(request)}${attempt ? "\nReturn only valid JSON matching the requested schema." : ""}` }
          ]
        }),
        cache: "no-store"
      });
      if (!response.ok) {
        return { provider: "openai", model, ok: false, error: `OpenAI request failed with ${response.status}.` };
      }
      const json = (await response.json()) as { choices?: Array<{ message?: { content?: string } }> };
      const content = json.choices?.[0]?.message?.content;
      if (!content) {
        lastError = "OpenAI returned no content.";
        continue;
      }
      const parsed = parseAiJsonContent<T>(content);
      if (parsed.ok) {
        return {
          provider: "openai",
          model,
          ok: true,
          data: parsed.data
        };
      }
      lastError = parsed.error;
    }
    return { provider: "openai", model, ok: false, error: lastError };
  } catch (error) {
    return {
      provider: "openai",
      model,
      ok: false,
      error: error instanceof Error ? error.message : "Unknown OpenAI error."
    };
  }
}
