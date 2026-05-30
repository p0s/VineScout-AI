import { NextResponse } from "next/server";
import { runAi } from "@/lib/ai";
import { hostedWriteGuard } from "@/lib/api-security";
import { buildEyeOfGodPrompt } from "@/lib/generators";
import { getVineyard } from "@/lib/store";

export async function POST(request: Request) {
  const blocked = hostedWriteGuard(request);
  if (blocked) return blocked;

  const body = (await request.json().catch(() => ({}))) as { opportunityId?: string };
  if (!body.opportunityId) return NextResponse.json({ error: "opportunityId is required" }, { status: 400 });
  const vineyard = getVineyard(body.opportunityId);
  if (!vineyard) return NextResponse.json({ error: "Vineyard not found" }, { status: 404 });
  const prompt = buildEyeOfGodPrompt(vineyard);
  const ai = await runAi({
    task: "eye_of_god_prompt",
    prompt,
    context: { vineyard }
  });
  return NextResponse.json({
    prompt,
    metadata: {
      opportunityId: vineyard.id,
      source: "eye_of_god_handoff",
      expectedSchema: ["observations", "confidence", "imagery_or_metadata", "caveats", "sourcing_relevance"]
    },
    ai
  });
}
