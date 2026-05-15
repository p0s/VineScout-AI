"use client";

import { useMemo, useState } from "react";
import type { WatchAlert } from "@/lib/types";
import { EvidenceBadge } from "./EvidenceBadge";

export function WatchlistPanel({ alerts }: { alerts: WatchAlert[] }) {
  const alertTargets = useMemo(() => Array.from(new Set(alerts.map((alert) => alert.opportunityId))), [alerts]);
  const [watched, setWatched] = useState(() => new Set(alertTargets));

  function toggleWatched(opportunityId: string) {
    setWatched((current) => {
      const next = new Set(current);
      if (next.has(opportunityId)) {
        next.delete(opportunityId);
      } else {
        next.add(opportunityId);
      }
      return next;
    });
  }

  return (
    <div className="workspace">
      <div className="page-head compact">
        <div>
          <h3>Watchlist alerts</h3>
          <p>{watched.size} opportunities watched in this demo session.</p>
        </div>
      </div>
      <div className="opportunity-list">
        {alerts.map((alert) => (
          <div key={alert.id}>
            <div className="badge-row">
              <span className="badge">{alert.severity}</span>
              <EvidenceBadge source={alert.source} />
              <button className="button secondary small" type="button" onClick={() => toggleWatched(alert.opportunityId)}>
                {watched.has(alert.opportunityId) ? "Watching" : "Watch"}
              </button>
            </div>
            <p>{alert.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
