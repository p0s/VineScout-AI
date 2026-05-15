import type { AiProviderName, AiRequest, AiResponse } from "../types";
import { mockAi } from "./mock";
import { openAi } from "./openai";
import { orbitAi } from "./orbitai";

export async function runAi<T = unknown>(
  request: AiRequest,
  preferred: AiProviderName = "orbitai"
): Promise<AiResponse<T>> {
  const providers =
    preferred === "orbitai"
      ? [orbitAi<T>, openAi<T>, mockAi<T>]
      : preferred === "openai"
        ? [openAi<T>, orbitAi<T>, mockAi<T>]
        : [mockAi<T>];

  for (const provider of providers) {
    const response = await provider(request);
    if (response.ok) {
      return response.provider === preferred ? response : { ...response, usedFallback: true };
    }
  }
  return mockAi<T>(request);
}

export function getProviderStatus() {
  const orbitaiConfigured = Boolean(process.env.ORBITAI_API_KEY && process.env.ORBITAI_API_BASE_URL);
  const openaiConfigured = Boolean(process.env.OPENAI_API_KEY);

  return {
    orbitai: orbitaiConfigured,
    openai: openaiConfigured,
    defaultProvider: orbitaiConfigured ? "orbitai" : openaiConfigured ? "openai" : "mock"
  };
}
