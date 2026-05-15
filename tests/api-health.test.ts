import { describe, expect, it } from "vitest";
import { GET } from "@/app/api/health/route";

describe("health API", () => {
  it("reports seeded data and provider status", async () => {
    const response = GET();
    const json = await response.json();
    expect(response.status).toBe(200);
    expect(json.ok).toBe(true);
    expect(json.seededOpportunities).toBeGreaterThanOrEqual(100);
    expect(json.providerStatus.defaultProvider).toBeTruthy();
  });
});
