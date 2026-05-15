import { NextResponse } from "next/server";
import { scoreVineyard } from "@/lib/store";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { opportunityId?: string };
  if (!body.opportunityId) return NextResponse.json({ error: "opportunityId is required" }, { status: 400 });
  const score = scoreVineyard(body.opportunityId);
  if (!score) return NextResponse.json({ error: "Vineyard not found" }, { status: 404 });
  return NextResponse.json({ score });
}
