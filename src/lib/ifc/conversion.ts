/**
 * IFC (International Fixed Calendar) Conversion Functions
 * 
 * Handles conversion between Gregorian and IFC calendar systems.
 * 
 * IFC Rules:
 * - 13 months of 28 days each = 364 days
 * - Year Day: 365th day (after Dec 28), not part of any week
 * - Leap Day: Extra day after June 28 in leap years, not part of any week
 * - Each month always starts on the same weekday (Sunday)
 */

import { IFCDate } from './types';
import { DAYS_PER_IFC_MONTH, LEAP_DAY_AFTER_MONTH } from './constants';

/**
 * Check if a year is a leap year (Gregorian rules)
 */
export function isLeapYear(year: number): boolean {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

/**
 * Get the day of the year (1-365 or 1-366 for leap years)
 */
export function getDayOfYear(date: Date): number {
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = date.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
}

/**
 * Convert a Gregorian date to IFC date
 */
export function gregorianToIFC(date: Date): IFCDate {
    const year = date.getFullYear();
    const dayOfYear = getDayOfYear(date);
    const leap = isLeapYear(year);

    // Calculate Leap Day position: day 169 (June 29 in Gregorian, after IFC June 28)
    // June has 30 days in Gregorian, IFC June is month 6 with 28 days
    // Days 1-168 = months 1-6 (6 * 28 = 168)
    // Day 169 = Leap Day (if leap year)
    const leapDayPosition = 6 * DAYS_PER_IFC_MONTH + 1; // Day 169

    // Year Day is always the last day of the year (365 or 366)
    const yearLength = leap ? 366 : 365;

    // Check for Year Day (last day of year)
    if (dayOfYear === yearLength) {
        return {
            year,
            month: 0, // Not part of any month
            day: 0,
            isYearDay: true,
            isLeapDay: false,
        };
    }

    // Check for Leap Day (day 169 in leap years)
    if (leap && dayOfYear === leapDayPosition) {
        return {
            year,
            month: 0, // Not part of any month
            day: 0,
            isYearDay: false,
            isLeapDay: true,
        };
    }

    // Adjust day of year for leap day offset
    let adjustedDay = dayOfYear;
    if (leap && dayOfYear > leapDayPosition) {
        adjustedDay = dayOfYear - 1; // Remove leap day from count
    }

    // Calculate IFC month and day
    // Each month is exactly 28 days
    const month = Math.ceil(adjustedDay / DAYS_PER_IFC_MONTH);
    const day = ((adjustedDay - 1) % DAYS_PER_IFC_MONTH) + 1;

    return {
        year,
        month,
        day,
        isYearDay: false,
        isLeapDay: false,
    };
}

/**
 * Convert an IFC date to Gregorian date
 */
export function ifcToGregorian(ifc: IFCDate): Date {
    const { year, month, day, isYearDay, isLeapDay } = ifc;
    const leap = isLeapYear(year);

    // Handle Year Day
    if (isYearDay) {
        const yearLength = leap ? 366 : 365;
        return dayOfYearToDate(year, yearLength);
    }

    // Handle Leap Day
    if (isLeapDay) {
        if (!leap) {
            throw new Error('Leap Day only exists in leap years');
        }
        const leapDayPosition = 6 * DAYS_PER_IFC_MONTH + 1; // Day 169
        return dayOfYearToDate(year, leapDayPosition);
    }

    // Calculate day of year for regular IFC date
    let dayOfYear = (month - 1) * DAYS_PER_IFC_MONTH + day;

    // Adjust for leap day if after June and it's a leap year
    if (leap && month > LEAP_DAY_AFTER_MONTH) {
        dayOfYear += 1;
    }

    return dayOfYearToDate(year, dayOfYear);
}

/**
 * Convert day of year to Date object
 */
function dayOfYearToDate(year: number, dayOfYear: number): Date {
    // Use setFullYear to avoid JavaScript's 2-digit year interpretation
    // (JS maps 0-99 to 1900-1999 in the Date constructor)
    const date = new Date(0);
    date.setFullYear(year, 0, 1); // January 1st of the given year
    date.setDate(dayOfYear);
    return date;
}

/**
 * Get the current date in IFC format
 */
export function getIFCToday(): IFCDate {
    return gregorianToIFC(new Date());
}

/**
 * Check if two IFC dates are the same
 */
export function isSameIFCDate(a: IFCDate, b: IFCDate): boolean {
    if (a.isYearDay && b.isYearDay) return a.year === b.year;
    if (a.isLeapDay && b.isLeapDay) return a.year === b.year;
    return a.year === b.year && a.month === b.month && a.day === b.day;
}

/**
 * Format an IFC date as a human-readable string
 */
export function formatIFCDate(ifc: IFCDate): string {
    if (ifc.isYearDay) {
        return `Year Day, ${ifc.year}`;
    }
    if (ifc.isLeapDay) {
        return `Leap Day, ${ifc.year}`;
    }

    const { IFC_MONTH_NAMES } = require('./constants');
    return `${IFC_MONTH_NAMES[ifc.month]} ${ifc.day}, ${ifc.year}`;
}

/**
 * Format a Gregorian date as a human-readable string
 */
export function formatGregorianDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}
