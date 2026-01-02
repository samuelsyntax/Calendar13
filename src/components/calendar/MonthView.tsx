'use client';

import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarDay, IFC_WEEKDAY_NAMES } from '@/lib/ifc';
import { getMonthDays, getSpecialDay } from '@/lib/ifc/utils';
import { DayCell } from './DayCell';
import { SpecialDayCell } from './SpecialDayCell';

interface MonthViewProps {
    year: number;
    month: number;
    selectedDay: CalendarDay | null;
    onSelectDay: (day: CalendarDay) => void;
    direction: number; // -1 for prev, 1 for next
}

const variants = {
    enter: (direction: number) => ({
        x: direction > 0 ? 300 : -300,
        opacity: 0,
    }),
    center: {
        x: 0,
        opacity: 1,
    },
    exit: (direction: number) => ({
        x: direction < 0 ? 300 : -300,
        opacity: 0,
    }),
};

export function MonthView({
    year,
    month,
    selectedDay,
    onSelectDay,
    direction,
}: MonthViewProps) {
    const days = useMemo(() => getMonthDays(year, month), [year, month]);
    const specialDay = useMemo(() => getSpecialDay(year, month), [year, month]);

    const isSelected = (day: CalendarDay) => {
        if (!selectedDay) return false;
        const { ifcDate: a } = day;
        const { ifcDate: b } = selectedDay;
        if (a.isYearDay && b.isYearDay) return a.year === b.year;
        if (a.isLeapDay && b.isLeapDay) return a.year === b.year;
        return a.year === b.year && a.month === b.month && a.day === b.day;
    };

    return (
        <div className="overflow-hidden">
            {/* Weekday Headers */}
            <div className="mb-2 grid grid-cols-7 gap-1">
                {IFC_WEEKDAY_NAMES.map((dayName) => (
                    <div
                        key={dayName}
                        className="flex h-10 items-center justify-center text-xs font-medium uppercase tracking-wider text-muted-foreground"
                    >
                        {dayName}
                    </div>
                ))}
            </div>

            {/* Days Grid with Animation */}
            <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                    key={`${year}-${month}`}
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                        x: { type: 'spring', stiffness: 300, damping: 30 },
                        opacity: { duration: 0.2 },
                    }}
                >
                    {/* Regular Days Grid (4 rows x 7 cols = 28 days) */}
                    <div className="grid grid-cols-7 gap-1">
                        {days.map((day, index) => (
                            <DayCell
                                key={index}
                                day={day}
                                isSelected={isSelected(day)}
                                onSelect={onSelectDay}
                            />
                        ))}
                    </div>

                    {/* Special Day (Year Day or Leap Day) */}
                    {specialDay && (
                        <div className="mt-2 grid grid-cols-7 gap-1">
                            <SpecialDayCell
                                day={specialDay}
                                isSelected={isSelected(specialDay)}
                                onSelect={onSelectDay}
                            />
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
