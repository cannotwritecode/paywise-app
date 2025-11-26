import { NextRequest, NextResponse } from "next/server";
import { apiClient } from "@/src/lib/api";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { vendor, items } = body;

    if (!vendor || !items || !Array.isArray(items)) {
      return NextResponse.json(
        { error: "Invalid data" },
        { status: 400 }
      );
    }

    // Confirm Receipt in Real Backend (Batch)
    console.log(`Confirming receipt ${id} at backend via apiClient`);
    
    // Get the auth token from the incoming request headers
    const authHeader = req.headers.get("authorization");
    const headers = authHeader ? { Authorization: authHeader } : {};

    try {
      const payload = {
        items: items.map((item: any) => ({
          productName: item.productName,
          price: item.price,
          category: "Groceries" // Default or mapped category
        })),
        vendor: vendor,
        location: {
          place: "Lagos", // Default or extracted
          lat: 6.5244,
          lng: 3.3792
        }
      };

      const response = await apiClient.post(`/receipts/${id}/confirm`, payload, { headers });
      
      return NextResponse.json(response.data);

    } catch (err: any) {
      console.error("Failed to confirm receipt in backend", err.message);
      if (err.response) {
          console.error("Backend error response:", err.response.data);
          console.error("Backend error status:", err.response.status);
          return NextResponse.json(err.response.data, { status: err.response.status });
      }
      throw err;
    }

  } catch (error) {
    console.error("Confirm receipt error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
