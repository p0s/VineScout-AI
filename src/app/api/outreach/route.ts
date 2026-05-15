import { NextResponse } from "next/server";
import { runAi } from "@/lib/ai";
import { buildOutreach } from "@/lib/generators";
import { demoBuyerProfile } from "@/lib/seed-data";
import { getVineyard } from "@/lib/store";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { opportunityId?: string };
  if (!body.opportunityId) return NextResponse.json({ error: "opportunityId is required" }, { status: 400 });
  const vineyard = getVineyard(body.opportunityId);
  if (!vineyard) return NextResponse.json({ error: "Vineyard not found" }, { status: 404 });
  const outreach = buildOutreach(vineyard, demoBuyerProfile);
  const ai = await runAi({
    task: "outreach",
    prompt: outreach.ownerEmail,
    context: { vineyard, buyerProfile: demoBuyerProfile }
  });
  return NextResponse.json({ outreach, ai });
}
