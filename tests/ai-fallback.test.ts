import { afterEach, describe, expect, it, vi } from "vitest";
import { getProviderStatus, runAi } from "@/lib/ai";
import { parseAiJsonContent } from "@/lib/ai/parse";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("AI provider fallback", () => {
  it("falls back to deterministic mock without server keys", async () => {
    vi.stubEnv("ORBITAI_API_KEY", "");
    vi.stubEnv("ORBITAI_API_BASE_URL", "");
    vi.stubEnv("OPENAI_API_KEY", "");
    const response = await runAi({
      task: "buyer_strategy",
      prompt: "Create a strategy brief."
    });
    expect(response.ok).toBe(true);
    expect(response.provider).toBe("mock");
    expect(response.usedFallback).toBe(true);
  });

  it("does not select OrbitAI as default unless the key and base URL are configured", () => {
    vi.stubEnv("ORBITAI_API_KEY", "present");
    vi.stubEnv("ORBITAI_API_BASE_URL", "");
    vi.stubEnv("OPENAI_API_KEY", "");

    expect(getProviderStatus()).toMatchObject({
      orbitai: false,
      openai: false,
      defaultProvider: "mock"
    });
  });

  it("rejects malformed provider JSON before fallback can be accepted", () => {
    expect(parseAiJsonContent("not json").ok).toBe(false);
    expect(parseAiJsonContent(JSON.stringify({ summary: "Valid", confidence: 70, nextActions: [] })).ok).toBe(true);
  });
});
