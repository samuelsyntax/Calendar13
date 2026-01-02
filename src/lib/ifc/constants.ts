/**
 * IFC (International Fixed Calendar) Constants
 */

// Month names: X (Sol) is the extra month between June and July
export const IFC_MONTH_NAMES = [
    '', // 0 index placeholder
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'Sol', // Month 7 - the extra month (also known as "X")
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
] as const;

export const IFC_WEEKDAY_NAMES = [
    'Sun',
    'Mon',
    'Tue',
    'Wed',
    'Thu',
    'Fri',
    'Sat',
] as const;

// Each IFC month has exactly 28 days (4 complete weeks)
export const DAYS_PER_IFC_MONTH = 28;

// Total months in IFC calendar
export const IFC_MONTHS_COUNT = 13;

// Year Day and Leap Day are special days not part of any month/week
export const YEAR_DAY_NAME = 'Year Day';
export const LEAP_DAY_NAME = 'Leap Day';

// Gregorian calendar constants for conversion
export const DAYS_IN_YEAR = 365;
export const DAYS_IN_LEAP_YEAR = 366;

// Month boundaries for special days
export const LEAP_DAY_AFTER_MONTH = 6; // After June (month 6)
export const YEAR_DAY_AFTER_MONTH = 13; // After December (month 13)
