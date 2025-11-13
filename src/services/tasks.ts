/**
 * Task CRUD Service
 * Database operations for tasks
 */

import { getDatabase } from './database';
import { Task } from '@/types';
import { format } from 'date-fns';

/**
 * Create a new task
 */
export async function createTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const db = getDatabase();
  const now = new Date().toISOString();
  const id = `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  await db.runAsync(
    `INSERT INTO tasks (
      id, title, type, time, icon, color, is_completed, is_scheduled,
      is_recurring, recurrence, custom_days, duration, end_time, date,
      notes, notifications, subtasks, priority, reminder_datetime, tags,
      created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      task.title,
      task.type,
      task.time,
      task.icon,
      task.color || null,
      task.isCompleted ? 1 : 0,
      task.isScheduled ? 1 : 0,
      task.isRecurring ? 1 : 0,
      task.recurrence || null,
      task.customDays ? JSON.stringify(task.customDays) : null,
      task.duration || null,
      task.endTime || null,
      task.date,
      task.notes || null,
      task.notifications ? JSON.stringify(task.notifications) : null,
      task.subtasks ? JSON.stringify(task.subtasks) : null,
      task.priority ? 1 : 0,
      task.reminderDatetime || null,
      task.tags ? JSON.stringify(task.tags) : null,
      now,
      now,
    ]
  );

  return id;
}

/**
 * Get task by ID
 */
export async function getTaskById(id: string): Promise<Task | null> {
  const db = getDatabase();
  const row = await db.getFirstAsync<any>(
    'SELECT * FROM tasks WHERE id = ?',
    [id]
  );

  if (!row) return null;

  return mapRowToTask(row);
}

/**
 * Get all tasks for a specific date
 */
export async function getTasksForDate(date: string): Promise<Task[]> {
  const db = getDatabase();
  const rows = await db.getAllAsync<any>(
    'SELECT * FROM tasks WHERE date = ? ORDER BY time ASC',
    [date]
  );

  return rows.map(mapRowToTask);
}

/**
 * Get tasks for a date range (for weekly view)
 */
export async function getTasksForDateRange(startDate: string, endDate: string): Promise<Task[]> {
  const db = getDatabase();
  const rows = await db.getAllAsync<any>(
    'SELECT * FROM tasks WHERE date >= ? AND date <= ? ORDER BY date ASC, time ASC',
    [startDate, endDate]
  );

  return rows.map(mapRowToTask);
}

/**
 * Update a task
 */
export async function updateTask(id: string, updates: Partial<Task>): Promise<void> {
  const db = getDatabase();
  const now = new Date().toISOString();

  // Build dynamic SET clause
  const fields: string[] = [];
  const values: any[] = [];

  if (updates.title !== undefined) {
    fields.push('title = ?');
    values.push(updates.title);
  }
  if (updates.type !== undefined) {
    fields.push('type = ?');
    values.push(updates.type);
  }
  if (updates.time !== undefined) {
    fields.push('time = ?');
    values.push(updates.time);
  }
  if (updates.icon !== undefined) {
    fields.push('icon = ?');
    values.push(updates.icon);
  }
  if (updates.color !== undefined) {
    fields.push('color = ?');
    values.push(updates.color);
  }
  if (updates.isCompleted !== undefined) {
    fields.push('is_completed = ?');
    values.push(updates.isCompleted ? 1 : 0);
  }
  if (updates.isScheduled !== undefined) {
    fields.push('is_scheduled = ?');
    values.push(updates.isScheduled ? 1 : 0);
  }
  if (updates.isRecurring !== undefined) {
    fields.push('is_recurring = ?');
    values.push(updates.isRecurring ? 1 : 0);
  }
  if (updates.recurrence !== undefined) {
    fields.push('recurrence = ?');
    values.push(updates.recurrence);
  }
  if (updates.customDays !== undefined) {
    fields.push('custom_days = ?');
    values.push(updates.customDays ? JSON.stringify(updates.customDays) : null);
  }
  if (updates.duration !== undefined) {
    fields.push('duration = ?');
    values.push(updates.duration);
  }
  if (updates.endTime !== undefined) {
    fields.push('end_time = ?');
    values.push(updates.endTime);
  }
  if (updates.date !== undefined) {
    fields.push('date = ?');
    values.push(updates.date);
  }
  if (updates.notes !== undefined) {
    fields.push('notes = ?');
    values.push(updates.notes || null);
  }
  if (updates.notifications !== undefined) {
    fields.push('notifications = ?');
    values.push(updates.notifications ? JSON.stringify(updates.notifications) : null);
  }
  if (updates.subtasks !== undefined) {
    fields.push('subtasks = ?');
    values.push(updates.subtasks ? JSON.stringify(updates.subtasks) : null);
  }
  if (updates.priority !== undefined) {
    fields.push('priority = ?');
    values.push(updates.priority ? 1 : 0);
  }
  if (updates.reminderDatetime !== undefined) {
    fields.push('reminder_datetime = ?');
    values.push(updates.reminderDatetime || null);
  }
  if (updates.tags !== undefined) {
    fields.push('tags = ?');
    values.push(updates.tags ? JSON.stringify(updates.tags) : null);
  }

  if (fields.length === 0) {
    return; // No updates to make
  }

  // Always update updated_at
  fields.push('updated_at = ?');
  values.push(now);

  // Add id to the end
  values.push(id);

  const query = `UPDATE tasks SET ${fields.join(', ')} WHERE id = ?`;
  await db.runAsync(query, values);
}

/**
 * Delete a task
 */
export async function deleteTask(id: string): Promise<void> {
  const db = getDatabase();
  await db.runAsync('DELETE FROM tasks WHERE id = ?', [id]);
}

/**
 * Toggle task completion status
 */
export async function toggleTaskCompletion(id: string): Promise<boolean> {
  const db = getDatabase();
  const task = await getTaskById(id);

  if (!task) {
    throw new Error('Task not found');
  }

  const newStatus = !task.isCompleted;
  await updateTask(id, { isCompleted: newStatus });

  return newStatus;
}

/**
 * Get unscheduled tasks (for Todo screen)
 */
export async function getUnscheduledTasks(): Promise<Task[]> {
  const db = getDatabase();
  const rows = await db.getAllAsync<any>(
    'SELECT * FROM tasks WHERE is_scheduled = 0 ORDER BY created_at DESC'
  );
  return rows.map(mapRowToTask);
}

/**
 * Get all tasks (for debugging)
 */
export async function getAllTasks(): Promise<Task[]> {
  const db = getDatabase();
  const rows = await db.getAllAsync<any>('SELECT * FROM tasks ORDER BY date ASC, time ASC');
  return rows.map(mapRowToTask);
}

/**
 * Delete all tasks (for debugging/testing)
 */
export async function deleteAllTasks(): Promise<void> {
  const db = getDatabase();
  await db.runAsync('DELETE FROM tasks');
}

/**
 * Helper: Map database row to Task object
 */
function mapRowToTask(row: any): Task {
  return {
    id: row.id,
    title: row.title,
    type: row.type,
    time: row.time,
    icon: row.icon,
    color: row.color,
    isCompleted: row.is_completed === 1,
    isScheduled: row.is_scheduled === 1,
    isRecurring: row.is_recurring === 1,
    recurrence: row.recurrence,
    customDays: row.custom_days ? JSON.parse(row.custom_days) : undefined,
    duration: row.duration,
    endTime: row.end_time,
    date: row.date,
    notes: row.notes,
    notifications: row.notifications ? JSON.parse(row.notifications) : undefined,
    subtasks: row.subtasks ? JSON.parse(row.subtasks) : undefined,
    priority: row.priority === 1,
    reminderDatetime: row.reminder_datetime,
    tags: row.tags ? JSON.parse(row.tags) : undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
