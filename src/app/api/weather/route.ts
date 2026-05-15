import { NextResponse } from "next/server";
import { fetchLiveWeatherRisk } from "@/lib/live-weather";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const lat = Number(url.searchParams.get("lat"));
  const lng = Number(url.searchParams.get("lng"));
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return NextResponse.json({ error: "lat and lng query parameters are required" }, { status: 400 });
  }
  const weather = await fetchLiveWeatherRisk(lat, lng);
  return NextResponse.json({ weather });
}
