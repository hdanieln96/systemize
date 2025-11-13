/**
 * Habit Service - Database operations for habits
 */

import { getDatabase } from './database';
import { Habit, HabitType, RecurrenceType } from '@/types';

/**
 * Generate a unique ID for habits
 */
function generateId(): string {
  return `habit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Map database row to Habit object
 */
function mapRowToHabit(row: any): Habit {
  return {
    id: row.id,
    title: row.title,
    type: row.type as HabitType,
    icon: row.icon,
    color: row.color || undefined,
    category: row.category || undefined,
    time: row.time || undefined,
    timeWindow: row.time_window || undefined,
    frequencyType: row.frequency_type || undefined,
    weeklyTarget: row.weekly_target || undefined,
    recurrence: row.recurrence as RecurrenceType | undefined,
    customDays: row.custom_days ? JSON.parse(row.custom_days) : undefined,
    duration: row.duration || undefined,
    unitTarget: row.unit_target || undefined,
    unitType: row.unit_type || undefined,
    hasReminder: row.has_reminder === 1,
    notes: row.notes || undefined,
    replacementBehavior: row.replacement_behavior || undefined,
    startDate: row.start_date,
    endDate: row.end_date || undefined,
    currentStreak: row.current_streak || 0,
    longestStreak: row.longest_streak || 0,
    completedDates: [], // Will be populated by separate query
    relapseDates: row.type === 'breaking' ? [] : undefined, // Will be populated by separate query
    totalCompletions: row.total_completions || 0,
    completionRate: row.completion_rate || 0,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    isActive: row.is_active === 1,
  };
}

/**
 * Get completed dates for a habit
 */
async function getHabitCompletedDates(habitId: string): Promise<string[]> {
  const db = getDatabase();
  const result = await db.getAllAsync<{ date: string }>(
    'SELECT date FROM habit_completions WHERE habit_id = ? ORDER BY date DESC',
    [habitId]
  );
  return result.map((row) => row.date);
}

/**
 * Get relapse dates for a breaking habit
 */
async function getHabitRelapseDates(habitId: string): Promise<string[]> {
  const db = getDatabase();
  const result = await db.getAllAsync<{ date: string }>(
    'SELECT date FROM habit_relapses WHERE habit_id = ? ORDER BY date DESC',
    [habitId]
  );
  return result.map((row) => row.date);
}

/**
 * Create a new habit
 */
export async function createHabit(
  habitData: Omit<Habit, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> {
  const db = getDatabase();
  const id = generateId();
  const now = new Date().toISOString();

  await db.runAsync(
    `INSERT INTO habits (
      id, title, type, icon, color, category, time, time_window,
      frequency_type, weekly_target, recurrence, custom_days, duration,
      unit_target, unit_type, has_reminder, notes, replacement_behavior,
      start_date, end_date, current_streak, longest_streak, total_completions,
      completion_rate, is_active, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      habitData.title,
      habitData.type,
      habitData.icon,
      habitData.color || null,
      habitData.category || null,
      habitData.time || null,
      habitData.timeWindow || null,
      habitData.frequencyType || null,
      habitData.weeklyTarget || null,
      habitData.recurrence || null,
      habitData.customDays ? JSON.stringify(habitData.customDays) : null,
      habitData.duration || null,
      habitData.unitTarget || null,
      habitData.unitType || null,
      habitData.hasReminder ? 1 : 0,
      habitData.notes || null,
      habitData.replacementBehavior || null,
      habitData.startDate,
      habitData.endDate || null,
      habitData.currentStreak || 0,
      habitData.longestStreak || 0,
      habitData.totalCompletions || 0,
      habitData.completionRate || 0,
      habitData.isActive ? 1 : 0,
      now,
      now,
    ]
  );

  return id;
}

/**
 * Get a habit by ID
 */
export async function getHabitById(id: string): Promise<Habit | null> {
  const db = getDatabase();
  const row = await db.getFirstAsync<any>(
    'SELECT * FROM habits WHERE id = ?',
    [id]
  );

  if (!row) {
    return null;
  }

  const habit = mapRowToHabit(row);

  // Populate completed dates
  habit.completedDates = await getHabitCompletedDates(id);

  // Populate relapse dates for breaking habits
  if (habit.type === 'breaking') {
    habit.relapseDates = await getHabitRelapseDates(id);
  }

  return habit;
}

/**
 * Get all habits
 */
export async function getAllHabits(): Promise<Habit[]> {
  const db = getDatabase();
  const rows = await db.getAllAsync<any>(
    'SELECT * FROM habits ORDER BY created_at DESC'
  );

  const habits: Habit[] = [];

  for (const row of rows) {
    const habit = mapRowToHabit(row);
    habit.completedDates = await getHabitCompletedDates(habit.id);

    if (habit.type === 'breaking') {
      habit.relapseDates = await getHabitRelapseDates(habit.id);
    }

    habits.push(habit);
  }

  return habits;
}

/**
 * Get only active habits
 */
export async function getActiveHabits(): Promise<Habit[]> {
  const db = getDatabase();
  const rows = await db.getAllAsync<any>(
    'SELECT * FROM habits WHERE is_active = 1 ORDER BY created_at DESC'
  );

  const habits: Habit[] = [];

  for (const row of rows) {
    const habit = mapRowToHabit(row);
    habit.completedDates = await getHabitCompletedDates(habit.id);

    if (habit.type === 'breaking') {
      habit.relapseDates = await getHabitRelapseDates(habit.id);
    }

    habits.push(habit);
  }

  return habits;
}

/**
 * Update a habit
 */
export async function updateHabit(
  id: string,
  updates: Partial<Habit>
): Promise<void> {
  const db = getDatabase();
  const now = new Date().toISOString();

  // Build dynamic SET clause
  const setClauses: string[] = [];
  const values: any[] = [];

  if (updates.title !== undefined) {
    setClauses.push('title = ?');
    values.push(updates.title);
  }
  if (updates.type !== undefined) {
    setClauses.push('type = ?');
    values.push(updates.type);
  }
  if (updates.icon !== undefined) {
    setClauses.push('icon = ?');
    values.push(updates.icon);
  }
  if (updates.color !== undefined) {
    setClauses.push('color = ?');
    values.push(updates.color);
  }
  if (updates.category !== undefined) {
    setClauses.push('category = ?');
    values.push(updates.category);
  }
  if (updates.time !== undefined) {
    setClauses.push('time = ?');
    values.push(updates.time);
  }
  if (updates.timeWindow !== undefined) {
    setClauses.push('time_window = ?');
    values.push(updates.timeWindow);
  }
  if (updates.frequencyType !== undefined) {
    setClauses.push('frequency_type = ?');
    values.push(updates.frequencyType);
  }
  if (updates.weeklyTarget !== undefined) {
    setClauses.push('weekly_target = ?');
    values.push(updates.weeklyTarget);
  }
  if (updates.recurrence !== undefined) {
    setClauses.push('recurrence = ?');
    values.push(updates.recurrence);
  }
  if (updates.customDays !== undefined) {
    setClauses.push('custom_days = ?');
    values.push(JSON.stringify(updates.customDays));
  }
  if (updates.duration !== undefined) {
    setClauses.push('duration = ?');
    values.push(updates.duration);
  }
  if (updates.unitTarget !== undefined) {
    setClauses.push('unit_target = ?');
    values.push(updates.unitTarget);
  }
  if (updates.unitType !== undefined) {
    setClauses.push('unit_type = ?');
    values.push(updates.unitType);
  }
  if (updates.hasReminder !== undefined) {
    setClauses.push('has_reminder = ?');
    values.push(updates.hasReminder ? 1 : 0);
  }
  if (updates.notes !== undefined) {
    setClauses.push('notes = ?');
    values.push(updates.notes);
  }
  if (updates.replacementBehavior !== undefined) {
    setClauses.push('replacement_behavior = ?');
    values.push(updates.replacementBehavior);
  }
  if (updates.startDate !== undefined) {
    setClauses.push('start_date = ?');
    values.push(updates.startDate);
  }
  if (updates.endDate !== undefined) {
    setClauses.push('end_date = ?');
    values.push(updates.endDate);
  }
  if (updates.currentStreak !== undefined) {
    setClauses.push('current_streak = ?');
    values.push(updates.currentStreak);
  }
  if (updates.longestStreak !== undefined) {
    setClauses.push('longest_streak = ?');
    values.push(updates.longestStreak);
  }
  if (updates.totalCompletions !== undefined) {
    setClauses.push('total_completions = ?');
    values.push(updates.totalCompletions);
  }
  if (updates.completionRate !== undefined) {
    setClauses.push('completion_rate = ?');
    values.push(updates.completionRate);
  }
  if (updates.isActive !== undefined) {
    setClauses.push('is_active = ?');
    values.push(updates.isActive ? 1 : 0);
  }

  // Always update updated_at
  setClauses.push('updated_at = ?');
  values.push(now);

  // Add ID to WHERE clause
  values.push(id);

  await db.runAsync(
    `UPDATE habits SET ${setClauses.join(', ')} WHERE id = ?`,
    values
  );
}

/**
 * Delete a habit (soft delete - sets isActive to false)
 */
export async function deleteHabit(id: string): Promise<void> {
  const db = getDatabase();
  await db.runAsync('UPDATE habits SET is_active = 0 WHERE id = ?', [id]);
}

/**
 * Permanently delete a habit and all associated data
 */
export async function permanentlyDeleteHabit(id: string): Promise<void> {
  const db = getDatabase();
  // Foreign key cascade will delete completions and relapses
  await db.runAsync('DELETE FROM habits WHERE id = ?', [id]);
}

/**
 * Calculate streak from completion dates
 */
function calculateStreak(completedDates: string[]): number {
  if (completedDates.length === 0) return 0;

  // Sort dates in descending order
  const sortedDates = [...completedDates].sort((a, b) => b.localeCompare(a));

  let streak = 0;
  const today = new Date().toISOString().split('T')[0];
  let currentDate = new Date(today);

  for (const dateStr of sortedDates) {
    const expectedDate = currentDate.toISOString().split('T')[0];

    if (dateStr === expectedDate) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

/**
 * Log a habit completion (for building habits)
 */
export async function logHabitCompletion(
  habitId: string,
  date?: string,
  unitsCompleted?: number
): Promise<void> {
  const db = getDatabase();
  const completionDate = date || new Date().toISOString().split('T')[0];
  const now = new Date().toISOString();

  // Insert completion (UNIQUE constraint prevents duplicates)
  try {
    await db.runAsync(
      'INSERT INTO habit_completions (habit_id, date, completed_at, units_completed) VALUES (?, ?, ?, ?)',
      [habitId, completionDate, now, unitsCompleted || null]
    );
  } catch (error) {
    // If already completed for this date, ignore
    console.log('Completion already logged for this date');
    return;
  }

  // Get all completed dates
  const completedDates = await getHabitCompletedDates(habitId);

  // Calculate new streak
  const currentStreak = calculateStreak(completedDates);

  // Get existing longest streak
  const habit = await getHabitById(habitId);
  const longestStreak = habit
    ? Math.max(habit.longestStreak, currentStreak)
    : currentStreak;

  // Calculate completion rate
  const totalCompletions = completedDates.length;
  const daysSinceStart = habit
    ? Math.ceil(
        (new Date().getTime() - new Date(habit.startDate).getTime()) /
          (1000 * 60 * 60 * 24)
      ) + 1
    : 1;
  const completionRate = (totalCompletions / daysSinceStart) * 100;

  // Update habit stats
  await db.runAsync(
    `UPDATE habits SET
      current_streak = ?,
      longest_streak = ?,
      total_completions = ?,
      completion_rate = ?,
      updated_at = ?
    WHERE id = ?`,
    [currentStreak, longestStreak, totalCompletions, completionRate, now, habitId]
  );
}

/**
 * Remove a habit completion
 */
export async function removeHabitCompletion(
  habitId: string,
  date: string
): Promise<void> {
  const db = getDatabase();
  await db.runAsync(
    'DELETE FROM habit_completions WHERE habit_id = ? AND date = ?',
    [habitId, date]
  );

  // Recalculate stats
  const completedDates = await getHabitCompletedDates(habitId);
  const currentStreak = calculateStreak(completedDates);
  const totalCompletions = completedDates.length;

  const habit = await getHabitById(habitId);
  const daysSinceStart = habit
    ? Math.ceil(
        (new Date().getTime() - new Date(habit.startDate).getTime()) /
          (1000 * 60 * 60 * 24)
      ) + 1
    : 1;
  const completionRate = (totalCompletions / daysSinceStart) * 100;

  await db.runAsync(
    `UPDATE habits SET
      current_streak = ?,
      total_completions = ?,
      completion_rate = ?,
      updated_at = ?
    WHERE id = ?`,
    [currentStreak, totalCompletions, completionRate, new Date().toISOString(), habitId]
  );
}

/**
 * Log a habit relapse (for breaking habits)
 */
export async function logHabitRelapse(
  habitId: string,
  notes?: string
): Promise<void> {
  const db = getDatabase();
  const relapseDate = new Date().toISOString().split('T')[0];
  const now = new Date().toISOString();

  // Insert relapse
  await db.runAsync(
    'INSERT INTO habit_relapses (habit_id, date, logged_at, notes) VALUES (?, ?, ?, ?)',
    [habitId, relapseDate, now, notes || null]
  );

  // Reset streak to 0
  await db.runAsync(
    'UPDATE habits SET current_streak = 0, updated_at = ? WHERE id = ?',
    [now, habitId]
  );
}

/**
 * Get habit statistics for a date range
 */
export async function getHabitStats(
  habitId: string,
  startDate: string,
  endDate: string
): Promise<{
  completions: number;
  expectedDays: number;
  completionRate: number;
}> {
  const db = getDatabase();

  const result = await db.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM habit_completions WHERE habit_id = ? AND date BETWEEN ? AND ?',
    [habitId, startDate, endDate]
  );

  const completions = result?.count || 0;

  // Calculate expected days based on habit recurrence
  const habit = await getHabitById(habitId);
  if (!habit) {
    return { completions, expectedDays: 0, completionRate: 0 };
  }

  const start = new Date(startDate);
  const end = new Date(endDate);
  const daysDiff =
    Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

  let expectedDays = daysDiff;

  if (habit.recurrence === 'weekdays') {
    expectedDays = Math.floor((daysDiff / 7) * 5);
  } else if (habit.recurrence === 'weekends') {
    expectedDays = Math.floor((daysDiff / 7) * 2);
  } else if (habit.recurrence === 'custom' && habit.customDays) {
    expectedDays = Math.floor((daysDiff / 7) * habit.customDays.length);
  }

  const completionRate = expectedDays > 0 ? (completions / expectedDays) * 100 : 0;

  return { completions, expectedDays, completionRate };
}

export default {
  createHabit,
  getHabitById,
  getAllHabits,
  getActiveHabits,
  updateHabit,
  deleteHabit,
  permanentlyDeleteHabit,
  logHabitCompletion,
  removeHabitCompletion,
  logHabitRelapse,
  getHabitStats,
};
