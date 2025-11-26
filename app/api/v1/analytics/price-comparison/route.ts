
import { NextRequest, NextResponse } from "next/server";
import { validateApiKey } from "@/src/lib/api-auth";
import { checkRateLimit, getRateLimitHeaders } from "@/src/lib/rate-limiting";
import { getPriceComparison } from "@/src/lib/analytics/priceAnalytics";

export async function GET(req: NextRequest) {
  // 1. Authentication
  const auth = await validateApiKey(req);
  if (!auth.isValid) {
    return NextResponse.json(
      { error: auth.error },
      { status: auth.status }
    );
  }

  // 2. Rate Limiting
  const apiKey = req.headers.get("authorization")?.split(" ")[1] || "unknown";
  if (!checkRateLimit(apiKey, auth.plan)) {
    return NextResponse.json(
      { error: "Rate limit exceeded" },
      { 
        status: 429,
        headers: getRateLimitHeaders(apiKey, auth.plan) as any
      }
    );
  }

  // 3. Validation & Logic
  const searchParams = req.nextUrl.searchParams;
  const product = searchParams.get("productName");
  const locationsParam = searchParams.get("locations");
  const locations = locationsParam ? locationsParam.split(",") : undefined;

  if (!product) {
    return NextResponse.json(
      { error: "Missing required parameter: productName" },
      { status: 400 }
    );
  }

  try {
    const data = await getPriceComparison(product, locations);
    
    return NextResponse.json(data, {
      headers: getRateLimitHeaders(apiKey, auth.plan) as any
    });
  } catch (error) {
    console.error("Price comparison error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
