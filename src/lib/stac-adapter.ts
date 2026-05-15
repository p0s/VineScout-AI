import type { EvidenceSource } from "./types";

export type StacAdapterStatus = {
  source: EvidenceSource;
  configured: boolean;
  endpoint?: string;
  summary: string;
};

export function getStacAdapterStatus(): StacAdapterStatus {
  const endpoint = process.env.STAC_API_URL ?? process.env.COPERNICUS_STAC_URL;
  if (!endpoint) {
    return {
      source: "unavailable",
      configured: false,
      summary: "Optional STAC/Copernicus adapter is not configured; seeded signals remain active."
    };
  }
  return {
    source: "live_public",
    configured: true,
    endpoint,
    summary: "STAC/Copernicus endpoint is configured for future parcel imagery search."
  };
}
