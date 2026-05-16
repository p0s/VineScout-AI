import type { VineyardOpportunity } from "./types";

export type SatellitePreview = {
  id: string;
  title: string;
  imageUrl: string;
  sourceUrl: string;
  sourceLabel: string;
  provenance: "seeded_demo";
  observation: string;
};

const previews: SatellitePreview[] = [
  {
    id: "vineyard_rows",
    title: "Parcel-row structure",
    imageUrl: "/demo/satellite-vineyard-rows.png",
    sourceUrl: "/demo/satellite-vineyard-rows.png",
    sourceLabel: "Generated VineScout demo satellite-style image",
    provenance: "seeded_demo",
    observation: "Use row geometry and parcel breaks as a proxy for block uniformity before ordering premium validation."
  },
  {
    id: "canopy_blocks",
    title: "Canopy color contrast",
    imageUrl: "/demo/satellite-canopy-blocks.png",
    sourceUrl: "/demo/satellite-canopy-blocks.png",
    sourceLabel: "Generated VineScout demo satellite-style image",
    provenance: "seeded_demo",
    observation: "Compare green-density variation across blocks to flag possible vigor or irrigation inconsistency."
  },
  {
    id: "terrain_exposure",
    title: "Slope and exposure",
    imageUrl: "/demo/satellite-terrain-exposure.png",
    sourceUrl: "/demo/satellite-terrain-exposure.png",
    sourceLabel: "Generated VineScout demo satellite-style image",
    provenance: "seeded_demo",
    observation: "Check terrain exposure and neighboring parcel context before spending on travel or broker diligence."
  }
];

export function satellitePreviewsFor(vineyard?: VineyardOpportunity): SatellitePreview[] {
  if (!vineyard) return previews;
  const offset = Math.abs(vineyard.lat + vineyard.lng) % previews.length;
  const start = Math.floor(offset);
  return [...previews.slice(start), ...previews.slice(0, start)];
}

export function satellitePreviewFor(vineyard?: VineyardOpportunity): SatellitePreview {
  return satellitePreviewsFor(vineyard)[0];
}
