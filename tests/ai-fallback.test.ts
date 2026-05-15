import { describe, expect, it, vi } from "vitest";
import { runAi } from "@/lib/ai";

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
});
