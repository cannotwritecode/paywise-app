
// Mock analytics service
// In production, this would query the database (PostgreSQL/TimescaleDB)

export interface PriceTrendData {
  date: string;
  avgPrice: number;
  minPrice: number;
  maxPrice: number;
  sampleSize: number;
}

export interface PriceTrendResponse {
  product: string;
  category?: string;
  location?: string;
  period: string;
  data: PriceTrendData[];
  trend: "increasing" | "decreasing" | "stable";
  percentageChange: number;
}

export async function getPriceTrends(
  productName: string,
  location?: string,
  days: number = 30
): Promise<PriceTrendResponse> {
  // Simulate DB delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const data: PriceTrendData[] = [];
  const today = new Date();
  let currentPrice = 5000 + Math.random() * 2000; // Random start price

  for (let i = days; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    
    // Random daily fluctuation
    const fluctuation = (Math.random() - 0.45) * 200; // Slight upward trend
    currentPrice += fluctuation;
    
    data.push({
      date: date.toISOString().split("T")[0],
      avgPrice: Math.round(currentPrice),
      minPrice: Math.round(currentPrice * 0.95),
      maxPrice: Math.round(currentPrice * 1.05),
      sampleSize: Math.floor(Math.random() * 50) + 10,
    });
  }

  const startPrice = data[0].avgPrice;
  const endPrice = data[data.length - 1].avgPrice;
  const change = ((endPrice - startPrice) / startPrice) * 100;

  return {
    product: productName,
    location: location || "All Locations",
    period: `${days}d`,
    data,
    trend: change > 2 ? "increasing" : change < -2 ? "decreasing" : "stable",
    percentageChange: parseFloat(change.toFixed(2)),
  };
}

export interface PriceComparisonData {
  location: string;
  price: number;
  lastUpdated: string;
  vendorCount: number;
}

export interface PriceComparisonResponse {
  product: string;
  timestamp: string;
  data: PriceComparisonData[];
  lowestPrice: { location: string; price: number };
  highestPrice: { location: string; price: number };
  averagePrice: number;
}

export async function getPriceComparison(
  productName: string,
  locations?: string[]
): Promise<PriceComparisonResponse> {
  // Simulate DB delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const allLocations = ["Lagos", "Abuja", "Port Harcourt", "Ibadan", "Kano"];
  const targetLocations = locations && locations.length > 0 ? locations : allLocations;
  
  const data: PriceComparisonData[] = targetLocations.map(loc => {
    const basePrice = 5000 + Math.random() * 2000;
    // Add regional variance
    const variance = loc === "Lagos" || loc === "Abuja" ? 1.2 : 0.9;
    
    return {
      location: loc,
      price: Math.round(basePrice * variance),
      lastUpdated: new Date().toISOString(),
      vendorCount: Math.floor(Math.random() * 20) + 5
    };
  });

  const sorted = [...data].sort((a, b) => a.price - b.price);
  const sum = data.reduce((acc, curr) => acc + curr.price, 0);

  return {
    product: productName,
    timestamp: new Date().toISOString(),
    data,
    lowestPrice: { location: sorted[0].location, price: sorted[0].price },
    highestPrice: { location: sorted[sorted.length - 1].location, price: sorted[sorted.length - 1].price },
    averagePrice: Math.round(sum / data.length)
  };
}
