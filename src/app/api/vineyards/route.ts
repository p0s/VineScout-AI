import { NextResponse } from "next/server";
import { listVineyards } from "@/lib/store";

export function GET() {
  return NextResponse.json({ vineyards: listVineyards() });
}
