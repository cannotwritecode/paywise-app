
import { NextRequest, NextResponse } from "next/server";

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
}

// Tier-based limits (requests per hour)
const TIER_LIMITS: Record<string, number> = {
  basic: 100,
  professional: 1000,
  enterprise: 10000,
  premium: 100000,
};

// In-memory store for rate limiting (IP + API Key based)
// In production, use Redis
const requestCounts = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(identifier: string, tier: string = "basic"): boolean {
  const now = Date.now();
  const limit = TIER_LIMITS[tier] || TIER_LIMITS.basic;
  const windowMs = 60 * 60 * 1000; // 1 hour

  const record = requestCounts.get(identifier);

  if (!record || now > record.resetTime) {
    // New window
    requestCounts.set(identifier, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (record.count >= limit) {
    return false;
  }

  record.count++;
  return true;
}

export function getRateLimitHeaders(identifier: string, tier: string = "basic") {
  const limit = TIER_LIMITS[tier] || TIER_LIMITS.basic;
  const record = requestCounts.get(identifier);
  const remaining = record ? Math.max(0, limit - record.count) : limit;
  const reset = record ? Math.ceil(record.resetTime / 1000) : Math.ceil((Date.now() + 3600000) / 1000);

  return {
    "X-RateLimit-Limit": limit.toString(),
    "X-RateLimit-Remaining": remaining.toString(),
    "X-RateLimit-Reset": reset.toString(),
  };
}
