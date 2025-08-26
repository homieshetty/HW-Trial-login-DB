"use client";
import { BottomNav } from './BottomNav';

export function AppContent({ children }: { children: React.ReactNode }) {

  return (
    <div className="relative flex min-h-screen w-full flex-col">
      <main className='flex-1 pb-24'>
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
