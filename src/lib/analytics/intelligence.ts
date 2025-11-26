
// Mock intelligence service

export interface InflationData {
  category: string;
  location: string;
  currentIndex: number;
  baseIndex: number;
  baseDate: string;
  change: number;
  topContributors: { product: string; contribution: number }[];
}

export async function getInflationIndex(
  category?: string,
  location?: string,
  baseDate: string = "2024-01-01"
): Promise<InflationData> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const baseIndex = 100;
  // Random inflation between 10% and 30%
  const inflationRate = 10 + Math.random() * 20; 
  const currentIndex = baseIndex + inflationRate;

  return {
    category: category || "All Categories",
    location: location || "National",
    currentIndex: parseFloat(currentIndex.toFixed(1)),
    baseIndex,
    baseDate,
    change: parseFloat(inflationRate.toFixed(1)),
    topContributors: [
      { product: "Rice (50kg)", contribution: 3.2 },
      { product: "Cooking Gas (12.5kg)", contribution: 2.8 },
      { product: "Beans (Oloyin)", contribution: 1.5 },
    ],
  };
}

export interface VendorPricingData {
  vendor: string;
  category: string;
  pricePosition: "premium" | "budget" | "average";
  avgPriceDifference: number; // Percentage vs market average
  competitors: { name: string; priceDifference: number }[];
}

export async function getVendorPricing(
  vendor: string,
  category?: string
): Promise<VendorPricingData> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const diff = (Math.random() - 0.5) * 20; // +/- 10%

  return {
    vendor,
    category: category || "General",
    pricePosition: diff > 5 ? "premium" : diff < -5 ? "budget" : "average",
    avgPriceDifference: parseFloat(diff.toFixed(1)),
    competitors: [
      { name: "Competitor A", priceDifference: parseFloat((diff - 2).toFixed(1)) },
      { name: "Competitor B", priceDifference: parseFloat((diff + 3).toFixed(1)) },
    ],
  };
}

export interface DemandHotspot {
  location: string;
  searchVolume: number; // Normalized 0-100
  verificationCount: number;
  trendingCategory: string;
}

export async function getDemandHotspots(
  category?: string
): Promise<DemandHotspot[]> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  return [
    { location: "Lagos - Ikeja", searchVolume: 95, verificationCount: 1250, trendingCategory: "Electronics" },
    { location: "Lagos - Lekki", searchVolume: 88, verificationCount: 980, trendingCategory: "Groceries" },
    { location: "Abuja - Central", searchVolume: 82, verificationCount: 850, trendingCategory: "Fuel" },
    { location: "Port Harcourt", searchVolume: 75, verificationCount: 620, trendingCategory: "Construction" },
  ];
}
