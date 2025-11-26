"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, AlertCircle, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/src/components/common/Button";
import { Input } from "@/src/components/common/Input";

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
      } else if (result?.ok) {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err) {
      setError("An unexpected error occurred");
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
              Welcome back
            </h1>
            <p className="text-muted-foreground">
              Enter your credentials to access your account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 flex items-center gap-3 text-sm text-destructive animate-in fade-in zoom-in-95">
                <AlertCircle size={16} />
                <p>{error}</p>
              </div>
            )}

            <div className="space-y-4">
              <Input
                id="email"
                type="email"
                label="Email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={<Mail size={18} />}
                required
              />
              
              <div className="space-y-1">
                <Input
                  id="password"
                  type="password"
                  label="Password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  icon={<Lock size={18} />}
                  required
                />
                <div className="flex justify-end">
                  <Link 
                    href="/auth/forgot-password" 
                    className="text-xs font-medium text-primary hover:text-primary/80 transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              fullWidth
              size="lg"
              disabled={loading}
              className="group"
            >
              {loading ? (
                "Signing in..."
              ) : (
                <>
                  Sign In 
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <div className="text-center text-sm">
            <span className="text-muted-foreground">Don't have an account? </span>
            <Link 
              href="/auth/signup" 
              className="font-semibold text-primary hover:text-primary/80 transition-colors underline-offset-4 hover:underline"
            >
              Sign up
            </Link>
          </div>
          
          {/* Demo Credentials Hint */}
          <div className="p-4 rounded-xl bg-secondary/50 border border-border text-xs text-muted-foreground">
            <p className="font-semibold mb-1 text-foreground">Demo Account:</p>
            <p>Email: demo@paywise.com</p>
            <p>Password: password123</p>
          </div>
        </div>
      </div>

      {/* Right Side - Visual */}
      <div className="hidden lg:flex flex-1 relative bg-muted text-white overflow-hidden">
        <div className="absolute inset-0 bg-zinc-900" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/40 to-black/80 mix-blend-multiply" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-overlay" />
        
        <div className="relative z-20 flex flex-col justify-between p-12 h-full">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur flex items-center justify-center">
              <span className="font-bold">P</span>
            </div>
            <span className="font-bold text-lg tracking-tight">Paywise Inc.</span>
          </div>
          
          <div className="space-y-6 max-w-md">
            <blockquote className="text-2xl font-medium leading-relaxed">
              "Paywise has completely transformed how I shop. I save at least 20% on my weekly groceries just by checking the community prices."
            </blockquote>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur" />
              <div>
                <div className="font-semibold">Sarah Johnson</div>
                <div className="text-white/60 text-sm">Verified User, Lagos</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
