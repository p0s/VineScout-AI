import { OrbitAiTaskBuilder } from "@/components/OrbitAiTaskBuilder";
import { getProviderStatus } from "@/lib/ai";
import { listVineyards } from "@/lib/store";

export default async function OrbitAiPage({
  searchParams
}: {
  searchParams?: Promise<{ opportunityId?: string | string[] }>;
}) {
  const params = await searchParams;
  const opportunityId = Array.isArray(params?.opportunityId) ? params?.opportunityId[0] : params?.opportunityId;
  const providerStatus = getProviderStatus();
  const vineyards = listVineyards();
  return (
    <>
      <section className="page-head">
        <div>
          <p className="eyebrow">OrbitAI task studio</p>
          <h2>Eye-of-God manual handoff</h2>
          <p>
            Generate satellite-observable task prompts and attach pasted results. Relay mode is server-only when
            configured.
          </p>
        </div>
        <span className="badge">{providerStatus.orbitai ? "OrbitAI relay configured" : "Mock fallback active"}</span>
      </section>
      <OrbitAiTaskBuilder vineyards={vineyards} initialOpportunityId={opportunityId} />
    </>
  );
}
