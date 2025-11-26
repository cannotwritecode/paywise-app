"use client";

import { useState, useRef } from "react";
import { Camera, Upload, X, ScanLine, ArrowLeft, Image as ImageIcon } from "lucide-react";
import { AppShell } from "@/src/components/layout/AppShell";
import { Button } from "@/src/components/common/Button";
import { Card } from "@/src/components/common/Card";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import axios from "axios"; // Use axios directly for internal API routes

export default function ScanReceiptPage() {
  const [image, setImage] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleScan = async () => {
    if (!image) return;

    setScanning(true);
    try {
      // Single step: Process Receipt (Upload + OCR)
      console.log("Sending image to /api/receipts/process (Next.js API)...");
      
      // Use axios directly to hit the Next.js API route instead of the external backend
      // This ensures we hit the Gemini logic implemented in app/api/receipts/process/route.ts
      const token = localStorage.getItem("api_token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const { data: responseData } = await axios.post("/api/receipts/process", {
        image: image 
      }, { headers });

      console.log("Process response:", responseData);
      
      // The response structure is { receiptId: string, data: { ... } }
      // We don't need to destructure 'data' again from responseData if responseData IS the object we want
      const { receiptId, data } = responseData; 

      if (!receiptId) {
        throw new Error("Invalid response format: missing receiptId");
      }

      toast.success("Receipt scanned successfully!");
      
      // Redirect to verification page for batch processing
      router.push(`/verify-receipt/${receiptId}`);

    } catch (error: any) {
      console.error("Scan failed", error);
      
      // Handle Rate Limiting (429)
      if (error.response?.status === 429) {
        toast.error("System busy, please try again in a moment.");
      } else {
        const errorMsg = error.response?.data?.error || "Failed to process receipt. Please try again.";
        toast.error(errorMsg);
      }
    } finally {
      setScanning(false);
    }
  };

  return (
    <AppShell>
      <div className="max-w-md mx-auto px-4 py-8 h-[calc(100dvh-var(--header-height)-var(--bottom-nav-height))] flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-full hover:bg-secondary/50 transition-colors"
          >
            <ArrowLeft size={20} className="text-foreground" />
          </button>
          <h1 className="font-display font-bold text-2xl text-foreground">
            Scan Receipt
          </h1>
        </div>

        <div className="flex-1 flex flex-col gap-6">
          {/* Camera/Upload Area */}
          <div className="flex-1 relative rounded-3xl overflow-hidden bg-black shadow-2xl border border-white/10 group">
            {image ? (
              <>
                <img
                  src={image}
                  alt="Receipt preview"
                  className="absolute inset-0 w-full h-full object-contain bg-black"
                />
                <button
                  onClick={() => setImage(null)}
                  className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors backdrop-blur-sm z-20"
                >
                  <X size={20} />
                </button>
              </>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mb-6 backdrop-blur-md animate-pulse">
                  <Camera size={40} className="text-white" />
                </div>
                <h3 className="font-semibold text-xl text-white mb-2">Capture Receipt</h3>
                <p className="text-white/60 max-w-xs">
                  Position your receipt within the frame to automatically extract prices.
                </p>
              </div>
            )}
            
            {/* Scanning Overlay */}
            {scanning && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-30 backdrop-blur-sm">
                <div className="flex flex-col items-center text-white">
                  <div className="relative">
                    <ScanLine size={64} className="text-primary animate-pulse" />
                    <div className="absolute inset-0 bg-primary/20 blur-xl animate-pulse" />
                  </div>
                  <p className="font-medium mt-4 text-lg">Analyzing receipt...</p>
                </div>
              </div>
            )}

            {/* Grid Overlay (only when no image) */}
            {!image && (
              <div className="absolute inset-0 pointer-events-none opacity-20">
                <div className="w-full h-full border-2 border-white/30 rounded-3xl m-4 box-border relative">
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white rounded-tl-xl" />
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white rounded-tr-xl" />
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white rounded-bl-xl" />
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white rounded-br-xl" />
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="mt-auto space-y-4">
            {!image ? (
              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant="secondary"
                  size="lg"
                  className="h-14 rounded-2xl"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <ImageIcon size={20} className="mr-2" /> Gallery
                </Button>
                <Button
                  variant="primary"
                  size="lg"
                  className="h-14 rounded-2xl"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Camera size={20} className="mr-2" /> Camera
                </Button>
              </div>
            ) : (
              <Button
                variant="primary"
                fullWidth
                size="lg"
                className="h-14 rounded-2xl shadow-lg shadow-primary/25"
                disabled={scanning}
                onClick={handleScan}
              >
                {scanning ? "Processing..." : "Process Receipt"}
              </Button>
            )}
            
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              capture="environment"
              onChange={handleFileChange}
            />
          </div>
        </div>
      </div>
    </AppShell>
  );
}
