'use client';

import { motion } from 'framer-motion';
import { CalendarDay, YEAR_DAY_NAME, LEAP_DAY_NAME } from '@/lib/ifc';
import { formatGregorianDate } from '@/lib/ifc/conversion';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { Sparkles, Star } from 'lucide-react';

interface SpecialDayCellProps {
    day: CalendarDay;
    isSelected: boolean;
    onSelect: (day: CalendarDay) => void;
}

export function SpecialDayCell({ day, isSelected, onSelect }: SpecialDayCellProps) {
    const { ifcDate, gregorianDate, isToday } = day;
    const isYearDay = ifcDate.isYearDay;
    const isLeapDay = ifcDate.isLeapDay;

    const label = isYearDay ? YEAR_DAY_NAME : LEAP_DAY_NAME;
    const Icon = isYearDay ? Star : Sparkles;

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onSelect(day)}
                    className={cn(
                        'col-span-7 flex h-14 w-full items-center justify-center gap-2 rounded-xl text-sm font-medium transition-all duration-200',
                        'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
                        isYearDay && 'bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-500/20 text-amber-700 dark:text-amber-300',
                        isLeapDay && 'bg-gradient-to-r from-violet-500/20 via-purple-500/20 to-violet-500/20 text-violet-700 dark:text-violet-300',
                        isToday && 'ring-2 ring-primary',
                        isSelected && !isToday && 'ring-2 ring-secondary'
                    )}
                    aria-label={`${label}, ${formatGregorianDate(gregorianDate)}`}
                    aria-pressed={isSelected}
                >
                    <Icon className="h-4 w-4" />
                    <span className="font-semibold">{label}</span>
                    <Icon className="h-4 w-4" />
                </motion.button>
            </TooltipTrigger>
            <TooltipContent side="top" className="text-xs">
                <div className="flex flex-col gap-0.5">
                    <span className="font-medium">{label}</span>
                    <span className="text-muted-foreground">
                        {formatGregorianDate(gregorianDate)}
                    </span>
                    <span className="text-muted-foreground text-xs italic">
                        Not part of any week
                    </span>
                </div>
            </TooltipContent>
        </Tooltip>
    );
}
