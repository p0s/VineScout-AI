import type { VineyardOpportunity } from "./types";

export type SatellitePreview = {
  id: string;
  title: string;
  imageUrl: string;
  sourceUrl: string;
  sourceLabel: string;
  provenance: "live_public";
  observation: string;
};

const previews: SatellitePreview[] = [
  {
    id: "vineyard_rows",
    title: "Parcel-row structure",
    imageUrl: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Aerial_view_of_Vineyards_in_Barossa_Valley.jpg?width=900",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Aerial_view_of_Vineyards_in_Barossa_Valley.jpg",
    sourceLabel: "Wikimedia Commons aerial vineyard imagery",
    provenance: "live_public",
    observation: "Use row geometry and parcel breaks as a proxy for block uniformity before ordering premium validation."
  },
  {
    id: "canopy_blocks",
    title: "Canopy color contrast",
    imageUrl: "https://commons.wikimedia.org/wiki/Special:Redirect/file:Vineyards_in_Napa_Valley_aerial_view.jpg?width=900",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Vineyards_in_Napa_Valley_aerial_view.jpg",
    sourceLabel: "Wikimedia Commons vineyard aerial view",
    provenance: "live_public",
    observation: "Compare green-density variation across blocks to flag possible vigor or irrigation inconsistency."
  },
  {
    id: "terrain_exposure",
    title: "Slope and exposure",
    imageUrl: "https://commons.wikimedia.org/wiki/Special:Redirect/file:Vineyards_near_Saint-Emilion_aerial_view.jpg?width=900",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Vineyards_near_Saint-Emilion_aerial_view.jpg",
    sourceLabel: "Wikimedia Commons vineyard landscape",
    provenance: "live_public",
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
