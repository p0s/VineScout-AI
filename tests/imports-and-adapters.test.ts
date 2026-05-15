import { describe, expect, it, vi } from "vitest";
import { parseVineyardCsv } from "@/lib/csv-import";
import { getStacAdapterStatus } from "@/lib/stac-adapter";

describe("imports and optional adapters", () => {
  it("imports vineyard candidates from CSV with user provenance", () => {
    const result = parseVineyardCsv(
      "name,region,country,lat,lng,hectares,varietals\nDemo Import Estate,Test Valley,France,43.7,3.9,12,Syrah|Grenache"
    );
    expect(result.imported).toHaveLength(1);
    expect(result.imported[0].evidence[0].source).toBe("user_uploaded");
  });

  it("reports STAC as unavailable without endpoint env", () => {
    vi.stubEnv("STAC_API_URL", "");
    vi.stubEnv("COPERNICUS_STAC_URL", "");
    expect(getStacAdapterStatus()).toMatchObject({ configured: false, source: "unavailable" });
  });
});
