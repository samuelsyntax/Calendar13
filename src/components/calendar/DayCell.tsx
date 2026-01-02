'use client';

import { motion } from 'framer-motion';
import { CalendarDay } from '@/lib/ifc';
import { formatGregorianDate, formatIFCDate } from '@/lib/ifc/conversion';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface DayCellProps {
    day: CalendarDay;
    isSelected: boolean;
    onSelect: (day: CalendarDay) => void;
}

export function DayCell({ day, isSelected, onSelect }: DayCellProps) {
    const { ifcDate, gregorianDate, isToday } = day;

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onSelect(day)}
                    className={cn(
                        'relative flex h-12 w-full items-center justify-center rounded-xl text-sm font-medium transition-all duration-200',
                        'hover:bg-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
                        isToday && 'bg-primary text-primary-foreground hover:bg-primary/90',
                        isSelected && !isToday && 'bg-accent ring-2 ring-primary',
                        !isToday && !isSelected && 'hover:bg-muted'
                    )}
                    aria-label={`${formatIFCDate(ifcDate)}, ${formatGregorianDate(gregorianDate)}`}
                    aria-pressed={isSelected}
                >
                    <span className={cn(isToday && 'font-bold')}>{ifcDate.day}</span>
                </motion.button>
            </TooltipTrigger>
            <TooltipContent side="top" className="text-xs">
                <div className="flex flex-col gap-0.5">
                    <span className="font-medium">{formatIFCDate(ifcDate)}</span>
                    <span className="text-muted-foreground">
                        {formatGregorianDate(gregorianDate)}
                    </span>
                </div>
            </TooltipContent>
        </Tooltip>
    );
}
