// Core type definitions for LifePlanner

export type TaskType = 'alarm' | 'habit' | 'timeblock';
export type HabitType = 'building' | 'breaking';
export type RecurrenceType = 'daily' | 'weekdays' | 'weekends' | 'custom';

export interface Task {
  id: string;
  title: string;
  type: TaskType;
  time: string; // HH:MM format (24-hour)
  icon: string; // Emoji or icon identifier
  color?: string; // Hex color code
  isCompleted: boolean;
  isScheduled: boolean;

  // For recurring tasks (habits)
  isRecurring?: boolean;
  recurrence?: RecurrenceType;
  customDays?: number[]; // [1,3,5] = Mon, Wed, Fri (1=Monday, 7=Sunday)

  // For time blocks
  duration?: number; // Duration in minutes
  endTime?: string; // HH:MM format

  // Additional details
  notes?: string; // Optional notes/description for the task
  notifications?: number[]; // Minutes before event to notify [0, 5, 10, 15, 30]

  // Todo Screen features (Phase 1)
  subtasks?: Subtask[]; // Array of subtasks for this task
  priority?: boolean; // true = high priority, false/undefined = normal
  reminderDatetime?: string; // ISO 8601 datetime for reminder notification
  tags?: string[]; // Array of tag names (e.g., ["Work", "Urgent"])

  // Metadata
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  date: string; // ISO date string (YYYY-MM-DD) - which day this task is for
}

export interface Subtask {
  id: string; // Unique ID for subtask
  title: string; // Subtask description
  isCompleted: boolean; // Completion status
  order: number; // Display order (0-indexed)
}

export interface Habit {
  id: string;
  title: string;
  type: HabitType; // 'building' or 'breaking'
  icon: string; // Emoji
  color?: string; // Hex color code

  // NEW: Organization
  category?: 'health' | 'mind' | 'work' | 'social' | 'finance' | 'other';

  // Scheduling (building habits only)
  time?: string; // HH:MM - specific time
  timeWindow?: 'morning' | 'afternoon' | 'evening' | 'anytime'; // NEW: Flexible time window

  // NEW: Flexible frequency
  frequencyType?: 'daily' | 'weekly' | 'custom_days';
  weeklyTarget?: number; // NEW: e.g., 4 (for "4x per week")
  recurrence?: RecurrenceType;
  customDays?: number[]; // [0-6] Sunday = 0

  // NEW: Goal setting
  duration?: string; // NEW: e.g., "30 minutes", "8 glasses", "20 pages"
  unitTarget?: number; // NEW: e.g., 8 (for quantifiable goals like "8 glasses")
  unitType?: string; // NEW: e.g., "glasses", "minutes", "pages", "reps", "servings"

  // NEW: Notifications
  hasReminder?: boolean; // NEW: Toggle reminder notifications

  // NEW: Context and motivation
  notes?: string; // NEW: Why I'm doing this
  replacementBehavior?: string; // NEW: For breaking habits - what to do instead

  // Tracking
  startDate: string; // YYYY-MM-DD when habit started
  endDate?: string; // NEW: Optional end date for time-bound challenges (e.g., "30-day challenge")
  currentStreak: number; // Current consecutive days
  longestStreak: number; // Best streak ever

  // Completions (building habits) - dates when completed
  completedDates: string[]; // ["2025-11-11", "2025-11-10", ...]

  // Relapses (breaking habits) - dates when relapsed
  relapseDates?: string[]; // ["2025-10-15", "2025-09-20", ...]

  // Stats
  totalCompletions: number; // Total successful days
  completionRate: number; // Percentage (0-100)

  // Metadata
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

export interface HabitCompletion {
  id: number;
  habitId: string;
  date: string; // YYYY-MM-DD
  completedAt: string; // ISO timestamp
  unitsCompleted?: number; // NEW: For unit-based tracking (e.g., "5 glasses out of 8")
}

export interface HabitRelapse {
  id: number;
  habitId: string;
  date: string; // YYYY-MM-DD
  loggedAt: string; // ISO timestamp
  notes?: string; // Optional notes about why
}

export interface AppSettings {
  wakeTime: string; // HH:MM
  sleepTime: string; // HH:MM
  notificationsEnabled: boolean;
  notificationAdvanceMinutes: number; // How many minutes before task to notify
  theme: 'light' | 'dark' | 'auto';
  showCompletedTasks: boolean;
}

// Navigation types
export type RootStackParamList = {
  Todo: undefined;
  Timeline: undefined;
  Habits: undefined;
  Settings: undefined;
  TaskEdit: { taskId?: string; date?: string }; // Create or edit
  HabitEdit: { habitId?: string }; // Create or edit
  HabitDetail: { habitId: string };
};
