
"use client";
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { BottomNav } from './BottomNav';
import { Skeleton } from './ui/skeleton';

const publicPaths = ['/login'];

export function AppContent({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const isPublicPath = publicPaths.includes(pathname);

  useEffect(() => {
    // If loading is finished, and there's no user, and we're not on a public path, redirect to login
    if (!loading && !user && !isPublicPath) {
      router.replace('/login');
    }
    // If loading is finished, and there IS a user, and we're on a public path, redirect to home
    if (!loading && user && isPublicPath) {
      router.replace('/');
    }
  }, [user, loading, router, isPublicPath, pathname]);

  // While loading, or if we're waiting for the redirect to happen, show a loading state
  if (loading || (!user && !isPublicPath) || (user && isPublicPath)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
          <div className="w-full max-w-md p-8 space-y-8">
              <div className="flex justify-center">
                  <Skeleton className="h-20 w-20 rounded-full" />
              </div>
              <div className="space-y-4">
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-10 w-full mt-6" />
              </div>
          </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col">
      <main className='flex-1 pb-24'>
        {children}
      </main>
      {/* Only show bottom nav if user is logged in and not on a public path */}
      {user && !isPublicPath && <BottomNav />}
    </div>
  );
}
