import { NextResponse } from "next/server";
import { hostedWriteGuard } from "@/lib/api-security";
import { addEyeOfGodEvidence } from "@/lib/store";

export async function POST(request: Request) {
  const blocked = hostedWriteGuard(request);
  if (blocked) return blocked;
  try {
    const body = await request.json();
    const evidence = addEyeOfGodEvidence(body);
    return NextResponse.json({ evidence });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to add evidence" }, { status: 400 });
  }
}
