"use client";

import { useState, useEffect } from "react";
import { Search, BarChart3, Map, List, Filter, MapPin, Bell } from "lucide-react";
import { AppShell } from "@/src/components/layout/AppShell";
import { Input } from "@/src/components/common/Input";
import { PriceCard } from "@/src/components/price/PriceCard";
import { Card } from "@/src/components/common/Card";
import { Select } from "@/src/components/common/Select";
import { cn } from "@/src/lib/utils";
import { apiClient } from "@/src/lib/api";
import { toast } from "sonner";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

type View = "list" | "chart" | "map";

// Premium Segmented Control
const SegmentedControl = ({ view, setView }: { view: View; setView: (view: View) => void }) => {
  const tabs = [
    { label: "List", value: "list", icon: List },
    { label: "Chart", value: "chart", icon: BarChart3 },
    { label: "Map", value: "map", icon: Map },
  ];

  return (
    <div className="flex p-1 bg-secondary/30 backdrop-blur-sm rounded-xl border border-border/50">
      {tabs.map((tab) => {
        const isActive = view === tab.value;
        return (
          <button
            key={tab.value}
            onClick={() => setView(tab.value as View)}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-300",
              isActive
                ? "bg-background text-primary shadow-sm scale-100"
                : "text-muted-foreground hover:text-foreground hover:bg-background/50"
            )}
          >
            <tab.icon size={16} />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default function ComparePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [view, setView] = useState<View>("list");
  const [location, setLocation] = useState("Lagos");
  const [prices, setPrices] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch prices when search query or location changes
  useEffect(() => {
    const fetchPrices = async () => {
      setLoading(true);
      try {
        const { data } = await apiClient.get("/prices", {
          params: {
            product: searchQuery,
            location: location,
            limit: 20,
          },
        });
        setPrices(data.items);
      } catch (error) {
        console.error("Failed to fetch prices", error);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      fetchPrices();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, location]);

  return (
    <AppShell>
      <div className="space-y-6 pb-20">
        {/* Header Section */}
        <div className="relative py-8 px-4 -mx-4 md:mx-0 md:px-0 bg-gradient-to-b from-primary/5 to-transparent md:bg-none rounded-b-3xl md:rounded-none">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-display font-bold text-3xl text-foreground">
                  Compare Prices
                </h1>
                <p className="text-muted-foreground">
                  Find the best deals across different vendors in your area.
                </p>
              </div>
              <button 
                onClick={() => toast.success("Price alerts enabled for " + (searchQuery || "all products"))}
                className="p-3 rounded-full bg-card border border-border hover:border-primary/50 hover:bg-primary/5 hover:text-primary transition-all shadow-sm"
                title="Enable Price Alerts"
              >
                <Bell size={20} />
              </button>
            </div>

            {/* Premium Search Bar */}
            <div className="relative group z-10">
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative bg-background/80 backdrop-blur-xl border border-primary/20 rounded-2xl shadow-lg shadow-primary/5 p-2 flex items-center gap-2 transition-all duration-300 group-hover:border-primary/40 group-hover:shadow-primary/10">
                <Search className="text-primary ml-3" size={20} />
                <input
                  type="text"
                  placeholder="Search for products (e.g. Rice, Milk)..."
                  className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground h-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between sticky top-[var(--header-height)] z-40 bg-background/80 backdrop-blur-md py-2 -mx-4 px-4 md:mx-0 md:px-0 border-b border-border/50 md:border-none md:static md:bg-transparent md:p-0">
          <div className="w-full md:w-auto min-w-[200px]">
            <SegmentedControl view={view} setView={setView} />
          </div>

          <div className="w-full md:w-auto flex items-center gap-2">
            <div className="relative flex-1 md:w-48">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground z-10" size={16} />
              <select
                className="w-full pl-9 pr-4 py-2.5 bg-secondary/50 border border-border rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer hover:bg-secondary transition-colors"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              >
                <option>Lagos</option>
                <option>Ibadan</option>
                <option>Abuja</option>
                <option>Port Harcourt</option>
              </select>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="min-h-[400px]">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="h-40 animate-pulse bg-muted/50 border-none" />
              ))}
            </div>
          ) : (
            <>
              {view === "list" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  {prices.map((price) => (
                    <PriceCard key={price.id} entry={price} />
                  ))}
                  {prices.length === 0 && (
                    <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
                      <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
                        <Search className="text-muted-foreground" size={32} />
                      </div>
                      <h3 className="font-semibold text-lg">No prices found</h3>
                      <p className="text-muted-foreground">Try adjusting your search or location.</p>
                    </div>
                  )}
                </div>
              )}

              {view === "chart" && (
                <Card className="p-6 h-[500px] border-none shadow-lg bg-gradient-to-b from-card to-background">
                  {prices.length > 0 ? (
                    <div className="h-full w-full animate-in fade-in zoom-in duration-500">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="font-semibold text-lg">Price Distribution</h3>
                        <span className="text-xs font-medium px-2 py-1 rounded-md bg-secondary text-secondary-foreground">
                          {prices.length} items
                        </span>
                      </div>
                      <ResponsiveContainer width="100%" height="85%">
                        <BarChart data={prices} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                          <defs>
                            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#34d399" stopOpacity={0.9} /> {/* Emerald 400 */}
                              <stop offset="100%" stopColor="#10b981" stopOpacity={0.4} /> {/* Emerald 500 */}
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
                          <XAxis
                            dataKey="vendor"
                            tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                            interval={0}
                            angle={-45}
                            textAnchor="end"
                            height={80}
                            tickLine={false}
                            axisLine={false}
                          />
                          <YAxis 
                            tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                            tickFormatter={(value) => `₦${value}`}
                            tickLine={false}
                            axisLine={false}
                          />
                          <Tooltip
                            cursor={{ fill: "hsl(var(--muted))", opacity: 0.2 }}
                            contentStyle={{ 
                              borderRadius: '16px', 
                              border: '1px solid hsl(var(--border))', 
                              boxShadow: '0 10px 30px -10px rgba(0,0,0,0.2)',
                              backgroundColor: 'hsl(var(--card))',
                              color: 'hsl(var(--foreground))',
                              padding: '12px'
                            }}
                            formatter={(value: number) => [`₦${value.toLocaleString()}`, 'Price']}
                          />
                          <Bar 
                            dataKey="price" 
                            fill="url(#barGradient)" 
                            radius={[8, 8, 0, 0]}
                            barSize={40}
                            animationDuration={1500}
                          >
                            {prices.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={index % 2 === 0 ? "url(#barGradient)" : "#6ee7b7"} opacity={index % 2 === 0 ? 1 : 0.8} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center p-6">
                      <BarChart3 size={48} className="text-muted-foreground/30 mb-4" />
                      <h3 className="font-semibold text-lg text-foreground mb-2">No Data to Display</h3>
                      <p className="text-muted-foreground max-w-xs">
                        Search for a product above to see a price comparison chart.
                      </p>
                    </div>
                  )}
                </Card>
              )}

              {view === "map" && (
                <Card className="h-[500px] flex items-center justify-center border-dashed bg-muted/30">
                  <div className="text-center animate-in fade-in zoom-in duration-500">
                    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                      <Map size={40} className="text-primary" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Map View</h3>
                    <p className="text-muted-foreground max-w-sm mx-auto">
                      Visualizing prices on a map is coming soon. Stay tuned for updates!
                    </p>
                  </div>
                </Card>
              )}
            </>
          )}
        </div>
      </div>
    </AppShell>
  );
}
