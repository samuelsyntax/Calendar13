import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'IFC Calendar - International Fixed Calendar',
  description:
    'A modern calendar using the International Fixed Calendar system with 13 months of 28 days each.',
  keywords: [
    'calendar',
    'IFC',
    'International Fixed Calendar',
    '13 months',
    'fixed calendar',
  ],
  openGraph: {
    title: 'IFC Calendar - International Fixed Calendar',
    description:
      'A modern calendar using the International Fixed Calendar system with 13 months of 28 days each.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider defaultTheme="system" storageKey="ifc-calendar-theme">
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
