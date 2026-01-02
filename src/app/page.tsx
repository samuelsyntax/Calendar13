'use client';

import { Suspense } from 'react';
import { Calendar } from '@/components/calendar';
import { ThemeToggle } from '@/components/ThemeToggle';
import { CalendarDays } from 'lucide-react';

function CalendarLoader() {
  return (
    <div className="mx-auto w-full max-w-md animate-pulse rounded-2xl bg-card p-6">
      <div className="h-8 w-48 rounded bg-muted" />
      <div className="mt-6 grid grid-cols-7 gap-1">
        {Array.from({ length: 35 }).map((_, i) => (
          <div key={i} className="h-12 rounded-xl bg-muted" />
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-lg">
        <div className="container mx-auto flex h-16 max-w-4xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-6 w-6 text-primary" />
            <h1 className="text-lg font-bold tracking-tight">
              IFC Calendar
            </h1>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto max-w-4xl px-4 py-8">
        {/* Hero Section */}
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            International Fixed Calendar
          </h2>
          <p className="mt-2 text-muted-foreground">
            A rational calendar with 13 months of exactly 28 days each
          </p>
        </div>

        {/* Calendar */}
        <Suspense fallback={<CalendarLoader />}>
          <Calendar />
        </Suspense>

        {/* Info Section */}
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <InfoCard
            title="13 Months"
            description="Each month has exactly 28 days (4 complete weeks)"
          />
          <InfoCard
            title="Year Day"
            description="December 29th - a special day outside any week"
          />
          <InfoCard
            title="Leap Day"
            description="June 29th in leap years - another intercalary day"
          />
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-16 border-t border-border/40 py-8">
        <div className="container mx-auto max-w-4xl px-4 text-center text-sm text-muted-foreground">
          <p>
            The International Fixed Calendar is a proposed reform of the
            Gregorian calendar designed by Moses B. Cotsworth.
          </p>
        </div>
      </footer>
    </main>
  );
}

function InfoCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-border/50 bg-card/50 p-4 backdrop-blur-sm">
      <h3 className="font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
