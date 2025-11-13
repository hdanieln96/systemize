/**
 * Mock Data Generator
 * Generates sample tasks for testing the timeline UI
 */

import { Task } from '@types/index';
import { formatDate, parseDate, addDays } from 'date-fns';

/**
 * Generate a unique ID for mock tasks
 */
function generateId(): string {
  return `mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Sample task templates for different times of day
 */
const morningTasks = [
  { title: '🌅 Wake Up & Meditate', icon: '🌅', time: '07:00', duration: 15 },
  { title: '🏃 Morning Run', icon: '🏃', time: '07:30', duration: 30 },
  { title: '🥗 Healthy Breakfast', icon: '🥗', time: '08:00', duration: 20 },
  { title: '📖 Read Book', icon: '📖', time: '08:30', duration: 30 },
  { title: '🚿 Shower & Get Ready', icon: '🚿', time: '09:00', duration: 20 },
];

const workTasks = [
  { title: '💼 Team Standup', icon: '💼', time: '09:30', duration: 15 },
  { title: '📧 Check Emails', icon: '📧', time: '10:00', duration: 90 },
  { title: '☕ Coffee Break', icon: '☕', time: '11:30', duration: 15 },
  { title: '🧑‍💻 Deep Work Session', icon: '🧑‍💻', time: '12:00', duration: 120 },
  { title: '🥙 Lunch Break', icon: '🥙', time: '14:00', duration: 45 },
  { title: '📞 Client Calls', icon: '📞', time: '15:00', duration: 60 },
  { title: '📝 Documentation', icon: '📝', time: '16:00', duration: 60 },
  { title: '👥 Team Meeting', icon: '👥', time: '17:00', duration: 30 },
];

const eveningTasks = [
  { title: '🏋️ Gym Workout', icon: '🏋️', time: '18:00', duration: 60 },
  { title: '🍲 Dinner Prep & Eat', icon: '🍲', time: '19:00', duration: 60 },
  { title: '📺 Relax & Unwind', icon: '📺', time: '20:00', duration: 90 },
  { title: '📚 Evening Reading', icon: '📚', time: '21:30', duration: 30 },
  { title: '🛁 Night Routine', icon: '🛁', time: '22:00', duration: 20 },
  { title: '😴 Sleep', icon: '😴', time: '22:30', duration: 0 },
];

const weekendTasks = [
  { title: '🌅 Sleep In', icon: '🌅', time: '09:00', duration: 0 },
  { title: '🥞 Brunch', icon: '🥞', time: '10:00', duration: 45 },
  { title: '🧹 House Cleaning', icon: '🧹', time: '11:00', duration: 90 },
  { title: '🛒 Grocery Shopping', icon: '🛒', time: '13:00', duration: 60 },
  { title: '👨‍👩‍👧 Family Time', icon: '👨‍👩‍👧', time: '15:00', duration: 120 },
  { title: '🎮 Gaming/Hobbies', icon: '🎮', time: '17:00', duration: 90 },
  { title: '🍕 Dinner Out', icon: '🍕', time: '19:00', duration: 90 },
  { title: '🎬 Movie Night', icon: '🎬', time: '21:00', duration: 120 },
];

/**
 * Generate tasks for a specific date
 */
export function generateTasksForDate(
  date: string,
  options: {
    includeCompleted?: boolean;
    completionRate?: number; // 0.0 to 1.0
    isWeekend?: boolean;
  } = {}
): Omit<Task, 'id' | 'createdAt' | 'updatedAt'>[] {
  const {
    includeCompleted = true,
    completionRate = 0.6,
    isWeekend = false,
  } = options;

  // Select task templates based on day type
  const taskTemplates = isWeekend
    ? weekendTasks
    : [...morningTasks, ...workTasks, ...eveningTasks];

  // Generate tasks
  const tasks = taskTemplates.map((template) => {
    const task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'> = {
      title: template.title,
      type: template.duration === 0 ? 'alarm' : 'timeblock',
      time: template.time,
      icon: template.icon,
      isCompleted: includeCompleted ? Math.random() < completionRate : false,
      isScheduled: true,
      isRecurring: false,
      duration: template.duration > 0 ? template.duration : undefined,
      date: date,
    };

    // Calculate end time for time blocks
    if (task.duration && task.duration > 0) {
      const [hours, minutes] = task.time.split(':').map(Number);
      const totalMinutes = hours * 60 + minutes + task.duration;
      const endHours = Math.floor(totalMinutes / 60) % 24;
      const endMinutes = totalMinutes % 60;
      task.endTime = `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
    }

    return task;
  });

  return tasks;
}

/**
 * Generate tasks for an entire week
 */
export function generateWeekTasks(
  startDate: Date,
  options: {
    includeCompleted?: boolean;
    completionRate?: number;
  } = {}
): Omit<Task, 'id' | 'createdAt' | 'updatedAt'>[] {
  const allTasks: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>[] = [];

  for (let i = 0; i < 7; i++) {
    const currentDate = addDays(startDate, i);
    const dateString = formatDate(currentDate, 'yyyy-MM-dd');
    const isWeekend = currentDate.getDay() === 0 || currentDate.getDay() === 6;

    const dayTasks = generateTasksForDate(dateString, {
      ...options,
      isWeekend,
    });

    allTasks.push(...dayTasks);
  }

  return allTasks;
}

/**
 * Generate a realistic daily schedule with varied task types
 */
export function generateRealisticDay(date: string): Omit<Task, 'id' | 'createdAt' | 'updatedAt'>[] {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinutes = now.getMinutes();
  const currentTotalMinutes = currentHour * 60 + currentMinutes;

  const tasks: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>[] = [
    {
      title: '🌅 Wake Up',
      type: 'alarm',
      time: '07:00',
      icon: '🌅',
      isCompleted: currentTotalMinutes >= 420, // 7:00 AM
      isScheduled: true,
      isRecurring: true,
      recurrence: 'daily',
      date: date,
    },
    {
      title: '🧘 Morning Meditation',
      type: 'habit',
      time: '07:15',
      icon: '🧘',
      isCompleted: currentTotalMinutes >= 435,
      isScheduled: true,
      isRecurring: true,
      recurrence: 'daily',
      duration: 15,
      endTime: '07:30',
      date: date,
    },
    {
      title: '📧 Email & Planning',
      type: 'timeblock',
      time: '09:00',
      icon: '📧',
      isCompleted: currentTotalMinutes >= 630,
      isScheduled: true,
      isRecurring: false,
      duration: 90,
      endTime: '10:30',
      date: date,
    },
    {
      title: '☕ Coffee Break',
      type: 'alarm',
      time: '10:30',
      icon: '☕',
      isCompleted: currentTotalMinutes >= 630,
      isScheduled: true,
      isRecurring: false,
      date: date,
    },
    {
      title: '🧑‍💻 Deep Work',
      type: 'timeblock',
      time: '11:00',
      icon: '🧑‍💻',
      isCompleted: currentTotalMinutes >= 780,
      isScheduled: true,
      isRecurring: false,
      duration: 120,
      endTime: '13:00',
      date: date,
    },
    {
      title: '🥙 Lunch',
      type: 'timeblock',
      time: '13:00',
      icon: '🥙',
      isCompleted: currentTotalMinutes >= 780,
      isScheduled: true,
      isRecurring: true,
      recurrence: 'daily',
      duration: 45,
      endTime: '13:45',
      date: date,
    },
    {
      title: '📞 Meetings',
      type: 'timeblock',
      time: '14:00',
      icon: '📞',
      isCompleted: currentTotalMinutes >= 900,
      isScheduled: true,
      isRecurring: false,
      duration: 90,
      endTime: '15:30',
      date: date,
    },
    {
      title: '🏋️ Gym',
      type: 'timeblock',
      time: '18:00',
      icon: '🏋️',
      isCompleted: currentTotalMinutes >= 1080,
      isScheduled: true,
      isRecurring: true,
      recurrence: 'weekdays',
      duration: 60,
      endTime: '19:00',
      date: date,
    },
    {
      title: '🍲 Dinner',
      type: 'timeblock',
      time: '19:30',
      icon: '🍲',
      isCompleted: currentTotalMinutes >= 1170,
      isScheduled: true,
      isRecurring: true,
      recurrence: 'daily',
      duration: 45,
      endTime: '20:15',
      date: date,
    },
    {
      title: '📚 Reading',
      type: 'habit',
      time: '21:00',
      icon: '📚',
      isCompleted: currentTotalMinutes >= 1260,
      isScheduled: true,
      isRecurring: true,
      recurrence: 'daily',
      duration: 30,
      endTime: '21:30',
      date: date,
    },
    {
      title: '😴 Sleep',
      type: 'alarm',
      time: '22:30',
      icon: '😴',
      isCompleted: false,
      isScheduled: true,
      isRecurring: true,
      recurrence: 'daily',
      date: date,
    },
  ];

  return tasks;
}

/**
 * Generate a minimal test schedule
 */
export function generateMinimalDay(date: string): Omit<Task, 'id' | 'createdAt' | 'updatedAt'>[] {
  return [
    {
      title: '🌅 Wake Up',
      type: 'alarm',
      time: '08:00',
      icon: '🌅',
      isCompleted: true,
      isScheduled: true,
      isRecurring: false,
      date: date,
    },
    {
      title: '🧑‍💻 Work Block',
      type: 'timeblock',
      time: '09:00',
      icon: '🧑‍💻',
      isCompleted: false,
      isScheduled: true,
      isRecurring: false,
      duration: 180, // 3 hours
      endTime: '12:00',
      date: date,
    },
    {
      title: '🥙 Lunch',
      type: 'timeblock',
      time: '12:00',
      icon: '🥙',
      isCompleted: false,
      isScheduled: true,
      isRecurring: false,
      duration: 60,
      endTime: '13:00',
      date: date,
    },
    {
      title: '😴 Sleep',
      type: 'alarm',
      time: '22:00',
      icon: '😴',
      isCompleted: false,
      isScheduled: true,
      isRecurring: false,
      date: date,
    },
  ];
}

/**
 * Default wake and sleep times for testing
 */
export const DEFAULT_WAKE_TIME = '07:00';
export const DEFAULT_SLEEP_TIME = '22:30';

/**
 * Sample preferences for testing
 */
export const MOCK_PREFERENCES = {
  wakeTime: DEFAULT_WAKE_TIME,
  sleepTime: DEFAULT_SLEEP_TIME,
  theme: 'deepOceanBlue',
  pixelsPerHour: 120,
};
