
"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { Skeleton } from "../ui/skeleton";

const publicPaths = ['/login'];

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading) {
      const pathIsProtected = !publicPaths.includes(pathname);
      
      if (pathIsProtected && !user) {
        router.replace('/login');
      } else if (!pathIsProtected && user) {
        router.replace('/');
      }
    }
  }, [user, loading, router, pathname]);

  if (loading || (!user && !publicPaths.includes(pathname))) {
     return (
        <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
            <p className="text-lg text-muted-foreground">Loading Your Financial Dashboard...</p>
            <div className="w-full max-w-md p-6 space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
            </div>
        </div>
    );
  }

  return <>{children}</>;
}
