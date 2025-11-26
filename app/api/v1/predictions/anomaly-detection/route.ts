
import { NextRequest, NextResponse } from "next/server";
import { validateApiKey } from "@/src/lib/api-auth";
import { checkRateLimit, getRateLimitHeaders } from "@/src/lib/rate-limiting";
import { detectAnomalies } from "@/src/lib/analytics/predictions";

export async function GET(req: NextRequest) {
  const auth = await validateApiKey(req);
  if (!auth.isValid) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const apiKey = req.headers.get("authorization")?.split(" ")[1] || "unknown";
  if (auth.plan !== "enterprise" && auth.plan !== "premium") {
    return NextResponse.json(
      { error: "Upgrade to Enterprise plan to access this endpoint" },
      { status: 403 }
    );
  }

  if (!checkRateLimit(apiKey, auth.plan)) {
    return NextResponse.json(
      { error: "Rate limit exceeded" },
      { status: 429, headers: getRateLimitHeaders(apiKey, auth.plan) as any }
    );
  }

  const searchParams = req.nextUrl.searchParams;
  const category = searchParams.get("category") || undefined;
  const sensitivity = (searchParams.get("sensitivity") as "low" | "medium" | "high") || "medium";

  try {
    const data = await detectAnomalies(category, sensitivity);
    return NextResponse.json(data, {
      headers: getRateLimitHeaders(apiKey, auth.plan) as any
    });
  } catch (error) {
    console.error("Anomaly detection error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
