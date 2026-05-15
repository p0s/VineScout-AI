import type { WatchAlert } from "@/lib/types";
import { EvidenceBadge } from "./EvidenceBadge";

export function WatchlistPanel({ alerts }: { alerts: WatchAlert[] }) {
  return (
    <div className="workspace">
      <h3>Watchlist alerts</h3>
      <div className="opportunity-list">
        {alerts.map((alert) => (
          <div key={alert.id}>
            <div className="badge-row">
              <span className="badge">{alert.severity}</span>
              <EvidenceBadge source={alert.source} />
            </div>
            <p>{alert.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
