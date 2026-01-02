/**
 * IFC (International Fixed Calendar) Type Definitions
 */

export interface IFCDate {
    year: number;
    month: number; // 1-13 (0 indicates special day)
    day: number; // 1-28 (or 0 for Year Day/Leap Day)
    isYearDay: boolean;
    isLeapDay: boolean;
}

export interface IFCMonth {
    index: number; // 1-13
    name: string;
    year: number;
}

export interface CalendarDay {
    ifcDate: IFCDate;
    gregorianDate: Date;
    isToday: boolean;
    isCurrentMonth: boolean;
}

export type WeekDay = 'Sun' | 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat';
