// src/utils/dateHelpers.ts
import { format, parseISO } from 'date-fns';

export function formatDate(date: string | Date, formatString: string = 'PP'): string {
  if (typeof date === 'string') {
    return format(parseISO(date), formatString);
  }
  return format(date, formatString);
}

export function formatDateTime(date: string | Date): string {
  if (typeof date === 'string') {
    return format(parseISO(date), 'PPp');
  }
  return format(date, 'PPp');
}

export function toISODate(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function getDayName(dayIndex: number): string {
  return DAY_NAMES[dayIndex] || '';
}
