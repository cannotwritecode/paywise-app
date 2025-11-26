"use client";

import React, { useState, useEffect } from 'react';
import { AppShell } from '@/src/components/layout/AppShell';
import { Button } from '@/src/components/common/Button';
import { Card } from '@/src/components/common/Card';
import { Input } from '@/src/components/common/Input';
import { Modal } from '@/src/components/common/Modal';
import { apiClient } from '@/src/lib/api';
import { 
  Key, 
  Plus, 
  Trash2, 
  Copy, 
  Check, 
  AlertTriangle,
  BarChart3
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { toast } from 'sonner';

interface ApiKey {
  id: string;
  name: string;
  prefix: string;
  createdAt: string;
  lastUsed?: string;
}

interface UsageData {
  date: string;
  calls: number;
}

export default function DeveloperDashboard() {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Mock usage data - in a real app, fetch this from an analytics endpoint
  const usageData: UsageData[] = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      calls: Math.floor(Math.random() * 100) + 20,
    };
  });

  useEffect(() => {
    fetchKeys();
  }, []);

  const fetchKeys = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get('/api-keys');
      setKeys(response.data.keys);
    } catch (error) {
      console.error('Failed to fetch API keys:', error);
      // Fallback for demo/dev if endpoint doesn't exist yet
      setKeys([
        {
          id: '1',
          name: 'My Production App',
          prefix: 'pk_live_...',
          createdAt: new Date().toISOString(),
          lastUsed: new Date().toISOString(),
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateKey = async () => {
    if (!newKeyName.trim()) return;

    try {
      setIsGenerating(true);
      const response = await apiClient.post('/api-keys', { name: newKeyName });
      setGeneratedKey(response.data.apiKey);
      await fetchKeys();
      toast.success('API Key generated successfully');
    } catch (error) {
      console.error('Failed to generate key:', error);
      toast.error('Failed to generate API key');
      // Demo fallback
      setGeneratedKey(`pk_live_${Math.random().toString(36).substring(2, 15)}`);
      setKeys(prev => [...prev, {
        id: Math.random().toString(),
        name: newKeyName,
        prefix: 'pk_live_...',
        createdAt: new Date().toISOString(),
      }]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRevokeKey = async (id: string) => {
    if (!confirm('Are you sure you want to revoke this API key? This action cannot be undone.')) return;

    try {
      await apiClient.delete(`/api-keys/${id}`);
      setKeys(keys.filter(k => k.id !== id));
      toast.success('API Key revoked');
    } catch (error) {
      console.error('Failed to revoke key:', error);
      toast.error('Failed to revoke API key');
      // Demo fallback
      setKeys(keys.filter(k => k.id !== id));
    }
  };

  const copyToClipboard = async () => {
    if (generatedKey) {
      await navigator.clipboard.writeText(generatedKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success('Copied to clipboard');
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setGeneratedKey(null);
    setNewKeyName('');
  };

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto space-y-8 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Developer Dashboard</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your API keys and monitor usage</p>
          </div>
          <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Generate New Key
          </Button>
        </div>

        {/* Usage Stats */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="w-5 h-5 text-primary-600" />
            <h2 className="text-lg font-semibold">API Usage (Last 30 Days)</h2>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={usageData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }} 
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 12 }} 
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                    borderRadius: '8px',
                    border: 'none',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Bar 
                  dataKey="calls" 
                  fill="#00875A" 
                  radius={[4, 4, 0, 0]} 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* API Keys List */}
        <Card className="overflow-hidden">
          <div className="p-6 border-b border-gray-100 dark:border-gray-800">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Key className="w-5 h-5 text-primary-600" />
              Active API Keys
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400">
                <tr>
                  <th className="px-6 py-4 font-medium">Name</th>
                  <th className="px-6 py-4 font-medium">Key Prefix</th>
                  <th className="px-6 py-4 font-medium">Created</th>
                  <th className="px-6 py-4 font-medium">Last Used</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {keys.map((key) => (
                  <tr key={key.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{key.name}</td>
                    <td className="px-6 py-4 font-mono text-gray-500">{key.prefix}</td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(key.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {key.lastUsed ? new Date(key.lastUsed).toLocaleDateString() : 'Never'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handleRevokeKey(key.id)}
                        className="text-red-600 hover:text-red-700 font-medium text-xs px-3 py-1.5 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        Revoke
                      </button>
                    </td>
                  </tr>
                ))}
                {keys.length === 0 && !isLoading && (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                      No API keys found. Generate one to get started.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title={generatedKey ? "Save Your API Key" : "Generate New API Key"}
          footer={
            !generatedKey && (
              <Button 
                onClick={handleGenerateKey} 
                disabled={isGenerating || !newKeyName.trim()}
                className="w-full"
              >
                {isGenerating ? 'Generating...' : 'Create Secret Key'}
              </Button>
            )
          }
        >
          {generatedKey ? (
            <div className="space-y-4">
              <div className="bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-200 p-4 rounded-lg flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                <p className="text-sm">
                  Please copy this key and save it somewhere safe. For security reasons, 
                  <strong> we cannot show it to you again.</strong>
                </p>
              </div>
              
              <div className="relative">
                <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg font-mono text-sm break-all pr-12 border border-gray-200 dark:border-gray-700">
                  {generatedKey}
                </div>
                <button
                  onClick={copyToClipboard}
                  className="absolute right-2 top-2 p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-md transition-colors"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4 text-gray-500" />
                  )}
                </button>
              </div>

              <Button onClick={handleCloseModal} variant="secondary" className="w-full">
                I've Saved It
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Give your key a name to identify it later (e.g., "Production App", "Testing").
              </p>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Key Name
                </label>
                <Input
                  id="keyName"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  placeholder="e.g. My Awesome App"
                  autoFocus
                />
              </div>
            </div>
          )}
        </Modal>
      </div>
    </AppShell>
  );
}
