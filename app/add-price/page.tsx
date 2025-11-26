"use client";

import { useState, Suspense } from "react";
import { AppShell } from "@/src/components/layout/AppShell";
import { Button } from "@/src/components/common/Button";
import { Input } from "@/src/components/common/Input";
import { Select } from "@/src/components/common/Select";
import { Card } from "@/src/components/common/Card";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Plus, MapPin, Tag, DollarSign, Store, ChevronRight } from "lucide-react";
import { apiClient } from "@/src/lib/api";

function AddPriceContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isScanned = searchParams.get("scanned") === "true";

  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    product: isScanned ? "Parboiled Rice (5kg)" : "",
    price: isScanned ? "8500" : "",
    vendor: isScanned ? "Mama Nkechi Store" : "",
    location: "Lagos",
    category: "Food",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await apiClient.post("/prices", {
        productName: formData.product,
        price: parseFloat(formData.price),
        vendor: formData.vendor,
        location: {
          place: formData.location,
          lat: 6.5244,
          lng: 3.3792
        },
        category: formData.category
      });

      toast.success("Price added successfully! +10 points");
      router.push("/community");
    } catch (error: any) {
      console.error("Failed to add price", error);
      const errorMsg = error.response?.data?.error || "Failed to add price";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  return (
    <div className="max-w-xl mx-auto px-4 py-8 pb-24">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => step === 1 ? router.back() : prevStep()}
          className="p-2 rounded-full hover:bg-secondary/50 transition-colors"
        >
          <ArrowLeft size={20} className="text-foreground" />
        </button>
        <div>
          <h1 className="font-display font-bold text-2xl text-foreground">
            Add Price
          </h1>
          <p className="text-sm text-muted-foreground">
            Step {step} of 2
          </p>
        </div>
      </div>

      <Card className="p-6 md:p-8 border-none shadow-lg bg-card/50 backdrop-blur-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          {step === 1 && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <div className="space-y-4">
                <h2 className="font-semibold text-lg">Product Details</h2>
                
                <div>
                  <label htmlFor="product-name" className="label-field">Product Name</label>
                  <Input
                    id="product-name"
                    placeholder="e.g. Golden Penny Semovita"
                    value={formData.product}
                    onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                    icon={<Tag size={18} />}
                    autoFocus
                  />
                </div>

                <div>
                  <label htmlFor="category" className="label-field">Category</label>
                  <Select
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="Food">Food & Groceries</option>
                    <option value="Transport">Transport</option>
                    <option value="Services">Services</option>
                    <option value="Utilities">Utilities</option>
                  </Select>
                </div>

                <div>
                  <label htmlFor="price" className="label-field">Price (₦)</label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="0.00"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    icon={<DollarSign size={18} />}
                  />
                </div>
              </div>

              <Button
                type="button"
                variant="primary"
                fullWidth
                size="lg"
                onClick={nextStep}
                disabled={!formData.product || !formData.price}
              >
                Next Step <ChevronRight size={18} className="ml-2" />
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <div className="space-y-4">
                <h2 className="font-semibold text-lg">Location & Vendor</h2>

                <div>
                  <label htmlFor="vendor" className="label-field">Vendor / Shop Name</label>
                  <Input
                    id="vendor"
                    placeholder="e.g. Shoprite or Local Market"
                    value={formData.vendor}
                    onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
                    icon={<Store size={18} />}
                    autoFocus
                  />
                </div>

                <div>
                  <label htmlFor="location" className="label-field">Location</label>
                  <Select
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  >
                    <option value="Lagos">Lagos</option>
                    <option value="Abuja">Abuja</option>
                    <option value="Ibadan">Ibadan</option>
                    <option value="Port Harcourt">Port Harcourt</option>
                  </Select>
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                fullWidth
                size="lg"
                disabled={loading || !formData.vendor}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Submitting...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Plus size={20} /> Submit Price
                  </span>
                )}
              </Button>
            </div>
          )}
        </form>
      </Card>
    </div>
  );
}

export default function AddPricePage() {
  return (
    <AppShell>
      <Suspense fallback={<div className="flex items-center justify-center min-h-[50vh]"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>}>
        <AddPriceContent />
      </Suspense>
    </AppShell>
  );
}
