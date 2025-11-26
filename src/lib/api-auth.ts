
import { NextRequest, NextResponse } from "next/server";

// Mock API Key store (In production, this would be in the database)
const VALID_API_KEYS = new Map([
  ["pk_test_12345", { plan: "basic", requests: 0 }],
  ["pk_live_98765", { plan: "enterprise", requests: 0 }],
]);

export interface ApiAuthResult {
  isValid: boolean;
  plan?: string;
  error?: string;
  status?: number;
}

export async function validateApiKey(req: NextRequest): Promise<ApiAuthResult> {
  const authHeader = req.headers.get("authorization");
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return { 
      isValid: false, 
      error: "Missing or invalid Authorization header. Format: 'Bearer <api_key>'",
      status: 401 
    };
  }

  const apiKey = authHeader.split(" ")[1];
  const client = VALID_API_KEYS.get(apiKey);

  if (!client) {
    return { 
      isValid: false, 
      error: "Invalid API key",
      status: 403 
    };
  }

  // Simple usage tracking (in-memory)
  client.requests++;

  return { 
    isValid: true, 
    plan: client.plan 
  };
}
