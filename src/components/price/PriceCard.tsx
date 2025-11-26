"use client";

import Link from "next/link";
import { Card } from "@/src/components/common/Card";
import type { PriceEntry } from "@/src/lib/types";
import { cn } from "@/src/lib/utils";
import {
  User,
  MapPin,
  Store,
  Check,
  AlertTriangle,
  HelpCircle,
} from "lucide-react";

// ======================================================================
// VerificationBadge Component (Local)
// ======================================================================
const VerificationBadge = ({ count }: { count: number }) => {
  let text = "New";
  let icon = <HelpCircle size={12} />;
  let className = "badge-neutral"; // From global.css

  if (count > 2) {
    text = "Verified";
    icon = <Check size={12} />;
    className = "badge-success"; // From global.css
  } else if (count > 0) {
    text = "Pending";
    icon = <AlertTriangle size={12} />;
    className = "badge-warning"; // From global.css
  }

  return (
    <span className={cn("badge", className)}>
      {icon}
      <span>{text}</span>
    </span>
  );
};

// ======================================================================
// PriceCard Component
// ======================================================================
interface PriceCardProps {
  entry: PriceEntry;
}

export function PriceCard({ entry }: PriceCardProps) {
  return (
    <Link href={`/price/${entry.id}`} className="group block">
      <Card
        hoverable // This applies our .card-hover class
        className="p-6 space-y-4 h-full flex flex-col"
      >
        {/* Header: Product Name + Verification Badge */}
        <div className="flex justify-between items-start gap-4">
          <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
            {entry.productName}
          </h3>
          <VerificationBadge count={entry.verificationCount} />
        </div>

        {/* Price: The main data point */}
        <div>
          <p className="text-3xl font-bold text-foreground">
            ₦{entry.price.toLocaleString()}
          </p>
        </div>

        {/* Metadata: All secondary info, clearly icon'd */}
        <div className="flex-1" />
        <div className="space-y-3 pt-4 border-t border-border">
          <div className="flex items-center gap-2 text-secondary text-sm">
            <Store size={14} />
            <span className="text-foreground font-medium">{entry.vendor}</span>
          </div>
          <div className="flex items-center gap-2 text-secondary text-sm">
            <MapPin size={14} />
            <span>{entry.location.place}</span>
          </div>
          <div className="flex items-center gap-2 text-secondary text-sm">
            <User size={14} />
            <span>
              By {entry.user.name}{" "}
              <span className="text-tertiary">
                ({entry.user.reputation} rep)
              </span>
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
