import { Task } from '@/types';

/**
 * Mock data for Timeline UI development
 * This will be replaced with real data from Zustand store once data layer is complete
 */

// Generate tasks for a week (Nov 9-15, 2025)
export const mockTasks: Task[] = [
  // Sunday, Nov 9
  {
    id: '1',
    title: 'Rise and Shine',
    type: 'alarm',
    time: '06:00',
    icon: '🔔',
    isCompleted: true,
    isScheduled: true,
    date: '2025-11-09',
    createdAt: '2025-11-01T00:00:00Z',
    updatedAt: '2025-11-09T06:00:00Z',
  },
  {
    id: '2',
    title: 'Drink Water',
    type: 'habit',
    time: '07:00',
    icon: '💧',
    isCompleted: true,
    isScheduled: true,
    isRecurring: true,
    recurrence: 'daily',
    date: '2025-11-09',
    createdAt: '2025-11-01T00:00:00Z',
    updatedAt: '2025-11-09T07:00:00Z',
  },
  {
    id: '3',
    title: 'Answer Emails',
    type: 'timeblock',
    time: '07:30',
    endTime: '09:00',
    duration: 90,
    icon: '📧',
    isCompleted: false,
    isScheduled: true,
    date: '2025-11-09',
    createdAt: '2025-11-01T00:00:00Z',
    updatedAt: '2025-11-09T07:30:00Z',
  },

  // Monday, Nov 10
  {
    id: '4',
    title: 'Rise and Shine',
    type: 'alarm',
    time: '06:00',
    icon: '🔔',
    isCompleted: true,
    isScheduled: true,
    date: '2025-11-10',
    createdAt: '2025-11-01T00:00:00Z',
    updatedAt: '2025-11-10T06:00:00Z',
  },
  {
    id: '5',
    title: 'Drink Water',
    type: 'habit',
    time: '07:00',
    icon: '💧',
    isCompleted: true,
    isScheduled: true,
    isRecurring: true,
    recurrence: 'daily',
    date: '2025-11-10',
    createdAt: '2025-11-01T00:00:00Z',
    updatedAt: '2025-11-10T07:00:00Z',
  },
  {
    id: '6',
    title: 'Morning Workout',
    type: 'timeblock',
    time: '08:00',
    endTime: '09:00',
    duration: 60,
    icon: '💪',
    isCompleted: false,
    isScheduled: true,
    date: '2025-11-10',
    createdAt: '2025-11-01T00:00:00Z',
    updatedAt: '2025-11-10T08:00:00Z',
  },

  // Tuesday, Nov 11 (TODAY - most detailed)
  {
    id: '7',
    title: 'Rise and Shine',
    type: 'alarm',
    time: '06:00',
    icon: '🔔',
    isCompleted: true,
    isScheduled: true,
    date: '2025-11-11',
    createdAt: '2025-11-01T00:00:00Z',
    updatedAt: '2025-11-11T06:00:00Z',
  },
  {
    id: '8',
    title: 'Drink Water',
    type: 'habit',
    time: '07:00',
    icon: '💧',
    isCompleted: true,
    isScheduled: true,
    isRecurring: true,
    recurrence: 'daily',
    date: '2025-11-11',
    createdAt: '2025-11-01T00:00:00Z',
    updatedAt: '2025-11-11T07:00:00Z',
  },
  {
    id: '9',
    title: 'Answer Emails',
    type: 'timeblock',
    time: '07:30',
    endTime: '09:00',
    duration: 90,
    icon: '📧',
    isCompleted: false,
    isScheduled: true,
    date: '2025-11-11',
    createdAt: '2025-11-01T00:00:00Z',
    updatedAt: '2025-11-11T07:30:00Z',
  },
  {
    id: '10',
    title: 'Team Meeting',
    type: 'timeblock',
    time: '10:00',
    endTime: '11:00',
    duration: 60,
    icon: '👥',
    isCompleted: false,
    isScheduled: true,
    date: '2025-11-11',
    createdAt: '2025-11-01T00:00:00Z',
    updatedAt: '2025-11-11T10:00:00Z',
  },
  {
    id: '11',
    title: 'Lunch Break',
    type: 'alarm',
    time: '12:00',
    icon: '🍽️',
    isCompleted: false,
    isScheduled: true,
    date: '2025-11-11',
    createdAt: '2025-11-01T00:00:00Z',
    updatedAt: '2025-11-11T12:00:00Z',
  },
  {
    id: '12',
    title: 'Deep Work Session',
    type: 'timeblock',
    time: '14:00',
    endTime: '16:00',
    duration: 120,
    icon: '💻',
    isCompleted: false,
    isScheduled: true,
    date: '2025-11-11',
    createdAt: '2025-11-01T00:00:00Z',
    updatedAt: '2025-11-11T14:00:00Z',
  },
  {
    id: '13',
    title: 'Evening Walk',
    type: 'habit',
    time: '18:00',
    icon: '🚶',
    isCompleted: false,
    isScheduled: true,
    isRecurring: true,
    recurrence: 'daily',
    date: '2025-11-11',
    createdAt: '2025-11-01T00:00:00Z',
    updatedAt: '2025-11-11T18:00:00Z',
  },

  // Wednesday, Nov 12
  {
    id: '14',
    title: 'Rise and Shine',
    type: 'alarm',
    time: '06:00',
    icon: '🔔',
    isCompleted: false,
    isScheduled: true,
    date: '2025-11-12',
    createdAt: '2025-11-01T00:00:00Z',
    updatedAt: '2025-11-12T06:00:00Z',
  },
  {
    id: '15',
    title: 'Drink Water',
    type: 'habit',
    time: '07:00',
    icon: '💧',
    isCompleted: false,
    isScheduled: true,
    isRecurring: true,
    recurrence: 'daily',
    date: '2025-11-12',
    createdAt: '2025-11-01T00:00:00Z',
    updatedAt: '2025-11-12T07:00:00Z',
  },
  {
    id: '16',
    title: 'Client Call',
    type: 'timeblock',
    time: '09:00',
    endTime: '10:00',
    duration: 60,
    icon: '📞',
    isCompleted: false,
    isScheduled: true,
    date: '2025-11-12',
    createdAt: '2025-11-01T00:00:00Z',
    updatedAt: '2025-11-12T09:00:00Z',
  },

  // Thursday-Saturday (simpler schedules)
  ...generateSimpleDay('2025-11-13', 17),
  ...generateSimpleDay('2025-11-14', 20),
  ...generateSimpleDay('2025-11-15', 23),
];

function generateSimpleDay(date: string, startId: number): Task[] {
  return [
    {
      id: `${startId}`,
      title: 'Rise and Shine',
      type: 'alarm' as const,
      time: '06:00',
      icon: '🔔',
      isCompleted: false,
      isScheduled: true,
      date,
      createdAt: '2025-11-01T00:00:00Z',
      updatedAt: `${date}T06:00:00Z`,
    },
    {
      id: `${startId + 1}`,
      title: 'Drink Water',
      type: 'habit' as const,
      time: '07:00',
      icon: '💧',
      isCompleted: false,
      isScheduled: true,
      isRecurring: true,
      recurrence: 'daily' as const,
      date,
      createdAt: '2025-11-01T00:00:00Z',
      updatedAt: `${date}T07:00:00Z`,
    },
    {
      id: `${startId + 2}`,
      title: 'Work Session',
      type: 'timeblock' as const,
      time: '09:00',
      endTime: '12:00',
      duration: 180,
      icon: '💼',
      isCompleted: false,
      isScheduled: true,
      date,
      createdAt: '2025-11-01T00:00:00Z',
      updatedAt: `${date}T09:00:00Z`,
    },
  ];
}

// Mock settings
export const mockSettings = {
  wakeTime: '06:00',
  sleepTime: '23:00',
  notificationsEnabled: true,
  notificationAdvanceMinutes: 5,
  theme: 'light' as const,
  showCompletedTasks: true,
};

// Helper to get tasks for a specific date
export function getTasksForDate(date: string): Task[] {
  return mockTasks.filter(task => task.date === date).sort((a, b) => {
    return a.time.localeCompare(b.time);
  });
}

// Helper to get week dates with optional offset (Sun-Sat)
// offset: 0 = current week, -1 = last week, +1 = next week
export function getWeekDates(weekOffset: number = 0): string[] {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Sunday, 6 = Saturday

  // Calculate Sunday of target week
  const sunday = new Date(today);
  sunday.setDate(today.getDate() - dayOfWeek + (weekOffset * 7));

  // Generate array of 7 dates (Sun-Sat)
  const weekDates: string[] = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(sunday);
    date.setDate(sunday.getDate() + i);

    // Format as YYYY-MM-DD
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    weekDates.push(`${year}-${month}-${day}`);
  }

  return weekDates;
}

// Backwards compatibility - get current week dates
export function getCurrentWeekDates(): string[] {
  return getWeekDates(0);
}
