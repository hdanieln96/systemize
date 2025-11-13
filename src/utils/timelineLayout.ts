/**
 * Timeline Layout Algorithm
 * Calculates positions and heights for task nodes on the timeline
 */

import { Task } from '@types/index';
import { timeToMinutes, calculateDuration, calculateEndTime } from './timeUtils';

export interface NodePosition {
  taskId: string;
  y: number; // Vertical position from top (pixels)
  height: number; // Node height (pixels)
  type: 'circle' | 'block'; // Visual type
}

export interface IntervalInfo {
  afterTaskId: string;
  y: number; // Position of interval message
  durationMinutes: number;
  message: string;
}

const PIXELS_PER_HOUR = 120; // 120px = 1 hour
const CIRCLE_NODE_SIZE = 64; // Standard circular node
const MIN_BLOCK_HEIGHT = 64; // Minimum height for time blocks

/**
 * Calculate node positions for timeline rendering
 */
export function calculateNodePositions(
  tasks: Task[],
  wakeTime: string,
  pixelsPerHour: number = PIXELS_PER_HOUR
): NodePosition[] {
  const positions: NodePosition[] = [];
  const wakeMinutes = timeToMinutes(wakeTime);

  for (const task of tasks) {
    const taskMinutes = timeToMinutes(task.time);
    const minutesSinceWake = taskMinutes - wakeMinutes;

    // Calculate Y position
    const y = (minutesSinceWake / 60) * pixelsPerHour;

    // Calculate height based on task type
    let height = CIRCLE_NODE_SIZE; // Default circular
    let type: 'circle' | 'block' = 'circle';

    if (task.duration && task.duration > 0) {
      // Time block with duration
      height = Math.max((task.duration / 60) * pixelsPerHour, MIN_BLOCK_HEIGHT);
      type = 'block';
    }

    positions.push({
      taskId: task.id,
      y,
      height,
      type,
    });
  }

  return positions;
}

/**
 * Calculate intervals (gaps) between tasks
 */
export function calculateIntervals(tasks: Task[]): IntervalInfo[] {
  const intervals: IntervalInfo[] = [];

  for (let i = 0; i < tasks.length - 1; i++) {
    const current = tasks[i];
    const next = tasks[i + 1];

    // Calculate when current task ends
    let currentEndTime = current.time;
    if (current.duration && current.duration > 0) {
      currentEndTime = calculateEndTime(current.time, current.duration);
    }

    // Calculate gap
    const gapMinutes = calculateDuration(currentEndTime, next.time);

    if (gapMinutes > 0) {
      // Determine message based on gap duration
      let message = '💤 Reflect on the respite.';
      if (gapMinutes >= 60) {
        message = '💤 Interval over. What\'s next?';
      }

      intervals.push({
        afterTaskId: current.id,
        y: 0, // Will be calculated based on node position
        durationMinutes: gapMinutes,
        message,
      });
    }
  }

  return intervals;
}

/**
 * Calculate hour labels for time ruler
 */
export function calculateHourLabels(
  wakeTime: string,
  sleepTime: string
): Array<{ time: string; label: string; y: number }> {
  const wakeMinutes = timeToMinutes(wakeTime);
  const sleepMinutes = timeToMinutes(sleepTime);

  // Handle sleep time past midnight
  let endMinutes = sleepMinutes;
  if (sleepMinutes < wakeMinutes) {
    endMinutes = sleepMinutes + 24 * 60;
  }

  const labels: Array<{ time: string; label: string; y: number }> = [];
  let currentMinutes = wakeMinutes;

  while (currentMinutes <= endMinutes) {
    const hours = Math.floor(currentMinutes / 60) % 24;
    const time = `${hours.toString().padStart(2, '0')}:00`;

    // Format label
    const displayHours = hours % 12 || 12;
    const period = hours < 12 ? 'AM' : 'PM';
    const label = `${displayHours}:00 ${period}`;

    // Calculate Y position
    const minutesSinceWake = currentMinutes - wakeMinutes;
    const y = (minutesSinceWake / 60) * PIXELS_PER_HOUR;

    labels.push({ time, label, y });

    currentMinutes += 60; // Next hour
  }

  return labels;
}

/**
 * Get total timeline height
 */
export function calculateTimelineHeight(
  wakeTime: string,
  sleepTime: string,
  pixelsPerHour: number = PIXELS_PER_HOUR
): number {
  const wakeMinutes = timeToMinutes(wakeTime);
  let sleepMinutes = timeToMinutes(sleepTime);

  // Handle sleep time past midnight
  if (sleepMinutes < wakeMinutes) {
    sleepMinutes += 24 * 60;
  }

  const totalMinutes = sleepMinutes - wakeMinutes;
  return (totalMinutes / 60) * pixelsPerHour;
}

/**
 * Find the task closest to current time (for "Next up" indicator)
 */
export function findNextTask(tasks: Task[], currentTime: string): Task | null {
  const currentMinutes = timeToMinutes(currentTime);

  // Find tasks that haven't started yet
  const upcomingTasks = tasks
    .filter((task) => {
      const taskMinutes = timeToMinutes(task.time);
      return taskMinutes > currentMinutes && !task.isCompleted;
    })
    .sort((a, b) => timeToMinutes(a.time) - timeToMinutes(b.time));

  return upcomingTasks.length > 0 ? upcomingTasks[0] : null;
}

/**
 * Calculate Y position for current time indicator
 */
export function calculateCurrentTimePosition(
  currentTime: string,
  wakeTime: string,
  pixelsPerHour: number = PIXELS_PER_HOUR
): number {
  const wakeMinutes = timeToMinutes(wakeTime);
  const currentMinutes = timeToMinutes(currentTime);
  const minutesSinceWake = currentMinutes - wakeMinutes;

  return (minutesSinceWake / 60) * pixelsPerHour;
}

/**
 * Check if two tasks overlap in time
 */
export function tasksOverlap(task1: Task, task2: Task): boolean {
  const start1 = timeToMinutes(task1.time);
  const end1 = task1.duration ? start1 + task1.duration : start1;

  const start2 = timeToMinutes(task2.time);
  const end2 = task2.duration ? start2 + task2.duration : start2;

  return (start1 < end2 && end1 > start2);
}

/**
 * Detect overlapping tasks (for warning/error handling)
 */
export function findOverlappingTasks(tasks: Task[]): Array<[Task, Task]> {
  const overlaps: Array<[Task, Task]> = [];

  for (let i = 0; i < tasks.length; i++) {
    for (let j = i + 1; j < tasks.length; j++) {
      if (tasksOverlap(tasks[i], tasks[j])) {
        overlaps.push([tasks[i], tasks[j]]);
      }
    }
  }

  return overlaps;
}

/**
 * Get scroll position to center a specific time
 */
export function getScrollToTime(
  targetTime: string,
  wakeTime: string,
  containerHeight: number,
  pixelsPerHour: number = PIXELS_PER_HOUR
): number {
  const y = calculateCurrentTimePosition(targetTime, wakeTime, pixelsPerHour);

  // Center the target time in the viewport
  return Math.max(0, y - containerHeight / 2);
}
