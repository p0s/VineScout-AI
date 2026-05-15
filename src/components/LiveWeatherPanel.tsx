"use client";

import { useEffect, useState } from "react";
import { EvidenceBadge } from "./EvidenceBadge";

type WeatherState = {
  weather?: {
    source: "seeded_demo" | "live_public" | "orbitai_relay" | "eye_of_god_handoff" | "user_uploaded" | "unavailable";
    title: string;
    summary: string;
    confidence: number;
    heatRisk: number;
    frostRisk: number;
    droughtProxy: number;
    observedAt: string;
  };
  error?: string;
};

export function LiveWeatherPanel({ lat, lng }: { lat: number; lng: number }) {
  const [state, setState] = useState<WeatherState>({ error: "Loading public weather proxy..." });

  useEffect(() => {
    let active = true;
    fetch(`/api/weather?lat=${lat}&lng=${lng}`)
      .then((response) => response.json())
      .then((json: WeatherState) => {
        if (active) setState(json);
      })
      .catch(() => {
        if (active) setState({ error: "Live weather unavailable; seeded signals remain active." });
      });
    return () => {
      active = false;
    };
  }, [lat, lng]);

  return (
    <div className="workspace">
      <div className="badge-row">
        <h3>Live weather proxy</h3>
        {state.weather ? <EvidenceBadge source={state.weather.source} /> : null}
      </div>
      <p>{state.weather?.summary ?? state.error}</p>
      {state.weather ? (
        <div className="grid three">
          <div className="metric">
            <span>Heat risk</span>
            <strong>{state.weather.heatRisk}</strong>
          </div>
          <div className="metric">
            <span>Frost risk</span>
            <strong>{state.weather.frostRisk}</strong>
          </div>
          <div className="metric">
            <span>Drought proxy</span>
            <strong>{state.weather.droughtProxy}</strong>
          </div>
        </div>
      ) : null}
    </div>
  );
}
