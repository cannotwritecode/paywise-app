"use client";

import { Trophy, Star } from "lucide-react";
import { Card } from "@/src/components/common/Card";

interface RewardsDisplayProps {
  points: number;
  tier?: string;
  nextMilestone?: number;
}

export function RewardsDisplay({
  points,
  tier = "Silver",
  nextMilestone = 500,
}: RewardsDisplayProps) {
  const progressPercent = (points / nextMilestone) * 100;

  return (
    <Card className="space-y-4 bg-gradient-to-br from-primary/5 to-primary/10">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-neutral-600 font-medium">Your Points</p>
          <h3 className="font-display font-bold text-3xl text-primary">
            {points.toLocaleString()}
          </h3>
        </div>
        <Trophy size={40} className="text-primary/30" />
      </div>

      {/* Tier */}
      <div className="flex items-center gap-2">
        <Star size={16} className="text-warning" />
        <span className="text-sm font-medium">{tier} Member</span>
      </div>

      {/* Progress to next tier */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs">
          <span className="text-neutral-600">Next Milestone</span>
          <span className="font-medium">
            {nextMilestone - points} points away
          </span>
        </div>
        <div className="w-full bg-neutral-200 rounded-full h-2 overflow-hidden">
          <div
            className="bg-primary h-full transition-all duration-300"
            style={{ width: `${Math.min(progressPercent, 100)}%` }}
          />
        </div>
      </div>
    </Card>
  );
}
