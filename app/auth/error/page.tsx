"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/src/components/common/Button";
import { Card } from "@/src/components/common/Card";

const errorMessages: Record<string, string> = {
  Configuration: "There is a problem with the server configuration.",
  AccessDenied: "You do not have permission to sign in.",
  Verification: "The verification token has expired or has already been used.",
  Default: "An error occurred during authentication.",
};

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error") || "Default";

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-danger-100 dark:bg-danger-900/20 mb-4">
            <AlertTriangle size={32} className="text-danger-600" />
          </div>
          <h1 className="font-display font-bold text-3xl text-foreground mb-2">
            Authentication Error
          </h1>
          <p className="text-secondary">Something went wrong</p>
        </div>

        <Card className="p-8 text-center">
          <p className="text-foreground mb-6">
            {errorMessages[error] || errorMessages.Default}
          </p>

          <Link href="/auth/signin">
            <Button variant="primary" fullWidth size="lg">
              Back to Sign In
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}
