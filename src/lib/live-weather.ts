import type { EvidenceSource } from "./types";
import { clampScore } from "./utils";

export type LiveWeatherRisk = {
  source: EvidenceSource;
  title: string;
  summary: string;
  confidence: number;
  heatRisk: number;
  frostRisk: number;
  droughtProxy: number;
  observedAt: string;
};

type OpenMeteoResponse = {
  current?: {
    time?: string;
    temperature_2m?: number;
    relative_humidity_2m?: number;
    precipitation?: number;
  };
};

export async function fetchLiveWeatherRisk(lat: number, lng: number): Promise<LiveWeatherRisk> {
  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lng),
    current: "temperature_2m,relative_humidity_2m,precipitation",
    timezone: "UTC"
  });

  try {
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`, {
      cache: "no-store",
      next: { revalidate: 0 }
    });
    if (!response.ok) return unavailable("Open-Meteo returned a non-OK response.");
    const json = (await response.json()) as OpenMeteoResponse;
    const current = json.current;
    if (!current) return unavailable("Open-Meteo returned no current weather payload.");
    const temperature = current.temperature_2m ?? 18;
    const humidity = current.relative_humidity_2m ?? 55;
    const precipitation = current.precipitation ?? 0;
    const heatRisk = clampScore((temperature - 20) * 4 + Math.max(0, 45 - humidity) * 0.7);
    const frostRisk = clampScore((7 - temperature) * 9);
    const droughtProxy = clampScore(Math.max(0, 60 - humidity) * 0.8 + Math.max(0, 1.5 - precipitation) * 12);
    return {
      source: "live_public",
      title: "Open-Meteo current weather proxy",
      summary: `Current public weather near the vineyard: ${temperature}C, ${humidity}% humidity, ${precipitation}mm precipitation.`,
      confidence: 62,
      heatRisk,
      frostRisk,
      droughtProxy,
      observedAt: current.time ?? new Date().toISOString()
    };
  } catch {
    return unavailable("Live weather is unavailable. Seeded demo signals remain active.");
  }
}

function unavailable(summary: string): LiveWeatherRisk {
  return {
    source: "unavailable",
    title: "Live weather unavailable",
    summary,
    confidence: 0,
    heatRisk: 0,
    frostRisk: 0,
    droughtProxy: 0,
    observedAt: new Date().toISOString()
  };
}
