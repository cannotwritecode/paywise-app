"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, User as UserIcon, AlertCircle, CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/src/components/common/Button";
import { Input } from "@/src/components/common/Input";
import { toast } from "sonner";

export default function SignUpPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);

    try {
      // Mock sign-up - In production, call your API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("Account created successfully!");
      router.push("/auth/signin");
    } catch (err) {
      setError("Failed to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-12 lg:px-20 xl:px-24 bg-background z-10">
        <div className="w-full max-w-sm mx-auto space-y-8 animate-in fade-in slide-in-from-left-8 duration-700">
          {/* Header */}
          <div className="space-y-2">
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center mb-6 shadow-lg shadow-primary/25">
              <span className="font-display font-bold text-2xl text-primary-foreground">P</span>
            </div>
            <h1 className="text-3xl font-bold font-display tracking-tight text-foreground">
              Create an account
            </h1>
            <p className="text-muted-foreground">
              Join thousands of smart shoppers saving money daily
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 flex items-center gap-3 text-sm text-destructive animate-in fade-in zoom-in-95">
                <AlertCircle size={16} />
                <p>{error}</p>
              </div>
            )}

            <Input
              id="name"
              type="text"
              label="Full Name"
              placeholder="John Doe"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              icon={<UserIcon size={18} />}
              required
            />

            <Input
              id="email"
              type="email"
              label="Email Address"
              placeholder="name@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              icon={<Mail size={18} />}
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                id="password"
                type="password"
                label="Password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                icon={<Lock size={18} />}
                required
              />
              <Input
                id="confirmPassword"
                type="password"
                label="Confirm"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                icon={<CheckCircle size={18} />}
                required
              />
            </div>

            <Button
              type="submit"
              fullWidth
              size="lg"
              disabled={loading}
              className="group mt-2"
            >
              {loading ? (
                "Creating Account..."
              ) : (
                <>
                  Create Account
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </Button>
          </form>

          <div className="text-center text-sm">
            <span className="text-muted-foreground">Already have an account? </span>
            <Link 
              href="/auth/signin" 
              className="font-semibold text-primary hover:text-primary/80 transition-colors underline-offset-4 hover:underline"
            >
              Sign in
            </Link>
          </div>
          
          <p className="text-xs text-center text-muted-foreground px-4">
            By clicking continue, you agree to our{" "}
            <Link href="/terms" className="underline underline-offset-4 hover:text-primary">Terms of Service</Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline underline-offset-4 hover:text-primary">Privacy Policy</Link>.
          </p>
        </div>
      </div>

      {/* Right Side - Visual */}
      <div className="hidden lg:flex flex-1 relative bg-muted text-white overflow-hidden">
        <div className="absolute inset-0 bg-zinc-900" />
        <div className="absolute inset-0 bg-gradient-to-bl from-primary/40 to-black/80 mix-blend-multiply" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=2069&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-overlay" />
        
        <div className="relative z-20 flex flex-col justify-between p-12 h-full">
          <div className="flex justify-end">
             <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur border border-white/10">
               <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
               <span className="text-sm font-medium">Over 50,000 prices tracked</span>
             </div>
          </div>
          
          <div className="space-y-6 max-w-md">
            <h2 className="text-4xl font-bold font-display leading-tight">
              Stop overpaying for your daily essentials.
            </h2>
            <p className="text-lg text-white/80">
              Join the fastest growing community of price-conscious shoppers in Nigeria. Track, compare, and save together.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
