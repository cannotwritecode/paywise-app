"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    console.log("AdminGuard Check:", { 
      session: session?.user, 
      role: session?.user?.role,
      status 
    });

    if (!session) {
      router.push("/auth/signin");
    } else if (session.user.role !== "admin") {
      console.warn("Access denied: User is not admin", session.user.role);
      router.push("/");
    }
  }, [session, status, router]);

  if (status === "loading") {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!session || session.user.role !== "admin") {
    return null;
  }

  return <>{children}</>;
}
