import { NextResponse } from "next/server";
import { getProviderStatus } from "@/lib/ai";
import { getStoreMode, listVineyards } from "@/lib/store";

export function GET() {
  return NextResponse.json({
    ok: true,
    name: "VineScout AI",
    dataMode: getStoreMode(),
    providerStatus: getProviderStatus(),
    seededOpportunities: listVineyards().length
  });
}
