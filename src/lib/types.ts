export interface User {
  id: string;
  email: string;
  name: string;
  location: string;
  reputation: number;
  total_contributions: number;
  rewards_balance: number;
  avatar_url?: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  unit: string;
  avg_price: number;
  price_volatility: number;
}

export interface Vendor {
  id: string;
  name: string;
  type: "market" | "supermarket" | "online" | "wholesaler";
  location: string;
  verified: boolean;
  rating?: number;
}

export interface PriceEntry {
  id: string;
  productName: string;
  price: number;
  vendor: string;
  location: { lat?: number; lng?: number; place: string };
  verificationCount: number;
  createdAt: string;
  photoUrl?: string;
  user: {
    id: string;
    name: string;
    avatar: string;
    reputation: number;
  };
}

export interface Receipt {
  id: string;
  user_id: string;
  image_url: string;
  ocr_data?: { items: Array<{ product: string; price: number }> };
  processed: boolean;
  created_at: string;
}

export interface Verification {
  id: string;
  price_entry_id: string;
  user_id: string;
  action: string;
  priceReported?: number;
}

export interface Reward {
  id: string;
  points: number;
  badges: Badge[];
  tier: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon_url: string;
  earned_at?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}
