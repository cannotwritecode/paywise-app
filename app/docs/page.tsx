"use client";

import React from 'react';
import { AppShell } from '@/src/components/layout/AppShell';
import { Card } from '@/src/components/common/Card';
import { Copy, Check, Terminal, Code2 } from 'lucide-react';
import { useState } from 'react';

const CodeBlock = ({ code, language = 'bash' }: { code: string; language?: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group mt-4 mb-6 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-900">
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
        <span className="text-xs font-mono text-gray-400">{language}</span>
        <button
          onClick={handleCopy}
          className="text-gray-400 hover:text-white transition-colors"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>
      <div className="p-4 overflow-x-auto">
        <pre className="text-sm font-mono text-gray-300">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
};

export default function DocumentationPage() {
  return (
    <AppShell>
      <div className="max-w-4xl mx-auto p-6 space-y-12">
        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">API Documentation</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Integrate PayWise's powerful market intelligence data directly into your applications.
          </p>
        </div>

        {/* Authentication */}
        <section id="authentication" className="space-y-6">
          <div className="flex items-center gap-3 pb-2 border-b border-gray-200 dark:border-gray-700">
            <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
              <KeyIcon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Authentication</h2>
          </div>
          
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            All API requests must be authenticated using your API key. You can generate and manage your keys in the <a href="/developer" className="text-primary-600 hover:underline">Developer Dashboard</a>.
            Include your API key in the <code className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-sm font-mono text-primary-600">x-api-key</code> header of every request.
          </p>

          <CodeBlock 
            language="bash"
            code={`curl -H "x-api-key: pk_live_..." https://api.paywise.ng/v1/analytics/market-overview`}
          />
        </section>

        {/* Endpoints */}
        <section id="endpoints" className="space-y-12">
          <div className="flex items-center gap-3 pb-2 border-b border-gray-200 dark:border-gray-700">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Terminal className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Endpoints</h2>
          </div>

          {/* Market Overview */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full text-xs font-bold font-mono">GET</span>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">/analytics/market-overview</h3>
            </div>
            
            <p className="text-gray-600 dark:text-gray-300">
              Get a high-level overview of market trends, including average prices and volatility across categories.
            </p>

            <Card className="p-6 bg-gray-50 dark:bg-gray-800/50 border-none">
              <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-gray-500">Query Parameters</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="font-mono text-primary-600">category</div>
                <div className="text-gray-500">string (optional)</div>
                <div className="text-gray-600">Filter by product category (e.g., "food", "electronics")</div>
                
                <div className="font-mono text-primary-600">location</div>
                <div className="text-gray-500">string (optional)</div>
                <div className="text-gray-600">Filter by region or city</div>
              </div>
            </Card>

            <CodeBlock 
              language="javascript"
              code={`// Example: Fetch market overview for food in Lagos
const response = await fetch('https://api.paywise.ng/v1/analytics/market-overview?category=food&location=Lagos', {
  headers: {
    'x-api-key': 'YOUR_API_KEY'
  }
});

const data = await response.json();
console.log(data);`}
            />
          </div>

          {/* Inflation Analytics */}
          <div className="space-y-4 pt-8 border-t border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full text-xs font-bold font-mono">GET</span>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">/analytics/inflation</h3>
            </div>
            
            <p className="text-gray-600 dark:text-gray-300">
              Retrieve calculated inflation rates based on community-verified price data over time.
            </p>

            <Card className="p-6 bg-gray-50 dark:bg-gray-800/50 border-none">
              <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-gray-500">Query Parameters</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="font-mono text-primary-600">days</div>
                <div className="text-gray-500">number (default: 30)</div>
                <div className="text-gray-600">Number of days to analyze</div>
                
                <div className="font-mono text-primary-600">location</div>
                <div className="text-gray-500">string (optional)</div>
                <div className="text-gray-600">Specific region for inflation data</div>
              </div>
            </Card>

            <CodeBlock 
              language="bash"
              code={`curl "https://api.paywise.ng/v1/analytics/inflation?days=90&location=Abuja" \\
  -H "x-api-key: pk_live_..."`}
            />
          </div>
        </section>
      </div>
    </AppShell>
  );
}

function KeyIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="7.5" cy="15.5" r="5.5" />
      <path d="m21 2-9.6 9.6" />
      <path d="m15.5 7.5 3 3L22 7l-3-3" />
    </svg>
  )
}
