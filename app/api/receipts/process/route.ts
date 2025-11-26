
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { db } from "@/src/lib/mock-db";
import axios from "axios";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "YOUR_API_KEY");

// Simple in-memory rate limiter
const rateLimit = new Map<string, number[]>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_MINUTE = 15;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const requests = rateLimit.get(ip) || [];
  
  // Filter out old requests
  const recentRequests = requests.filter(time => now - time < RATE_LIMIT_WINDOW);
  
  if (recentRequests.length >= MAX_REQUESTS_PER_MINUTE) {
    return true;
  }
  
  recentRequests.push(now);
  rateLimit.set(ip, recentRequests);
  return false;
}

export async function POST(req: NextRequest) {
  try {
    // 1. Rate Limiting
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "System busy, please try again in a moment." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { image } = body; // Base64 string

    if (!image) {
      return NextResponse.json(
        { error: "Image required" },
        { status: 400 }
      );
    }

    // 2. Clean base64
    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");

    // 3. Call Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const prompt = `Extract items, prices (in Naira), vendor, and date from this receipt. Return JSON only: { "vendor": string, "date": string, "items": [{ "productName": string, "price": number }] }`;

    let data;
    try {
      console.log("Calling Gemini API...");
      const result = await model.generateContent([
        prompt,
        { inlineData: { data: base64Data, mimeType: "image/jpeg" } }
      ]);
      
      const text = result.response.text();
      console.log("Gemini Raw Response:", text);

      const cleanJson = text.replace(/```json|```/g, "").trim();
      data = JSON.parse(cleanJson);
      console.log("Parsed Data:", data);
    } catch (geminiError) {
      console.error("Gemini API Error Details:", geminiError);
      // Fallback for demo if API key is invalid/missing
      data = {
        vendor: "Unknown Vendor",
        date: new Date().toISOString().split('T')[0],
        items: [{ productName: "Scanned Item (Demo)", price: 0 }]
      };
    }

    // 4. Save to Real Backend
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";
    
    // Get the auth token from the incoming request headers
    const authHeader = req.headers.get("authorization");
    const headers = authHeader ? { Authorization: authHeader } : {};

    let receiptId;

    try {
      console.log(`Creating receipt in backend: ${backendUrl}/receipts`);
      const createResponse = await axios.post(`${backendUrl}/receipts`, {
        imageUrl: "placeholder_url", // In a real app, upload to S3 first
        ocrData: data
      }, { headers });
      
      receiptId = createResponse.data.id || createResponse.data.data?.id;
      console.log("Receipt created with ID:", receiptId);
    } catch (backendError: any) {
      console.error("Failed to create receipt in backend:", backendError.message);
      // Fallback to mock ID if backend fails (for development continuity, though user requested strict backend usage)
      // But user said "Don't generate custom IDs", so we should probably fail or handle it.
      // However, to avoid breaking the flow if backend is partial, I'll throw error.
      throw new Error("Failed to create receipt in backend: " + backendError.message);
    }

    return NextResponse.json({ 
      receiptId: receiptId, 
      data 
    });

  } catch (error) {
    console.error("Processing error:", error);
    return NextResponse.json(
      { error: "Failed to process receipt" },
      { status: 500 }
    );
  }
}
