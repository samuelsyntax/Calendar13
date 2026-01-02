'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ChevronDown, CalendarDays } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getMonthName, isLeapYear, IFC_MONTH_NAMES } from '@/lib/ifc';
import { cn } from '@/lib/utils';

interface CalendarHeaderProps {
    year: number;
    month: number;
    onPrevMonth: () => void;
    onNextMonth: () => void;
    onPrevYear: () => void;
    onNextYear: () => void;
    onToday: () => void;
    onGoToMonth: (month: number) => void;
    onGoToYear: (year: number) => void;
    canGoPrev: boolean;
    canGoNext: boolean;
}

export function CalendarHeader({
    year,
    month,
    onPrevMonth,
    onNextMonth,
    onPrevYear,
    onNextYear,
    onToday,
    onGoToMonth,
    onGoToYear,
    canGoPrev,
    canGoNext,
}: CalendarHeaderProps) {
    const monthName = getMonthName(month);
    const leap = isLeapYear(year);

    const [showMonthDropdown, setShowMonthDropdown] = useState(false);
    const [showYearDropdown, setShowYearDropdown] = useState(false);

    const monthDropdownRef = useRef<HTMLDivElement>(null);
    const yearDropdownRef = useRef<HTMLDivElement>(null);
    const yearScrollRef = useRef<HTMLDivElement>(null);

    // Generate year options: 20 years before and after current year
    const yearOptions = useMemo(() => {
        const years: number[] = [];
        const startYear = Math.max(1, year - 50);
        const endYear = Math.min(9999, year + 50);
        for (let y = startYear; y <= endYear; y++) {
            years.push(y);
        }
        return years;
    }, [year]);

    // Close dropdowns when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (monthDropdownRef.current && !monthDropdownRef.current.contains(event.target as Node)) {
                setShowMonthDropdown(false);
            }
            if (yearDropdownRef.current && !yearDropdownRef.current.contains(event.target as Node)) {
                setShowYearDropdown(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Scroll to current year when dropdown opens
    useEffect(() => {
        if (showYearDropdown && yearScrollRef.current) {
            const currentYearElement = yearScrollRef.current.querySelector('[data-current="true"]');
            if (currentYearElement) {
                currentYearElement.scrollIntoView({ block: 'center', behavior: 'instant' });
            }
        }
    }, [showYearDropdown]);

    const handleMonthSelect = (monthIndex: number) => {
        onGoToMonth(monthIndex);
        setShowMonthDropdown(false);
    };

    const handleYearSelect = (selectedYear: number) => {
        onGoToYear(selectedYear);
        setShowYearDropdown(false);
    };

    return (
        <div className="space-y-4">
            {/* Top Row: Today Button + Leap Year Badge */}
            <div className="flex items-center justify-between">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={onToday}
                    className="gap-2"
                >
                    <CalendarDays className="h-4 w-4" />
                    Today
                </Button>

                {leap && (
                    <span className="rounded-full bg-violet-500/20 px-3 py-1 text-xs font-semibold text-violet-600 dark:text-violet-400">
                        Leap Year
                    </span>
                )}
            </div>

            {/* Main Row: Navigation + Month/Year */}
            <div className="flex items-center justify-between gap-2">
                {/* Left: Previous Navigation */}
                <div className="flex items-center gap-1">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={onPrevYear}
                        disabled={!canGoPrev}
                        aria-label="Previous year"
                        className="h-10 w-10 rounded-full"
                    >
                        <ChevronLeft className="h-4 w-4" />
                        <ChevronLeft className="h-4 w-4 -ml-3" />
                    </Button>
                    <Button
                        variant="default"
                        size="icon"
                        onClick={onPrevMonth}
                        disabled={!canGoPrev}
                        aria-label="Previous month"
                        className="h-10 w-10 rounded-full"
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </Button>
                </div>

                {/* Center: Month/Year Display with Dropdowns */}
                <div className="flex flex-col items-center gap-1">
                    {/* Month Dropdown */}
                    <div className="relative" ref={monthDropdownRef}>
                        <motion.button
                            key={`${year}-${month}`}
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            onClick={() => {
                                setShowMonthDropdown(!showMonthDropdown);
                                setShowYearDropdown(false);
                            }}
                            className="flex items-center gap-1 text-2xl font-bold tracking-tight hover:text-primary transition-colors sm:text-3xl"
                        >
                            {monthName}
                            <ChevronDown className={cn(
                                "h-5 w-5 transition-transform",
                                showMonthDropdown && "rotate-180"
                            )} />
                        </motion.button>

                        <AnimatePresence>
                            {showMonthDropdown && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="absolute left-1/2 -translate-x-1/2 top-full mt-2 z-50 w-44 rounded-xl border border-border bg-popover p-2 shadow-lg"
                                >
                                    <div className="grid grid-cols-2 gap-1 max-h-64 overflow-y-auto">
                                        {IFC_MONTH_NAMES.slice(1).map((name, index) => (
                                            <button
                                                key={name}
                                                onClick={() => handleMonthSelect(index + 1)}
                                                className={cn(
                                                    "rounded-lg px-2 py-1.5 text-sm font-medium transition-colors text-left",
                                                    "hover:bg-accent hover:text-accent-foreground",
                                                    month === index + 1 && "bg-primary text-primary-foreground"
                                                )}
                                            >
                                                {name}
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Year Dropdown */}
                    <div className="relative" ref={yearDropdownRef}>
                        <button
                            onClick={() => {
                                setShowYearDropdown(!showYearDropdown);
                                setShowMonthDropdown(false);
                            }}
                            className="flex items-center gap-1 text-sm text-muted-foreground font-medium hover:text-primary transition-colors"
                        >
                            {year}
                            <ChevronDown className={cn(
                                "h-4 w-4 transition-transform",
                                showYearDropdown && "rotate-180"
                            )} />
                        </button>

                        <AnimatePresence>
                            {showYearDropdown && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="absolute left-1/2 -translate-x-1/2 top-full mt-2 z-50 w-32 rounded-xl border border-border bg-popover p-2 shadow-lg"
                                >
                                    <div
                                        ref={yearScrollRef}
                                        className="max-h-48 overflow-y-auto scrollbar-thin"
                                    >
                                        {yearOptions.map((y) => (
                                            <button
                                                key={y}
                                                data-current={y === year}
                                                onClick={() => handleYearSelect(y)}
                                                className={cn(
                                                    "w-full rounded-lg px-3 py-1.5 text-sm font-medium transition-colors text-center",
                                                    "hover:bg-accent hover:text-accent-foreground",
                                                    y === year && "bg-primary text-primary-foreground",
                                                    isLeapYear(y) && y !== year && "text-violet-600 dark:text-violet-400"
                                                )}
                                            >
                                                {y}
                                                {isLeapYear(y) && <span className="ml-1 text-xs">✦</span>}
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Right: Next Navigation */}
                <div className="flex items-center gap-1">
                    <Button
                        variant="default"
                        size="icon"
                        onClick={onNextMonth}
                        disabled={!canGoNext}
                        aria-label="Next month"
                        className="h-10 w-10 rounded-full"
                    >
                        <ChevronRight className="h-5 w-5" />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={onNextYear}
                        disabled={!canGoNext}
                        aria-label="Next year"
                        className="h-10 w-10 rounded-full"
                    >
                        <ChevronRight className="h-4 w-4" />
                        <ChevronRight className="h-4 w-4 -ml-3" />
                    </Button>
                </div>
            </div>

            {/* Month Indicator */}
            <div className="flex items-center justify-center">
                <span className="text-xs text-muted-foreground">
                    Month {month} of 13
                </span>
            </div>
        </div>
    );
}
