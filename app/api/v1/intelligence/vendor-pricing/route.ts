
import { NextRequest, NextResponse } from "next/server";
import { validateApiKey } from "@/src/lib/api-auth";
import { checkRateLimit, getRateLimitHeaders } from "@/src/lib/rate-limiting";
import { getVendorPricing } from "@/src/lib/analytics/intelligence";

export async function GET(req: NextRequest) {
  const auth = await validateApiKey(req);
  if (!auth.isValid) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const apiKey = req.headers.get("authorization")?.split(" ")[1] || "unknown";
  if (auth.plan === "basic") {
    return NextResponse.json(
      { error: "Upgrade to Professional plan to access this endpoint" },
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
  const vendor = searchParams.get("vendor");
  const category = searchParams.get("category") || undefined;

  if (!vendor) {
    return NextResponse.json(
      { error: "Missing required parameter: vendor" },
      { status: 400 }
    );
  }

  try {
    const data = await getVendorPricing(vendor, category);
    return NextResponse.json(data, {
      headers: getRateLimitHeaders(apiKey, auth.plan) as any
    });
  } catch (error) {
    console.error("Vendor pricing error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
