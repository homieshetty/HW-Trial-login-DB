
"use client";
import { usePathname } from 'next/navigation';
import { BottomNav } from './BottomNav';

export function AppContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';

  return (
    <div className="relative flex min-h-screen w-full flex-col">
      <main className={`flex-1 ${!isLoginPage ? 'pb-24' : ''}`}>
        {children}
      </main>
      {!isLoginPage && <BottomNav />}
    </div>
  );
}
