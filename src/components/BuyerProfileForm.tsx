"use client";

import { useState } from "react";
import type { BuyerProfile } from "@/lib/types";

export function BuyerProfileForm({ initialProfile }: { initialProfile: BuyerProfile }) {
  const [profile, setProfile] = useState(initialProfile);
  const [strategy, setStrategy] = useState("Submit the profile to generate a strategy brief.");

  async function submit(formData: FormData) {
    const payload = {
      companyName: String(formData.get("companyName")),
      companyType: String(formData.get("companyType")),
      channels: String(formData.get("channels")).split(",").map((item) => item.trim()),
      targetProducts: String(formData.get("targetProducts")).split(",").map((item) => item.trim()),
      targetCountries: String(formData.get("targetCountries")).split(",").map((item) => item.trim()),
      preferredDealTypes: String(formData.get("preferredDealTypes")).split(",").map((item) => item.trim()),
      budgetMinUsd: Number(formData.get("budgetMinUsd")),
      budgetMaxUsd: Number(formData.get("budgetMaxUsd")),
      targetChinaPriceTier: String(formData.get("targetChinaPriceTier")),
      riskAppetite: String(formData.get("riskAppetite")),
      timeline: String(formData.get("timeline")),
      notes: String(formData.get("notes"))
    };
    const response = await fetch("/api/buyer-profile", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload)
    });
    const json = (await response.json()) as { profile: BuyerProfile; strategy: string };
    setProfile(json.profile);
    setStrategy(json.strategy);
  }

  return (
    <div className="grid two">
      <form action={submit} className="workspace">
        <div className="form-grid">
          <label>
            Company name
            <input name="companyName" defaultValue={profile.companyName} />
          </label>
          <label>
            Company type
            <select name="companyType" defaultValue={profile.companyType}>
              <option value="importer">Importer</option>
              <option value="dtc_brand">Premium wine DTC</option>
              <option value="distributor">Distributor</option>
              <option value="strategic_investor">Strategic investor</option>
              <option value="family_office">Family office</option>
            </select>
          </label>
          <label>
            Channels
            <input name="channels" defaultValue={profile.channels.join(", ")} />
          </label>
          <label>
            Target products
            <input name="targetProducts" defaultValue={profile.targetProducts.join(", ")} />
          </label>
          <label>
            Target countries
            <input name="targetCountries" defaultValue={profile.targetCountries.join(", ")} />
          </label>
          <label>
            Deal types
            <input name="preferredDealTypes" defaultValue={profile.preferredDealTypes.join(", ")} />
          </label>
          <label>
            Budget min
            <input name="budgetMinUsd" type="number" defaultValue={profile.budgetMinUsd} />
          </label>
          <label>
            Budget max
            <input name="budgetMaxUsd" type="number" defaultValue={profile.budgetMaxUsd} />
          </label>
          <label>
            China price tier
            <select name="targetChinaPriceTier" defaultValue={profile.targetChinaPriceTier}>
              <option value="value">Value</option>
              <option value="premium">Premium</option>
              <option value="luxury">Luxury</option>
              <option value="mixed">Mixed</option>
            </select>
          </label>
          <label>
            Risk appetite
            <select name="riskAppetite" defaultValue={profile.riskAppetite}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </label>
        </div>
        <label>
          Timeline
          <input name="timeline" defaultValue={profile.timeline} />
        </label>
        <label>
          Notes or upload summary
          <textarea name="notes" defaultValue={profile.notes} />
        </label>
        <button className="button" type="submit">
          Generate buyer strategy
        </button>
      </form>
      <aside className="workspace">
        <p className="eyebrow">AI intake output</p>
        <h2>Fit criteria</h2>
        <p>{strategy}</p>
        <div className="badge-row">
          <span className="badge">China fit</span>
          <span className="badge">Export readiness</span>
          <span className="badge">Harvest risk</span>
          <span className="badge">Owner openness</span>
        </div>
      </aside>
    </div>
  );
}
