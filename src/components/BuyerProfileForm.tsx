"use client";

import { useState } from "react";
import { dealTypes, type BuyerProfile, type DealType } from "@/lib/types";
import { formatDealType } from "@/lib/utils";

function parseList(value: FormDataEntryValue | null): string[] {
  return String(value)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseDealTypes(value: FormDataEntryValue | null): DealType[] {
  const requested = parseList(value);
  const valid = requested.filter((item): item is DealType => dealTypes.includes(item as DealType));
  return valid.length ? valid : ["supply_contract"];
}

function buildLocalStrategy(profile: BuyerProfile) {
  return `${profile.companyName} should prioritize ${profile.targetCountries.slice(0, 3).join(", ")} vineyards that support ${profile.preferredDealTypes
    .map(formatDealType)
    .join(", ")} while keeping harvest-risk evidence tied to export readiness and China premium fit. Hosted demo mode keeps this intake local unless the server write API is enabled.`;
}

export function BuyerProfileForm({ initialProfile }: { initialProfile: BuyerProfile }) {
  const [profile, setProfile] = useState(initialProfile);
  const [notes, setNotes] = useState(initialProfile.notes ?? "");
  const [strategy, setStrategy] = useState("Submit the profile to generate a strategy brief.");
  const [status, setStatus] = useState("Seeded demo profile loaded.");
  const [uploadStatus, setUploadStatus] = useState("No buyer notes uploaded.");

  async function loadNotesFile(file: File | undefined) {
    if (!file) return;
    if (file.size > 200000) {
      setUploadStatus("Use a text file under 200 KB for the local demo upload.");
      return;
    }
    const text = await file.text();
    setNotes(text.slice(0, 5000));
    setUploadStatus(`${file.name} loaded locally. Nothing was uploaded to the server.`);
  }

  async function submit(formData: FormData) {
    const now = new Date().toISOString();
    const payload = {
      companyName: String(formData.get("companyName")),
      companyType: String(formData.get("companyType")),
      channels: parseList(formData.get("channels")),
      targetProducts: parseList(formData.get("targetProducts")),
      targetCountries: parseList(formData.get("targetCountries")),
      preferredDealTypes: parseDealTypes(formData.get("preferredDealTypes")),
      budgetMinUsd: Number(formData.get("budgetMinUsd")),
      budgetMaxUsd: Number(formData.get("budgetMaxUsd")),
      targetChinaPriceTier: String(formData.get("targetChinaPriceTier")),
      riskAppetite: String(formData.get("riskAppetite")),
      timeline: String(formData.get("timeline")),
      notes
    } as Omit<BuyerProfile, "id" | "createdAt" | "updatedAt">;
    const localProfile: BuyerProfile = {
      ...payload,
      id: profile.id,
      createdAt: profile.createdAt,
      updatedAt: now
    };

    try {
      const response = await fetch("/api/buyer-profile", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload)
      });
      const json = (await response.json()) as { profile?: BuyerProfile; strategy?: string; error?: string };
      if (!response.ok || !json.profile) {
        setProfile(localProfile);
        setStrategy(buildLocalStrategy(localProfile));
        setStatus(json.error ?? "Hosted write API unavailable; using local-only strategy.");
        return;
      }
      setProfile(json.profile);
      setStrategy(json.strategy ?? buildLocalStrategy(json.profile));
      setStatus("Server profile saved and strategy generated.");
    } catch {
      setProfile(localProfile);
      setStrategy(buildLocalStrategy(localProfile));
      setStatus("Network unavailable; using local-only strategy.");
    }
  }

  return (
    <div className="grid two">
      <form action={submit} className="workspace">
        <div className="badge-row">
          <button className="button" type="submit">
            Generate buyer strategy
          </button>
        </div>
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
          <textarea name="notes" value={notes} onChange={(event) => setNotes(event.target.value)} />
        </label>
        <label>
          Local buyer brief upload
          <input
            accept=".txt,.md,.csv,text/plain,text/markdown,text/csv"
            type="file"
            onChange={(event) => void loadNotesFile(event.target.files?.[0])}
          />
        </label>
        <p className="muted">{uploadStatus}</p>
      </form>
      <aside className="workspace">
        <p className="eyebrow">AI intake output</p>
        <h2>Fit criteria</h2>
        <p className="muted">{status}</p>
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
