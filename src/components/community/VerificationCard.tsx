"use client";

import { Check, Edit, User, X, MapPin, Clock, ThumbsUp, MessageCircle, Share2 } from "lucide-react";
import type { PriceEntry } from "@/src/lib/types";
import { Button } from "@/src/components/common/Button";
import { useState } from "react";
import { Card } from "@/src/components/common/Card";
import { Input } from "@/src/components/common/Input";
import { cn } from "@/src/lib/utils";
import { toast } from "sonner";

interface VerificationCardProps {
  entry: PriceEntry;
  onVerify?: (accurate: boolean, reportedPrice?: number) => void;
}

export function VerificationCard({ entry, onVerify }: VerificationCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reportedPrice, setReportedPrice] = useState("");
  const [hasInteracted, setHasInteracted] = useState(false);

  const handleAgree = () => {
    onVerify?.(true);
    setHasInteracted(true);
  };

  const handleSubmitDifferentPrice = () => {
    if (reportedPrice) {
      onVerify?.(false, Number.parseFloat(reportedPrice));
      setReportedPrice("");
      setIsModalOpen(false);
      setHasInteracted(true);
    }
  };

  const timeAgo = (date: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + "y";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + "mo";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + "d";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "h";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + "m";
    return Math.floor(seconds) + "s";
  };

  return (
    <>
      <Card className="overflow-hidden border-none shadow-sm hover:shadow-md transition-shadow duration-300">
        {/* Header */}
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/10">
              <User size={20} className="text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="font-semibold text-sm text-foreground">{entry.user.name}</p>
                <span className="text-xs text-muted-foreground">• {timeAgo(entry.createdAt)}</span>
              </div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <MapPin size={10} /> 
                <span className="font-medium text-foreground/80">{entry.vendor}</span>
                <span className="text-muted-foreground/60">•</span>
                {entry.location.place}
              </p>
            </div>
          </div>
        </div>

        {/* Content - "Image" Placeholder Area */}
        <div className="bg-secondary/30 p-8 flex flex-col items-center justify-center text-center gap-2 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <h3 className="font-display font-bold text-2xl text-foreground relative z-10">
            {entry.productName}
          </h3>
          <div className="flex items-baseline gap-1 relative z-10">
            <span className="text-sm text-muted-foreground font-medium">found at</span>
            <span className="text-3xl font-bold text-primary tracking-tight">
              ₦{entry.price.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <button 
                onClick={handleAgree}
                disabled={hasInteracted}
                className={cn(
                  "flex items-center gap-2 text-sm font-medium transition-colors",
                  hasInteracted ? "text-primary" : "text-foreground hover:text-primary"
                )}
              >
                <ThumbsUp size={22} className={cn(hasInteracted && "fill-current")} />
                <span>Verify</span>
              </button>
              <button 
                onClick={() => setIsModalOpen(true)}
                disabled={hasInteracted}
                className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
              >
                <MessageCircle size={22} />
                <span>Correct</span>
              </button>
              <button 
                onClick={async () => {
                  const shareData = {
                    title: `Price Alert: ${entry.productName}`,
                    text: `Check out this price for ${entry.productName} at ${entry.vendor}: ₦${entry.price.toLocaleString()}`,
                    url: window.location.href,
                  };

                  try {
                    if (navigator.share) {
                      await navigator.share(shareData);
                    } else {
                      await navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}\n${shareData.url}`);
                      toast.success("Copied to clipboard!");
                    }
                  } catch (err) {
                    console.error("Error sharing:", err);
                  }
                }}
                className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
              >
                <Share2 size={22} />
              </button>
            </div>
          </div>

          {/* Likes/Verifications Count */}
          <div className="text-sm font-semibold text-foreground mb-2">
            {entry.verificationCount || 0} verifications
          </div>

          {/* Caption */}
          <div className="text-sm text-foreground">
            <span className="font-semibold mr-2">{entry.user.name}</span>
            Found this deal at <span className="font-medium">{entry.vendor}</span> in {entry.location.place}. Can anyone confirm?
          </div>
        </div>
      </Card>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-background rounded-2xl shadow-2xl p-6 w-full max-w-sm space-y-6 animate-in zoom-in-95 duration-200 border border-border"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center">
              <h5 className="font-display text-lg font-bold text-foreground">
                Report Different Price
              </h5>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-secondary rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Help the community by providing the correct price for <span className="font-semibold text-foreground">{entry.productName}</span>.
              </p>

              <Input
                id="priceInput"
                label="Correct Price (₦)"
                type="number"
                value={reportedPrice}
                onChange={(e) => setReportedPrice(e.target.value)}
                placeholder="0.00"
                autoFocus
              />

              <Button
                onClick={handleSubmitDifferentPrice}
                variant="primary"
                fullWidth
                disabled={!reportedPrice}
              >
                Submit Correction
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}