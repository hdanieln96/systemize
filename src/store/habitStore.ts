/**
 * Habit Store - Zustand State Management
 * Manages habits, tracking, and habit operations
 */

import { create } from 'zustand';
import { Habit } from '@/types';
import {
  createHabit,
  getHabitById,
  getAllHabits,
  getActiveHabits,
  updateHabit,
  deleteHabit,
  logHabitCompletion,
  logHabitRelapse,
} from '@services/habits';

interface HabitStore {
  // State
  habits: Habit[];
  isLoading: boolean;
  error: string | null;

  // Computed selectors
  activeHabits: () => Habit[];
  buildingHabits: () => Habit[];
  breakingHabits: () => Habit[];
  byCategory: (category: string) => Habit[];
  timedHabits: () => Habit[];
  anytimeHabits: () => Habit[];

  // CRUD Actions
  addHabit: (habit: Omit<Habit, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  updateHabit: (id: string, updates: Partial<Habit>) => Promise<void>;
  removeHabit: (id: string) => Promise<void>;
  refreshHabits: () => Promise<void>;

  // Tracking Actions
  logCompletion: (habitId: string, date?: string, unitsCompleted?: number) => Promise<void>;
  logRelapse: (habitId: string, notes?: string) => Promise<void>;
}

export const useHabitStore = create<HabitStore>((set, get) => ({
  // Initial state
  habits: [],
  isLoading: false,
  error: null,

  // Computed selectors
  activeHabits: () => {
    const { habits } = get();
    return habits.filter((habit) => habit.isActive).sort((a, b) => {
      // Sort by type (building first), then by creation date
      if (a.type !== b.type) {
        return a.type === 'building' ? -1 : 1;
      }
      return b.createdAt.localeCompare(a.createdAt);
    });
  },

  buildingHabits: () => {
    const { habits } = get();
    return habits
      .filter((habit) => habit.isActive && habit.type === 'building')
      .sort((a, b) => {
        // Timed habits first, sorted by time
        if (a.time && b.time) {
          return a.time.localeCompare(b.time);
        }
        if (a.time) return -1;
        if (b.time) return 1;
        // Then by creation date
        return b.createdAt.localeCompare(a.createdAt);
      });
  },

  breakingHabits: () => {
    const { habits } = get();
    return habits
      .filter((habit) => habit.isActive && habit.type === 'breaking')
      .sort((a, b) => {
        // Sort by current streak (longest first)
        return b.currentStreak - a.currentStreak;
      });
  },

  byCategory: (category: string) => {
    const { habits } = get();
    return habits
      .filter((habit) => habit.isActive && habit.category === category)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },

  timedHabits: () => {
    const { habits } = get();
    return habits
      .filter((habit) => habit.isActive && habit.type === 'building' && habit.time)
      .sort((a, b) => (a.time || '').localeCompare(b.time || ''));
  },

  anytimeHabits: () => {
    const { habits } = get();
    return habits
      .filter((habit) => habit.isActive && habit.type === 'building' && !habit.time)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },

  // CRUD Actions
  addHabit: async (habitData) => {
    set({ isLoading: true, error: null });
    try {
      const id = await createHabit(habitData);

      // Reload habits
      await get().refreshHabits();

      set({ isLoading: false });
      return id;
    } catch (error) {
      console.error('Error creating habit:', error);
      set({
        error: error instanceof Error ? error.message : 'Failed to create habit',
        isLoading: false,
      });
      throw error;
    }
  },

  updateHabit: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      await updateHabit(id, updates);

      // Update local state optimistically
      set((state) => ({
        habits: state.habits.map((habit) =>
          habit.id === id ? { ...habit, ...updates, updatedAt: new Date().toISOString() } : habit
        ),
        isLoading: false,
      }));
    } catch (error) {
      console.error('Error updating habit:', error);
      set({
        error: error instanceof Error ? error.message : 'Failed to update habit',
        isLoading: false,
      });
      // Refresh to get correct state from DB
      await get().refreshHabits();
      throw error;
    }
  },

  removeHabit: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await deleteHabit(id);

      // Remove from local state
      set((state) => ({
        habits: state.habits.filter((habit) => habit.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      console.error('Error deleting habit:', error);
      set({
        error: error instanceof Error ? error.message : 'Failed to delete habit',
        isLoading: false,
      });
      throw error;
    }
  },

  refreshHabits: async () => {
    set({ isLoading: true, error: null });
    try {
      const habits = await getActiveHabits();
      set({ habits, isLoading: false });
    } catch (error) {
      console.error('Error loading habits:', error);
      set({
        error: error instanceof Error ? error.message : 'Failed to load habits',
        isLoading: false,
      });
    }
  },

  // Tracking Actions
  logCompletion: async (habitId: string, date?: string, unitsCompleted?: number) => {
    try {
      await logHabitCompletion(habitId, date, unitsCompleted);

      // Refresh habits to get updated stats
      await get().refreshHabits();
    } catch (error) {
      console.error('Error logging habit completion:', error);
      set({
        error: error instanceof Error ? error.message : 'Failed to log completion',
      });
      throw error;
    }
  },

  logRelapse: async (habitId: string, notes?: string) => {
    try {
      await logHabitRelapse(habitId, notes);

      // Refresh habits to get updated stats
      await get().refreshHabits();
    } catch (error) {
      console.error('Error logging habit relapse:', error);
      set({
        error: error instanceof Error ? error.message : 'Failed to log relapse',
      });
      throw error;
    }
  },
}));
