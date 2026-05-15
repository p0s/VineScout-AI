import { NextResponse } from "next/server";
import { getStacAdapterStatus } from "@/lib/stac-adapter";

export function GET() {
  return NextResponse.json({ stac: getStacAdapterStatus() });
}
