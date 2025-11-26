"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiClient } from "@/src/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/src/components/common/Input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { ArrowLeft, Loader2 } from "lucide-react";

export default function CreateAdPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    sponsor_name: "",
    image_url: "",
    link_url: "",
    category: "general",
    is_global: false,
    lat: "",
    lng: "",
    radius_km: "10",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, is_global: checked }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, category: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        lat: formData.lat ? parseFloat(formData.lat) : null,
        lng: formData.lng ? parseFloat(formData.lng) : null,
        radius_km: parseFloat(formData.radius_km),
      };

      await apiClient.post("/admin/ads", payload);
      toast.success("Ad campaign created successfully");
      router.push("/admin/ads");
    } catch (error) {
      console.error("Failed to create ad:", error);
      toast.error("Failed to create ad campaign");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <Button variant="ghost" asChild className="mb-4 pl-0">
          <Link href="/admin/ads">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Ads
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Create New Campaign</h1>
        <p className="text-muted-foreground">Launch a new ad to reach your audience.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 border p-6 rounded-lg bg-card">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Basic Information</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Campaign Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="e.g. Summer Sale"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sponsor_name">Sponsor Name</Label>
              <Input
                id="sponsor_name"
                name="sponsor_name"
                placeholder="e.g. Paywise"
                value={formData.sponsor_name}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Ad copy..."
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={formData.category} onValueChange={handleSelectChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="retail">Retail</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="food">Food & Dining</SelectItem>
                  <SelectItem value="services">Services</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Creative Assets</h3>
          <div className="space-y-2">
            <Label htmlFor="image_url">Image URL</Label>
            <Input
              id="image_url"
              name="image_url"
              placeholder="https://..."
              value={formData.image_url}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="link_url">Target URL</Label>
            <Input
              id="link_url"
              name="link_url"
              placeholder="https://..."
              value={formData.link_url}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Targeting</h3>
            <div className="flex items-center space-x-2">
              <Switch
                id="is_global"
                checked={formData.is_global}
                onCheckedChange={handleSwitchChange}
              />
              <Label htmlFor="is_global">Global Campaign</Label>
            </div>
          </div>

          {!formData.is_global && (
            <div className="grid grid-cols-3 gap-4 animate-in fade-in slide-in-from-top-2">
              <div className="space-y-2">
                <Label htmlFor="lat">Latitude</Label>
                <Input
                  id="lat"
                  name="lat"
                  type="number"
                  step="any"
                  placeholder="0.0000"
                  value={formData.lat}
                  onChange={handleChange}
                  required={!formData.is_global}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lng">Longitude</Label>
                <Input
                  id="lng"
                  name="lng"
                  type="number"
                  step="any"
                  placeholder="0.0000"
                  value={formData.lng}
                  onChange={handleChange}
                  required={!formData.is_global}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="radius_km">Radius (km)</Label>
                <Input
                  id="radius_km"
                  name="radius_km"
                  type="number"
                  value={formData.radius_km}
                  onChange={handleChange}
                  required={!formData.is_global}
                />
              </div>
            </div>
          )}
        </div>

        <div className="pt-4">
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...
              </>
            ) : (
              "Create Campaign"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
