// src/utils/recurrence.ts
import type { Chore } from '../types';
import { eachDayOfInterval, format, parseISO } from 'date-fns';

export function generateRecurringInstances(
  parentChore: Chore,
  dateRange: { start: Date; end: Date }
): Chore[] {
  if (!parentChore.isRecurring || !parentChore.recurrence) {
    return [];
  }

  const { daysOfWeek, startDate, endDate } = parentChore.recurrence;

  // Parse start and end dates for the recurrence
  const recurrenceStart = parseISO(startDate);
  const recurrenceEnd = endDate ? parseISO(endDate) : null;

  // Determine the actual range to generate instances for
  const actualStart = recurrenceStart > dateRange.start ? recurrenceStart : dateRange.start;
  const actualEnd = recurrenceEnd && recurrenceEnd < dateRange.end
    ? recurrenceEnd
    : dateRange.end;

  // If the recurrence has ended before our date range starts, return empty
  if (recurrenceEnd && recurrenceEnd < dateRange.start) {
    return [];
  }

  // If the recurrence starts after our date range ends, return empty
  if (recurrenceStart > dateRange.end) {
    return [];
  }

  const instances: Chore[] = [];

  // Get all days in the range
  const allDays = eachDayOfInterval({ start: actualStart, end: actualEnd });

  // Filter days that match the specified days of week
  const matchingDays = allDays.filter((day) => {
    return daysOfWeek.includes(day.getDay());
  });

  // Create a chore instance for each matching day
  matchingDays.forEach((day) => {
    const dateString = format(day, 'yyyy-MM-dd');

    // Check if this instance has been completed
    const completion = parentChore.completions?.find(
      (c) => c.date === dateString
    );

    instances.push({
      ...parentChore,
      id: `${parentChore.id}-${dateString}`, // Unique ID for this instance
      dueDate: dateString,
      isCompleted: !!completion,
      parentId: parentChore.id, // Reference to parent
    });
  });

  return instances;
}

export function getAllChoresForCalendar(
  chores: Chore[],
  dateRange: { start: Date; end: Date }
): Chore[] {
  const result: Chore[] = [];

  chores.forEach((chore) => {
    if (chore.isRecurring && !chore.parentId) {
      // This is a parent recurring chore - generate instances
      const instances = generateRecurringInstances(chore, dateRange);
      result.push(...instances);
    } else if (!chore.parentId) {
      // This is a regular one-time chore
      const choreDate = parseISO(chore.dueDate);
      // Only include if within date range
      if (choreDate >= dateRange.start && choreDate <= dateRange.end) {
        result.push(chore);
      }
    }
    // Skip chores that are instances (have parentId) as they're generated dynamically
  });

  return result;
}
