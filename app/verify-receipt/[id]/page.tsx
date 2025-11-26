
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { AppShell } from "@/src/components/layout/AppShell";
import { Button } from "@/src/components/common/Button";
import { Card } from "@/src/components/common/Card";
import { Input } from "@/src/components/common/Input";
import { toast } from "sonner";
import { apiClient } from "@/src/lib/api";
import axios from "axios";
import { ArrowLeft, Store, Check, Trash2, Plus } from "lucide-react";

interface ReceiptItem {
  productName: string;
  price: number;
}

export default function VerifyReceiptPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [vendor, setVendor] = useState("");
  const [items, setItems] = useState<ReceiptItem[]>([]);

  useEffect(() => {
    const fetchReceipt = async () => {
      try {
        // Use apiClient to ensure auth token is sent (if needed) and consistent API usage
        // Use apiClient to ensure auth token is sent (if needed) and consistent API usage
        const { data } = await apiClient.get(`/receipts/${params.id}`);
        console.log("Receipt API Response:", data);
        
        // Handle potential response structures (direct object or wrapped in 'data')
        const receipt = data.data || data;
        const ocrData = receipt.ocrData || receipt.ocr_data;

        if (ocrData) {
          setItems(ocrData.items || []);
          // If Gemini guessed a vendor, pre-fill it, otherwise leave empty
          if (ocrData.vendor && ocrData.vendor !== "Unknown Vendor") {
            setVendor(ocrData.vendor);
          }
        }
      } catch (error) {
        console.error("Failed to fetch receipt", error);
        toast.error("Failed to load receipt data");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchReceipt();
    }
  }, [params.id]);

  const handleItemChange = (index: number, field: keyof ReceiptItem, value: string | number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const handleDeleteItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  const handleAddItem = () => {
    setItems([...items, { productName: "", price: 0 }]);
  };

  const handleConfirm = async () => {
    if (!vendor.trim()) {
      toast.error("Please enter a vendor name");
      return;
    }

    if (items.length === 0) {
      toast.error("At least one item is required");
      return;
    }

    setSubmitting(true);
    try {
      // Use axios to call the Next.js API route (which adds location and handles batching)
      const token = localStorage.getItem("api_token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      await axios.post(`/api/receipts/${params.id}/confirm`, {
        vendor,
        items
      }, { headers });
      
      toast.success(`Successfully verified ${items.length} items!`);
      router.push("/rewards"); // Or home/community
    } catch (error) {
      console.error("Failed to confirm receipt", error);
      toast.error("Failed to submit receipt");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <AppShell>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="max-w-xl mx-auto px-4 py-8 pb-24 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-full hover:bg-secondary/50 transition-colors"
          >
            <ArrowLeft size={20} className="text-foreground" />
          </button>
          <div>
            <h1 className="font-display font-bold text-2xl text-foreground">
              Verify Receipt
            </h1>
            <p className="text-sm text-muted-foreground">
              Confirm items and vendor details
            </p>
          </div>
        </div>

        {/* Vendor Input */}
        <Card className="p-6 space-y-4 border-primary/20 bg-primary/5">
          <div className="flex items-center gap-2 text-primary font-semibold">
            <Store size={20} />
            <h2>Vendor Details</h2>
          </div>
          <Input
            id="vendor-name"
            label="Store / Vendor Name"
            placeholder="e.g. Shoprite, Spar, Local Market"
            value={vendor}
            onChange={(e) => setVendor(e.target.value)}
            className="bg-background"
          />
        </Card>

        {/* Items List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="font-semibold text-lg">Extracted Items ({items.length})</h3>
            <button 
              onClick={handleAddItem}
              className="text-sm text-primary font-medium flex items-center gap-1 hover:underline"
            >
              <Plus size={16} /> Add Item
            </button>
          </div>

          <div className="space-y-3">
            {items.map((item, index) => (
              <Card key={index} className="p-4 flex gap-3 items-start group">
                <div className="flex-1 space-y-3">
                  <Input
                    id={`product-${index}`}
                    placeholder="Product Name"
                    value={item.productName}
                    onChange={(e) => handleItemChange(index, "productName", e.target.value)}
                    className="h-9 text-sm"
                  />
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">₦</span>
                    <Input
                      id={`price-${index}`}
                      type="number"
                      placeholder="Price"
                      value={item.price}
                      onChange={(e) => handleItemChange(index, "price", parseFloat(e.target.value))}
                      className="h-9 pl-7 text-sm"
                    />
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteItem(index)}
                  className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors mt-1"
                >
                  <Trash2 size={18} />
                </button>
              </Card>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-md border-t border-border z-50 md:static md:bg-transparent md:border-none md:p-0">
          <div className="max-w-xl mx-auto">
            <Button
              variant="primary"
              fullWidth
              size="lg"
              onClick={handleConfirm}
              disabled={submitting}
              className="h-14 rounded-2xl shadow-lg shadow-primary/25"
            >
              {submitting ? "Submitting..." : `Confirm ${items.length} Items`}
            </Button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
