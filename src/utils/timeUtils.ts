/**
 * Time utility functions
 * Helper functions for time calculations and formatting
 */

import { format, parse, addDays, startOfWeek, endOfWeek, isSameDay } from 'date-fns';

/**
 * Convert time string (HH:MM) to minutes since midnight
 */
export function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

/**
 * Convert minutes since midnight to time string (HH:MM)
 */
export function minutesToTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}

/**
 * Format time for display (7:00 AM, 2:30 PM, etc.)
 */
export function formatTimeDisplay(time: string): string {
  const [hours, minutes] = time.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
}

/**
 * Format time range for display (7:30 – 9:00 AM)
 */
export function formatTimeRange(startTime: string, endTime: string): string {
  const start = formatTimeDisplay(startTime);
  const end = formatTimeDisplay(endTime);

  // If both times are in the same period (AM/PM), only show period once
  const startPeriod = start.slice(-2);
  const endPeriod = end.slice(-2);

  if (startPeriod === endPeriod) {
    return `${start.slice(0, -3)} – ${end}`;
  }

  return `${start} – ${end}`;
}

/**
 * Calculate duration in minutes between two times
 */
export function calculateDuration(startTime: string, endTime: string): number {
  const startMinutes = timeToMinutes(startTime);
  let endMinutes = timeToMinutes(endTime);

  // Handle times that cross midnight
  if (endMinutes < startMinutes) {
    endMinutes += 24 * 60;
  }

  return endMinutes - startMinutes;
}

/**
 * Calculate end time given start time and duration
 */
export function calculateEndTime(startTime: string, durationMinutes: number): string {
  const startMinutes = timeToMinutes(startTime);
  let endMinutes = startMinutes + durationMinutes;

  // Handle overflow past midnight
  if (endMinutes >= 24 * 60) {
    endMinutes = endMinutes % (24 * 60);
  }

  return minutesToTime(endMinutes);
}

/**
 * Format duration for display (1 hr, 30 min)
 */
export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours === 0) {
    return `${mins} min`;
  } else if (mins === 0) {
    return `${hours} hr`;
  } else {
    return `${hours} hr, ${mins} min`;
  }
}

/**
 * Format date to YYYY-MM-DD
 */
export function formatDate(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

/**
 * Parse date from YYYY-MM-DD string
 */
export function parseDate(dateString: string): Date {
  return parse(dateString, 'yyyy-MM-dd', new Date());
}

/**
 * Get current date as YYYY-MM-DD
 */
export function getTodayString(): string {
  return formatDate(new Date());
}

/**
 * Get week date range (Sunday to Saturday)
 */
export function getWeekRange(date: Date): { start: Date; end: Date } {
  const start = startOfWeek(date, { weekStartsOn: 0 }); // Sunday
  const end = endOfWeek(date, { weekStartsOn: 0 }); // Saturday
  return { start, end };
}

/**
 * Get array of dates for the week containing the given date
 */
export function getWeekDates(date: Date): Date[] {
  const { start } = getWeekRange(date);
  const dates: Date[] = [];

  for (let i = 0; i < 7; i++) {
    dates.push(addDays(start, i));
  }

  return dates;
}

/**
 * Get day of week (0 = Sunday, 6 = Saturday)
 */
export function getDayOfWeek(date: Date): number {
  return date.getDay();
}

/**
 * Check if a date matches the recurrence pattern
 */
export function matchesRecurrence(
  date: Date,
  recurrence: 'daily' | 'weekdays' | 'weekends' | 'custom',
  customDays?: number[]
): boolean {
  const dayOfWeek = getDayOfWeek(date);

  switch (recurrence) {
    case 'daily':
      return true;

    case 'weekdays':
      return dayOfWeek >= 1 && dayOfWeek <= 5; // Mon-Fri

    case 'weekends':
      return dayOfWeek === 0 || dayOfWeek === 6; // Sun, Sat

    case 'custom':
      if (!customDays || customDays.length === 0) return false;
      // customDays: 1=Mon, 2=Tue, ..., 7=Sun
      // Convert to JS day (0=Sun, 1=Mon, ...)
      const customDaysJS = customDays.map((d) => (d === 7 ? 0 : d));
      return customDaysJS.includes(dayOfWeek);

    default:
      return false;
  }
}

/**
 * Check if time is between wake and sleep times
 */
export function isWithinActiveHours(time: string, wakeTime: string, sleepTime: string): boolean {
  const timeMinutes = timeToMinutes(time);
  const wakeMinutes = timeToMinutes(wakeTime);
  const sleepMinutes = timeToMinutes(sleepTime);

  // Normal case: wake before sleep (e.g., 7:00 - 23:00)
  if (sleepMinutes > wakeMinutes) {
    return timeMinutes >= wakeMinutes && timeMinutes <= sleepMinutes;
  }

  // Edge case: sleep crosses midnight (e.g., 22:00 - 02:00)
  return timeMinutes >= wakeMinutes || timeMinutes <= sleepMinutes;
}

/**
 * Get time until next task (for "Next up in..." indicator)
 */
export function getTimeUntilNext(targetTime: string): { hours: number; minutes: number } {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  let targetMinutes = timeToMinutes(targetTime);

  // If target is earlier in the day, assume it's tomorrow
  if (targetMinutes < currentMinutes) {
    targetMinutes += 24 * 60;
  }

  const diffMinutes = targetMinutes - currentMinutes;
  const hours = Math.floor(diffMinutes / 60);
  const minutes = diffMinutes % 60;

  return { hours, minutes };
}

/**
 * Format "time until" for display
 */
export function formatTimeUntil(hours: number, minutes: number): string {
  if (hours === 0) {
    return `${minutes}m`;
  } else if (minutes === 0) {
    return `${hours}h`;
  } else {
    return `${hours}h ${minutes}m`;
  }
}

/**
 * Check if current time is past a given time
 */
export function isTimePast(time: string): boolean {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const targetMinutes = timeToMinutes(time);
  return currentMinutes > targetMinutes;
}

/**
 * Get current time as HH:MM string
 */
export function getCurrentTime(): string {
  const now = new Date();
  return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
}

/**
 * Format date for display (November 11, 2025)
 */
export function formatDateDisplay(date: Date): string {
  return format(date, 'MMMM d, yyyy');
}

/**
 * Format date for display short (Nov 11)
 */
export function formatDateShort(date: Date): string {
  return format(date, 'MMM d');
}

/**
 * Check if date is today
 */
export function isToday(date: Date): boolean {
  return isSameDay(date, new Date());
}
