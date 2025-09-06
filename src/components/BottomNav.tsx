
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, PlusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';

export function BottomNav() {
  const pathname = usePathname();
  const { user } = useAuth();

  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/add', label: 'Add Event', icon: PlusCircle },
  ];
  
  // Don't render if there's no user
  if (!user) return null;

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full border-t bg-card/95 backdrop-blur-sm">
      <nav className="grid h-16 max-w-lg grid-cols-2 mx-auto font-medium">
        {navItems.map((item) => {
          const isActive = (pathname === '/' && item.href === '/') || (item.href !== '/' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "inline-flex flex-col items-center justify-center px-5 hover:bg-accent/50 focus:outline-none focus:ring-1 focus:ring-ring",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              <item.icon className="w-6 h-6 mb-1" />
              <span className="text-sm">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
