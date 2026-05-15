import { NextResponse } from "next/server";
import { hostedWriteGuard } from "@/lib/api-security";
import { addWebhookAlert } from "@/lib/store";

export async function POST(request: Request) {
  const blocked = hostedWriteGuard(request);
  if (blocked) return blocked;
  const body = (await request.json().catch(() => ({}))) as { opportunityId?: string; title?: string; severity?: "low" | "medium" | "high" };
  if (!body.opportunityId || !body.title) {
    return NextResponse.json({ error: "opportunityId and title are required" }, { status: 400 });
  }
  const alert = addWebhookAlert({
    opportunityId: body.opportunityId,
    title: body.title,
    severity: body.severity,
    source: "user_uploaded"
  });
  return NextResponse.json({ alert, received: true });
}
