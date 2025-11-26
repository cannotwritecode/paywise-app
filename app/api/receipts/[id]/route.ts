
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/src/lib/mock-db";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const receipt = await db.getReceipt(id);

    if (!receipt) {
      return NextResponse.json(
        { error: "Receipt not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(receipt);
  } catch (error) {
    console.error("Get receipt error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
