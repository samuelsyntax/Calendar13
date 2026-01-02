/**
 * IFC (International Fixed Calendar) Utility Functions
 */

import { IFCDate, CalendarDay } from './types';
import {
    DAYS_PER_IFC_MONTH,
    IFC_MONTH_NAMES,
    LEAP_DAY_AFTER_MONTH,
    YEAR_DAY_AFTER_MONTH,
} from './constants';
import {
    isLeapYear,
    ifcToGregorian,
    getIFCToday,
    isSameIFCDate,
} from './conversion';

/**
 * Get all days for a specific IFC month
 */
export function getMonthDays(year: number, month: number): CalendarDay[] {
    const today = getIFCToday();
    const days: CalendarDay[] = [];

    // Regular days (1-28)
    for (let day = 1; day <= DAYS_PER_IFC_MONTH; day++) {
        const ifcDate: IFCDate = {
            year,
            month,
            day,
            isYearDay: false,
            isLeapDay: false,
        };

        days.push({
            ifcDate,
            gregorianDate: ifcToGregorian(ifcDate),
            isToday: isSameIFCDate(ifcDate, today),
            isCurrentMonth: true,
        });
    }

    return days;
}

/**
 * Check if a month has a special day (Leap Day after June, Year Day after December)
 */
export function getSpecialDay(
    year: number,
    month: number
): CalendarDay | null {
    const today = getIFCToday();

    // Leap Day after June (month 6)
    if (month === LEAP_DAY_AFTER_MONTH && isLeapYear(year)) {
        const ifcDate: IFCDate = {
            year,
            month: 0,
            day: 0,
            isYearDay: false,
            isLeapDay: true,
        };

        return {
            ifcDate,
            gregorianDate: ifcToGregorian(ifcDate),
            isToday: isSameIFCDate(ifcDate, today),
            isCurrentMonth: true,
        };
    }

    // Year Day after December (month 13)
    if (month === YEAR_DAY_AFTER_MONTH) {
        const ifcDate: IFCDate = {
            year,
            month: 0,
            day: 0,
            isYearDay: true,
            isLeapDay: false,
        };

        return {
            ifcDate,
            gregorianDate: ifcToGregorian(ifcDate),
            isToday: isSameIFCDate(ifcDate, today),
            isCurrentMonth: true,
        };
    }

    return null;
}

/**
 * Get month name from month number
 */
export function getMonthName(month: number): string {
    if (month < 1 || month > 13) return '';
    return IFC_MONTH_NAMES[month];
}

/**
 * Navigate to next month, handling year boundary
 */
export function getNextMonth(year: number, month: number): { year: number; month: number } {
    if (month >= 13) {
        return { year: year + 1, month: 1 };
    }
    return { year, month: month + 1 };
}

/**
 * Navigate to previous month, handling year boundary
 */
export function getPreviousMonth(year: number, month: number): { year: number; month: number } {
    if (month <= 1) {
        return { year: year - 1, month: 13 };
    }
    return { year, month: month - 1 };
}

/**
 * Validate year range (1-9999)
 */
export function isValidYear(year: number): boolean {
    return year >= 1 && year <= 9999;
}

/**
 * Validate month range (1-13)
 */
export function isValidMonth(month: number): boolean {
    return month >= 1 && month <= 13;
}
