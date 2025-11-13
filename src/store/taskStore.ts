/**
 * Task Store - Zustand State Management
 * Manages tasks, selected date, and task operations
 */

import { create } from 'zustand';
import { Task, Subtask } from '@/types';
import {
  createTask,
  getTaskById,
  getTasksForDate,
  getTasksForDateRange,
  updateTask,
  deleteTask,
  toggleTaskCompletion,
  getUnscheduledTasks,
} from '@services/tasks';
import { formatDate, getTodayString, getWeekRange, parseDate } from '@utils/timeUtils';

interface TaskStore {
  // State
  tasks: Task[];
  selectedDate: string; // YYYY-MM-DD format
  isLoading: boolean;
  error: string | null;

  // Computed
  currentDayTasks: () => Task[];
  weekTasks: () => Task[];
  unscheduledTasks: () => Task[];
  unscheduledPriorityTasks: () => Task[];
  unscheduledWithNotes: () => Task[];
  unscheduledByTag: (tag: string) => Task[];

  // Actions
  setSelectedDate: (date: string) => void;
  loadTasksForDate: (date: string) => Promise<void>;
  loadTasksForWeek: (date: string) => Promise<void>;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  removeTask: (id: string) => Promise<void>;
  toggleCompletion: (id: string) => Promise<void>;
  refreshTasks: () => Promise<void>;
  updateSubtasks: (taskId: string, subtasks: Subtask[]) => Promise<void>;
  togglePriority: (taskId: string) => Promise<void>;
  setReminder: (taskId: string, datetime: string | null) => Promise<void>;
  addTag: (taskId: string, tag: string) => Promise<void>;
  removeTag: (taskId: string, tag: string) => Promise<void>;
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  // Initial state
  tasks: [],
  selectedDate: getTodayString(),
  isLoading: false,
  error: null,

  // Computed values
  currentDayTasks: () => {
    const { tasks, selectedDate } = get();
    return tasks
      .filter((task) => task.date === selectedDate)
      .sort((a, b) => a.time.localeCompare(b.time));
  },

  weekTasks: () => {
    const { tasks } = get();
    return tasks.sort((a, b) => {
      // Sort by date first, then by time
      if (a.date !== b.date) {
        return a.date.localeCompare(b.date);
      }
      return a.time.localeCompare(b.time);
    });
  },

  unscheduledTasks: () => {
    const { tasks } = get();
    return tasks
      .filter((task) => !task.isScheduled)
      .sort((a, b) => {
        // Priority tasks first
        if (a.priority !== b.priority) {
          return a.priority ? -1 : 1;
        }
        // Then by creation date (newest first)
        return b.createdAt.localeCompare(a.createdAt);
      });
  },

  unscheduledPriorityTasks: () => {
    const { tasks } = get();
    return tasks
      .filter((task) => !task.isScheduled && task.priority)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },

  unscheduledWithNotes: () => {
    const { tasks } = get();
    return tasks
      .filter((task) => !task.isScheduled && (task.notes || (task.subtasks && task.subtasks.length > 0)))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },

  unscheduledByTag: (tag: string) => {
    const { tasks } = get();
    return tasks
      .filter((task) => !task.isScheduled && task.tags?.includes(tag))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },

  // Actions
  setSelectedDate: (date: string) => {
    set({ selectedDate: date });
    // Auto-load tasks for the new date
    get().loadTasksForDate(date);
  },

  loadTasksForDate: async (date: string) => {
    set({ isLoading: true, error: null });
    try {
      const tasks = await getTasksForDate(date);
      set({ tasks, isLoading: false });
    } catch (error) {
      console.error('Error loading tasks for date:', error);
      set({
        error: error instanceof Error ? error.message : 'Failed to load tasks',
        isLoading: false,
      });
    }
  },

  loadTasksForWeek: async (date: string) => {
    set({ isLoading: true, error: null });
    try {
      const dateObj = parseDate(date);
      const { start, end } = getWeekRange(dateObj);
      const startStr = formatDate(start);
      const endStr = formatDate(end);

      const tasks = await getTasksForDateRange(startStr, endStr);
      set({ tasks, isLoading: false });
    } catch (error) {
      console.error('Error loading tasks for week:', error);
      set({
        error: error instanceof Error ? error.message : 'Failed to load tasks',
        isLoading: false,
      });
    }
  },

  addTask: async (taskData) => {
    set({ isLoading: true, error: null });
    try {
      const id = await createTask(taskData);

      // Reload tasks for current selection
      await get().refreshTasks();

      set({ isLoading: false });
      return id;
    } catch (error) {
      console.error('Error creating task:', error);
      set({
        error: error instanceof Error ? error.message : 'Failed to create task',
        isLoading: false,
      });
      throw error;
    }
  },

  updateTask: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      await updateTask(id, updates);

      // Update local state optimistically
      set((state) => ({
        tasks: state.tasks.map((task) =>
          task.id === id ? { ...task, ...updates, updatedAt: new Date().toISOString() } : task
        ),
        isLoading: false,
      }));
    } catch (error) {
      console.error('Error updating task:', error);
      set({
        error: error instanceof Error ? error.message : 'Failed to update task',
        isLoading: false,
      });
      // Refresh to get correct state from DB
      await get().refreshTasks();
      throw error;
    }
  },

  removeTask: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await deleteTask(id);

      // Remove from local state
      set((state) => ({
        tasks: state.tasks.filter((task) => task.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      console.error('Error deleting task:', error);
      set({
        error: error instanceof Error ? error.message : 'Failed to delete task',
        isLoading: false,
      });
      throw error;
    }
  },

  toggleCompletion: async (id) => {
    try {
      const newStatus = await toggleTaskCompletion(id);

      // Update local state optimistically
      set((state) => ({
        tasks: state.tasks.map((task) =>
          task.id === id
            ? { ...task, isCompleted: newStatus, updatedAt: new Date().toISOString() }
            : task
        ),
      }));
    } catch (error) {
      console.error('Error toggling task completion:', error);
      set({
        error: error instanceof Error ? error.message : 'Failed to toggle task',
      });
      // Refresh to get correct state from DB
      await get().refreshTasks();
      throw error;
    }
  },

  refreshTasks: async () => {
    const { selectedDate } = get();
    await get().loadTasksForWeek(selectedDate);
  },

  updateSubtasks: async (taskId: string, subtasks: Subtask[]) => {
    await get().updateTask(taskId, { subtasks });
  },

  togglePriority: async (taskId: string) => {
    const task = get().tasks.find((t) => t.id === taskId);
    if (task) {
      await get().updateTask(taskId, { priority: !task.priority });
    }
  },

  setReminder: async (taskId: string, datetime: string | null) => {
    await get().updateTask(taskId, { reminderDatetime: datetime || undefined });
  },

  addTag: async (taskId: string, tag: string) => {
    const task = get().tasks.find((t) => t.id === taskId);
    if (task) {
      const currentTags = task.tags || [];
      if (!currentTags.includes(tag)) {
        await get().updateTask(taskId, { tags: [...currentTags, tag] });
      }
    }
  },

  removeTag: async (taskId: string, tag: string) => {
    const task = get().tasks.find((t) => t.id === taskId);
    if (task) {
      const currentTags = task.tags || [];
      await get().updateTask(taskId, { tags: currentTags.filter((t) => t !== tag) });
    }
  },
}));
