import { NextResponse } from "next/server";

export function hostedWriteGuard(request: Request): NextResponse | null {
  if (process.env.NODE_ENV !== "production") return null;
  const expected = process.env.VINESCOUT_ADMIN_TOKEN;
  if (!expected) {
    return NextResponse.json({ error: "Hosted write API is disabled until VINESCOUT_ADMIN_TOKEN is configured." }, { status: 503 });
  }
  const provided = request.headers.get("x-vinescout-admin-token");
  if (provided !== expected) {
    return NextResponse.json({ error: "Admin token required for hosted write API." }, { status: 401 });
  }
  return null;
}
