import { afterEach, describe, expect, it, vi } from "vitest";
import { POST as createMemo } from "@/app/api/memos/route";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("generation APIs", () => {
  it("keeps deal memo generation available on the hosted demo path", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("VINESCOUT_ADMIN_TOKEN", "");
    vi.stubEnv("ORBITAI_API_KEY", "");
    vi.stubEnv("ORBITAI_API_BASE_URL", "");
    vi.stubEnv("OPENAI_API_KEY", "");

    const response = await createMemo(
      new Request("https://vinescout.test/api/memos", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ opportunityId: "domaine-valclaire" })
      })
    );
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json.memo.markdown).toContain("Domaine Valclaire");
    expect(json.ai.provider).toBe("mock");
  });
});
