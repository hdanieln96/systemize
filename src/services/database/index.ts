import * as SQLite from 'expo-sqlite';
import { Task, Habit, HabitCompletion, HabitRelapse, AppSettings } from '@/types';

const DB_NAME = 'lifeplanner.db';

let db: SQLite.SQLiteDatabase | null = null;

/**
 * Initialize the database and create tables
 */
export async function initDatabase(): Promise<void> {
  try {
    db = await SQLite.openDatabaseAsync(DB_NAME);

    // Create tasks table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS tasks (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        type TEXT NOT NULL CHECK(type IN ('alarm', 'habit', 'timeblock')),
        time TEXT NOT NULL,
        icon TEXT NOT NULL,
        color TEXT,
        is_completed INTEGER DEFAULT 0,
        is_scheduled INTEGER DEFAULT 1,
        is_recurring INTEGER DEFAULT 0,
        recurrence TEXT,
        custom_days TEXT,
        duration INTEGER,
        end_time TEXT,
        date TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
    `);

    // Create habits table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS habits (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        type TEXT NOT NULL CHECK(type IN ('building', 'breaking')),
        time TEXT,
        icon TEXT NOT NULL,
        recurrence TEXT,
        custom_days TEXT,
        start_date TEXT NOT NULL,
        current_streak INTEGER DEFAULT 0,
        longest_streak INTEGER DEFAULT 0,
        total_completions INTEGER DEFAULT 0,
        completion_rate REAL DEFAULT 0,
        is_active INTEGER DEFAULT 1,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
    `);

    // Create habit_completions table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS habit_completions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        habit_id TEXT NOT NULL,
        date TEXT NOT NULL,
        completed_at TEXT NOT NULL,
        FOREIGN KEY (habit_id) REFERENCES habits(id) ON DELETE CASCADE,
        UNIQUE(habit_id, date)
      );
    `);

    // Create habit_relapses table (for breaking habits)
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS habit_relapses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        habit_id TEXT NOT NULL,
        date TEXT NOT NULL,
        logged_at TEXT NOT NULL,
        notes TEXT,
        FOREIGN KEY (habit_id) REFERENCES habits(id) ON DELETE CASCADE
      );
    `);

    // Create settings table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS settings (
        id INTEGER PRIMARY KEY CHECK(id = 1),
        wake_time TEXT DEFAULT '07:00',
        sleep_time TEXT DEFAULT '23:00',
        notifications_enabled INTEGER DEFAULT 1,
        notification_advance_minutes INTEGER DEFAULT 5,
        theme TEXT DEFAULT 'light',
        show_completed_tasks INTEGER DEFAULT 1
      );
    `);

    // Insert default settings if not exists
    await db.runAsync(`
      INSERT OR IGNORE INTO settings (id) VALUES (1);
    `);

    // Create indexes for better performance
    await db.execAsync(`
      CREATE INDEX IF NOT EXISTS idx_tasks_date ON tasks(date);
      CREATE INDEX IF NOT EXISTS idx_tasks_time ON tasks(time);
      CREATE INDEX IF NOT EXISTS idx_habit_completions_date ON habit_completions(date);
      CREATE INDEX IF NOT EXISTS idx_habit_completions_habit_id ON habit_completions(habit_id);
    `);

    // Add new columns if they don't exist (migration)
    try {
      await db.execAsync(`
        ALTER TABLE tasks ADD COLUMN notes TEXT;
      `);
    } catch (e) {
      // Column already exists, ignore
    }

    try {
      await db.execAsync(`
        ALTER TABLE tasks ADD COLUMN notifications TEXT;
      `);
    } catch (e) {
      // Column already exists, ignore
    }

    // Add subtasks column (Phase 1 - Todo Screen)
    try {
      await db.execAsync(`
        ALTER TABLE tasks ADD COLUMN subtasks TEXT;
      `);
    } catch (e) {
      // Column already exists, ignore
    }

    // Add priority column (Phase 1 - Todo Screen)
    try {
      await db.execAsync(`
        ALTER TABLE tasks ADD COLUMN priority INTEGER DEFAULT 0;
      `);
    } catch (e) {
      // Column already exists, ignore
    }

    // Add reminder_datetime column (Phase 1 - Todo Screen)
    try {
      await db.execAsync(`
        ALTER TABLE tasks ADD COLUMN reminder_datetime TEXT;
      `);
    } catch (e) {
      // Column already exists, ignore
    }

    // Add tags column (Phase 1 - Todo Screen)
    try {
      await db.execAsync(`
        ALTER TABLE tasks ADD COLUMN tags TEXT;
      `);
    } catch (e) {
      // Column already exists, ignore
    }

    // Add new habit columns (Phase 1 - Habit Tracker)
    try {
      await db.execAsync(`
        ALTER TABLE habits ADD COLUMN color TEXT;
      `);
    } catch (e) {
      // Column already exists, ignore
    }

    try {
      await db.execAsync(`
        ALTER TABLE habits ADD COLUMN category TEXT;
      `);
    } catch (e) {
      // Column already exists, ignore
    }

    try {
      await db.execAsync(`
        ALTER TABLE habits ADD COLUMN time_window TEXT;
      `);
    } catch (e) {
      // Column already exists, ignore
    }

    try {
      await db.execAsync(`
        ALTER TABLE habits ADD COLUMN frequency_type TEXT;
      `);
    } catch (e) {
      // Column already exists, ignore
    }

    try {
      await db.execAsync(`
        ALTER TABLE habits ADD COLUMN weekly_target INTEGER;
      `);
    } catch (e) {
      // Column already exists, ignore
    }

    try {
      await db.execAsync(`
        ALTER TABLE habits ADD COLUMN duration TEXT;
      `);
    } catch (e) {
      // Column already exists, ignore
    }

    try {
      await db.execAsync(`
        ALTER TABLE habits ADD COLUMN has_reminder INTEGER DEFAULT 0;
      `);
    } catch (e) {
      // Column already exists, ignore
    }

    try {
      await db.execAsync(`
        ALTER TABLE habits ADD COLUMN notes TEXT;
      `);
    } catch (e) {
      // Column already exists, ignore
    }

    try {
      await db.execAsync(`
        ALTER TABLE habits ADD COLUMN replacement_behavior TEXT;
      `);
    } catch (e) {
      // Column already exists, ignore
    }

    // Add unit tracking columns
    try {
      await db.execAsync(`
        ALTER TABLE habits ADD COLUMN unit_target INTEGER;
      `);
    } catch (e) {
      // Column already exists, ignore
    }

    try {
      await db.execAsync(`
        ALTER TABLE habits ADD COLUMN unit_type TEXT;
      `);
    } catch (e) {
      // Column already exists, ignore
    }

    // Add end date column
    try {
      await db.execAsync(`
        ALTER TABLE habits ADD COLUMN end_date TEXT;
      `);
    } catch (e) {
      // Column already exists, ignore
    }

    // Add units_completed column to habit_completions table
    try {
      await db.execAsync(`
        ALTER TABLE habit_completions ADD COLUMN units_completed INTEGER;
      `);
    } catch (e) {
      // Column already exists, ignore
    }
  } catch (error) {
    throw error;
  }
}

/**
 * Get the database instance
 */
export function getDatabase(): SQLite.SQLiteDatabase {
  if (!db) {
    throw new Error('Database not initialized. Call initDatabase() first.');
  }
  return db;
}

/**
 * Close the database connection
 */
export async function closeDatabase(): Promise<void> {
  if (db) {
    await db.closeAsync();
    db = null;
  }
}

/**
 * Drop all tables (use with caution - for development only)
 */
export async function resetDatabase(): Promise<void> {
  if (!db) {
    throw new Error('Database not initialized');
  }

  await db.execAsync(`
    DROP TABLE IF EXISTS tasks;
    DROP TABLE IF EXISTS habits;
    DROP TABLE IF EXISTS habit_completions;
    DROP TABLE IF EXISTS habit_relapses;
    DROP TABLE IF EXISTS settings;
  `);

  await initDatabase();
}

export default {
  initDatabase,
  getDatabase,
  closeDatabase,
  resetDatabase,
};
