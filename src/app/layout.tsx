
import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { AppContent } from '@/components/AppContent';
import { AuthProvider } from '@/hooks/useAuth';

export const metadata: Metadata = {
  title: 'HomieWorks',
  description: 'Manage your financial events with ease.',
  icons: {
    icon: '/newfavicon.ico?v=1',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="font-body antialiased">
        <AuthProvider>
          <AppContent>
            {children}
          </AppContent>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
