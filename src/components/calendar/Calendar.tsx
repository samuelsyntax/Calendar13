'use client';

import { useState, useCallback, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CalendarDay } from '@/lib/ifc';
import { getIFCToday } from '@/lib/ifc/conversion';
import {
    getNextMonth,
    getPreviousMonth,
    isValidYear,
    isValidMonth,
} from '@/lib/ifc/utils';
import { CalendarHeader } from './CalendarHeader';
import { MonthView } from './MonthView';
import { TooltipProvider } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

const MIN_YEAR = 1;
const MAX_YEAR = 9999;

export function Calendar() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Get today's IFC date
    const today = getIFCToday();

    // Parse URL params or use today's date
    const urlYear = searchParams.get('year');
    const urlMonth = searchParams.get('month');

    const initialYear =
        urlYear && isValidYear(parseInt(urlYear, 10))
            ? parseInt(urlYear, 10)
            : today.year;
    const initialMonth =
        urlMonth && isValidMonth(parseInt(urlMonth, 10))
            ? parseInt(urlMonth, 10)
            : today.month || 1; // Fallback to 1 if today is Year/Leap Day

    const [year, setYear] = useState(initialYear);
    const [month, setMonth] = useState(initialMonth);
    const [selectedDay, setSelectedDay] = useState<CalendarDay | null>(null);
    const [direction, setDirection] = useState(0);

    // Sync URL with state
    const updateURL = useCallback(
        (newYear: number, newMonth: number) => {
            const params = new URLSearchParams();
            params.set('year', newYear.toString());
            params.set('month', newMonth.toString());
            router.replace(`?${params.toString()}`, { scroll: false });
        },
        [router]
    );

    // Update URL when year/month changes
    useEffect(() => {
        updateURL(year, month);
    }, [year, month, updateURL]);

    // Navigation handlers
    const canGoPrev = year > MIN_YEAR || (year === MIN_YEAR && month > 1);
    const canGoNext = year < MAX_YEAR || (year === MAX_YEAR && month < 13);

    const handlePrevMonth = useCallback(() => {
        if (!canGoPrev) return;
        setDirection(-1);
        const { year: newYear, month: newMonth } = getPreviousMonth(year, month);
        if (newYear >= MIN_YEAR) {
            setYear(newYear);
            setMonth(newMonth);
        }
    }, [year, month, canGoPrev]);

    const handleNextMonth = useCallback(() => {
        if (!canGoNext) return;
        setDirection(1);
        const { year: newYear, month: newMonth } = getNextMonth(year, month);
        if (newYear <= MAX_YEAR) {
            setYear(newYear);
            setMonth(newMonth);
        }
    }, [year, month, canGoNext]);

    const handlePrevYear = useCallback(() => {
        if (year > MIN_YEAR) {
            setDirection(-1);
            setYear(year - 1);
        }
    }, [year]);

    const handleNextYear = useCallback(() => {
        if (year < MAX_YEAR) {
            setDirection(1);
            setYear(year + 1);
        }
    }, [year]);

    const handleToday = useCallback(() => {
        const todayDate = getIFCToday();
        const targetMonth = todayDate.month || 1;
        const targetYear = todayDate.year;

        // Determine direction for animation
        if (targetYear > year || (targetYear === year && targetMonth > month)) {
            setDirection(1);
        } else if (
            targetYear < year ||
            (targetYear === year && targetMonth < month)
        ) {
            setDirection(-1);
        }

        setYear(targetYear);
        setMonth(targetMonth);
        setSelectedDay(null);
    }, [year, month]);

    const handleSelectDay = useCallback((day: CalendarDay) => {
        setSelectedDay(day);
    }, []);

    // Direct navigation handlers
    const handleGoToMonth = useCallback((newMonth: number) => {
        if (newMonth > month) {
            setDirection(1);
        } else if (newMonth < month) {
            setDirection(-1);
        }
        setMonth(newMonth);
    }, [month]);

    const handleGoToYear = useCallback((newYear: number) => {
        if (newYear < MIN_YEAR) newYear = MIN_YEAR;
        if (newYear > MAX_YEAR) newYear = MAX_YEAR;

        if (newYear > year) {
            setDirection(1);
        } else if (newYear < year) {
            setDirection(-1);
        }
        setYear(newYear);
    }, [year]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
                return;
            }

            switch (e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    handlePrevMonth();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    handleNextMonth();
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    handlePrevYear();
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    handleNextYear();
                    break;
                case 't':
                case 'T':
                    e.preventDefault();
                    handleToday();
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handlePrevMonth, handleNextMonth, handlePrevYear, handleNextYear, handleToday]);

    return (
        <TooltipProvider delayDuration={300}>
            <div
                className={cn(
                    'mx-auto w-full max-w-md rounded-2xl p-4 sm:p-6',
                    'bg-card text-card-foreground',
                    'shadow-xl shadow-black/5 dark:shadow-black/20',
                    'border border-border/50'
                )}
                role="application"
                aria-label="International Fixed Calendar"
            >
                <CalendarHeader
                    year={year}
                    month={month}
                    onPrevMonth={handlePrevMonth}
                    onNextMonth={handleNextMonth}
                    onPrevYear={handlePrevYear}
                    onNextYear={handleNextYear}
                    onToday={handleToday}
                    onGoToMonth={handleGoToMonth}
                    onGoToYear={handleGoToYear}
                    canGoPrev={canGoPrev}
                    canGoNext={canGoNext}
                />

                <div className="mt-6">
                    <MonthView
                        year={year}
                        month={month}
                        selectedDay={selectedDay}
                        onSelectDay={handleSelectDay}
                        direction={direction}
                    />
                </div>

                {/* Keyboard shortcuts hint */}
                <div className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    <span>← → Month</span>
                    <span>↑ ↓ Year</span>
                    <span>T Today</span>
                </div>
            </div>
        </TooltipProvider>
    );
}
