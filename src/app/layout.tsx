
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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet" />
      </head>
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
