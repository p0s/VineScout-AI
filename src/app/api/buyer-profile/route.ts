import { NextResponse } from "next/server";
import { runAi } from "@/lib/ai";
import { hostedWriteGuard } from "@/lib/api-security";
import { buyerProfileInputSchema } from "@/lib/schemas";
import { saveBuyerProfile } from "@/lib/store";
import { buildBuyerStrategy } from "@/lib/generators";

export async function POST(request: Request) {
  const blocked = hostedWriteGuard(request);
  if (blocked) return blocked;
  const body = await request.json().catch(() => ({}));
  const input = buyerProfileInputSchema.parse(body);
  const profile = saveBuyerProfile(input);
  const ai = await runAi<{ summary: string }>({
    task: "buyer_strategy",
    prompt: "Generate a buyer strategy brief.",
    context: { profile }
  });
  return NextResponse.json({ profile, strategy: ai.data?.summary ?? buildBuyerStrategy(profile), ai });
}
