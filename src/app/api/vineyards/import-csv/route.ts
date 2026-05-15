import { NextResponse } from "next/server";
import { hostedWriteGuard } from "@/lib/api-security";
import { importVineyardCsv } from "@/lib/store";

export async function POST(request: Request) {
  const blocked = hostedWriteGuard(request);
  if (blocked) return blocked;
  const body = (await request.json().catch(() => ({}))) as { csv?: string };
  if (!body.csv) return NextResponse.json({ error: "csv is required" }, { status: 400 });
  return NextResponse.json(importVineyardCsv(body.csv));
}
