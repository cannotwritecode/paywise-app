
// Mock prediction service (ML models)

export interface PriceForecast {
  date: string;
  predictedPrice: number;
  confidence: number;
  range: [number, number];
}

export interface ForecastResponse {
  product: string;
  location: string;
  forecast: PriceForecast[];
  factors: string[];
}

export async function getPriceForecast(
  productName: string,
  location?: string,
  horizon: number = 7
): Promise<ForecastResponse> {
  await new Promise((resolve) => setTimeout(resolve, 800)); // Slower for ML

  const forecast: PriceForecast[] = [];
  const today = new Date();
  let currentPrice = 5000;

  for (let i = 1; i <= horizon; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    
    const change = (Math.random() - 0.4) * 100; // Slight upward trend
    currentPrice += change;
    const confidence = Math.max(0.5, 0.95 - (i * 0.02)); // Confidence drops over time

    forecast.push({
      date: date.toISOString().split("T")[0],
      predictedPrice: Math.round(currentPrice),
      confidence: parseFloat(confidence.toFixed(2)),
      range: [Math.round(currentPrice * 0.9), Math.round(currentPrice * 1.1)]
    });
  }

  return {
    product: productName,
    location: location || "National",
    forecast,
    factors: ["Seasonal Demand", "Fuel Price Increase", "Currency Fluctuation"]
  };
}

export interface Anomaly {
  product: string;
  location: string;
  date: string;
  price: number;
  expectedPrice: number;
  deviation: number;
  severity: "low" | "medium" | "high";
}

export async function detectAnomalies(
  category?: string,
  sensitivity: "low" | "medium" | "high" = "medium"
): Promise<Anomaly[]> {
  await new Promise((resolve) => setTimeout(resolve, 600));

  return [
    {
      product: "Rice (50kg)",
      location: "Kano",
      date: new Date().toISOString().split("T")[0],
      price: 85000,
      expectedPrice: 65000,
      deviation: 30.7,
      severity: "high"
    },
    {
      product: "Palm Oil (5L)",
      location: "Lagos",
      date: new Date().toISOString().split("T")[0],
      price: 12000,
      expectedPrice: 15000,
      deviation: -20.0,
      severity: "medium"
    }
  ];
}

export interface BasketAssociation {
  product: string;
  confidence: number;
  lift: number;
}

export interface BasketAnalysisResponse {
  anchorProduct: string;
  associations: BasketAssociation[];
  commonBundles: string[][];
}

export async function getBasketAnalysis(
  anchorProduct: string
): Promise<BasketAnalysisResponse> {
  await new Promise((resolve) => setTimeout(resolve, 700));

  return {
    anchorProduct,
    associations: [
      { product: "Vegetable Oil", confidence: 0.75, lift: 2.5 },
      { product: "Tomato Paste", confidence: 0.60, lift: 1.8 },
      { product: "Maggi Cubes", confidence: 0.55, lift: 1.5 }
    ],
    commonBundles: [
      [anchorProduct, "Vegetable Oil", "Salt"],
      [anchorProduct, "Tomato Paste", "Onions"]
    ]
  };
}
