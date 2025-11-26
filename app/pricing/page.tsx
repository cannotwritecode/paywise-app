"use client";

import React from 'react';
import { AppShell } from '@/src/components/layout/AppShell';
import { Button } from '@/src/components/common/Button';
import { Check, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface PricingTier {
  name: string;
  price: string;
  description: string;
  features: string[];
  notIncluded?: string[];
  cta: string;
  popular?: boolean;
  tierId: string;
}

const tiers: PricingTier[] = [
  {
    name: "Free",
    price: "₦0",
    description: "Perfect for hobbyists and testing.",
    features: [
      "1,000 API calls / month",
      "Basic market overview",
      "Community support",
      "1 API Key"
    ],
    notIncluded: [
      "Inflation analytics",
      "Real-time alerts",
      "Priority support",
      "Data export"
    ],
    cta: "Get Started",
    tierId: "free"
  },
  {
    name: "Pro",
    price: "₦15,000",
    description: "For growing businesses and developers.",
    features: [
      "50,000 API calls / month",
      "Advanced market analytics",
      "Inflation trends",
      "Email support",
      "5 API Keys",
      "Data export (CSV)"
    ],
    cta: "Upgrade to Pro",
    popular: true,
    tierId: "pro"
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For large scale applications.",
    features: [
      "Unlimited API calls",
      "Real-time WebSocket feed",
      "Custom reports",
      "Dedicated account manager",
      "SLA guarantee",
      "Unlimited API Keys"
    ],
    cta: "Contact Sales",
    tierId: "enterprise"
  }
];

export default function PricingPage() {
  const router = useRouter();

  const handleUpgrade = (tierId: string) => {
    if (tierId === 'enterprise') {
      window.location.href = 'mailto:sales@paywise.ng';
      return;
    }
    // Future: Integrate payment gateway
    console.log(`Upgrading to ${tierId}`);
    router.push('/developer');
  };

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto px-6 py-12 lg:py-20">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Choose the plan that fits your needs. Start building with PayWise's market intelligence today.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tiers.map((tier) => (
            <div 
              key={tier.name}
              className={`relative flex flex-col p-8 bg-white dark:bg-gray-800 rounded-2xl border ${
                tier.popular 
                  ? 'border-primary-500 shadow-xl scale-105 z-10' 
                  : 'border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow'
              }`}
            >
              {tier.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{tier.name}</h3>
                <div className="mt-4 flex items-baseline text-gray-900 dark:text-white">
                  <span className="text-4xl font-bold tracking-tight">{tier.price}</span>
                  {tier.price !== 'Custom' && <span className="text-gray-500 ml-1">/month</span>}
                </div>
                <p className="mt-4 text-gray-500 dark:text-gray-400">{tier.description}</p>
              </div>

              <div className="flex-1 space-y-4 mb-8">
                {tier.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-500 shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300 text-sm">{feature}</span>
                  </div>
                ))}
                {tier.notIncluded?.map((feature) => (
                  <div key={feature} className="flex items-start gap-3 opacity-50">
                    <X className="w-5 h-5 text-gray-400 shrink-0" />
                    <span className="text-gray-500 dark:text-gray-400 text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              <Button 
                onClick={() => handleUpgrade(tier.tierId)}
                variant={tier.popular ? 'primary' : 'outline'}
                className="w-full"
              >
                {tier.cta}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
