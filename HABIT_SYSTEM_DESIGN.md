# Habit Tracking System Design

## Overview

The app supports two types of habits:
1. **Building Habits** (Positive): Things you want to DO regularly
2. **Breaking Habits** (Negative): Things you want to STOP doing

## Habit Types

### Type 1: Building Habits (Do-Habits)

**Purpose**: Build a routine by doing something consistently

**Examples**:
- Drink water
- Exercise
- Meditate
- Read
- Journal

**Characteristics**:
- Appears on Timeline at a specific time
- User must actively mark as complete each day
- Streak increases when completed
- Streak breaks if missed for 2+ consecutive days

**User Flow**:
```
1. User creates habit: "Drink water at 7:00 AM daily"
2. Habit appears on timeline at 7:00 AM
3. User taps node → Marks complete
4. Streak increases: 1 day → 2 days → 3 days...
5. If user misses 2 days in a row → Streak resets to 0
```

### Type 2: Breaking Habits (Don't-Habits)

**Purpose**: Track days without doing an unwanted behavior

**Examples**:
- No smoking
- No alcohol
- No junk food
- No social media scrolling
- No nail biting

**Characteristics**:
- Does NOT appear on timeline (no specific time)
- Streak grows automatically each day
- User only interacts when they relapse
- Focuses on "clean days" count

**User Flow**:
```
1. User creates habit: "No Smoking"
2. Habit appears only in Habits tab (not timeline)
3. Each day passes → Streak auto-increases
4. User relapses → Taps "I relapsed" button
5. Streak resets to 0, starts counting again
6. Relapse logged in history for insights
```

## Data Schema

### Habit Entity

```typescript
interface Habit {
  id: string;
  title: string;
  type: 'building' | 'breaking';  // New field

  // For building habits only
  time?: string;                   // "07:00" - only for building habits
  icon: string;                    // "💧" or "🚭"

  // Recurrence (building habits only)
  recurrence: 'daily' | 'weekdays' | 'weekends' | 'custom';
  customDays?: number[];           // [1,3,5] = Mon, Wed, Fri

  // Tracking
  startDate: string;               // ISO date when habit started
  currentStreak: number;           // Current consecutive days
  longestStreak: number;           // Best streak ever

  // Completions (building habits)
  completedDates: string[];        // ["2025-11-11", "2025-11-10", ...]

  // Relapses (breaking habits)
  relapseDates?: string[];         // ["2025-10-15", "2025-09-20", ...]

  // Stats
  totalCompletions: number;        // Total successful days
  completionRate: number;          // Percentage (0-100)

  // Metadata
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}
```

## Streak Calculation Logic

### Building Habits

**Streak increases when**:
- User completes the habit on a scheduled day
- Completion happens within the day (before midnight)

**Streak breaks when**:
- User misses 2+ consecutive scheduled days
- Rationale: Allow 1 "grace day" for flexibility

**Algorithm**:
```typescript
function calculateBuildingStreak(habit: Habit): number {
  const completedDates = habit.completedDates.sort().reverse();
  let streak = 0;
  let currentDate = new Date();
  let missedDays = 0;

  while (missedDays < 2) {
    const dateStr = formatDate(currentDate);

    // Check if this day is scheduled for this habit
    if (isScheduledDay(currentDate, habit.recurrence)) {
      if (completedDates.includes(dateStr)) {
        streak++;
        missedDays = 0; // Reset missed counter
      } else {
        missedDays++;
      }
    }

    currentDate.setDate(currentDate.getDate() - 1); // Go back one day
  }

  return streak;
}
```

### Breaking Habits

**Streak increases automatically**:
- Every day that passes without a relapse = +1 to streak
- Calculated as: `days between (today - last relapse date)`

**Streak resets when**:
- User manually logs a relapse

**Algorithm**:
```typescript
function calculateBreakingStreak(habit: Habit): number {
  const lastRelapse = habit.relapseDates?.[0]; // Most recent

  if (!lastRelapse) {
    // No relapses yet, count from start date
    return daysBetween(habit.startDate, today());
  }

  // Count clean days since last relapse
  return daysBetween(lastRelapse, today());
}
```

## UI Differences

### Timeline View

**Building Habits**: Appear as scheduled nodes
```
7:00 AM  💧 Drink water [Tap to complete]
         Current streak: 12 days 🔥
```

**Breaking Habits**: Do NOT appear on timeline

### Habits Tab

**Building Habit Card**:
```
┌─────────────────────────────────────┐
│  💧 Drink Water              🔥 12  │
│  7:00 AM • Daily                    │
├─────────────────────────────────────┤
│  M  T  W  T  F  S  S                │
│  ✓  ✓  ✓  ○  ○  ○  ○               │
├─────────────────────────────────────┤
│  85% | Best: 12 | Total: 34         │
└─────────────────────────────────────┘
```

**Breaking Habit Card**:
```
┌─────────────────────────────────────┐
│  🚭 No Smoking              🔥 45   │
│  Breaking Habit • Since Nov 1       │
├─────────────────────────────────────┤
│  ✅ 45 days clean                   │
│  Best streak: 67 days               │
│  Last relapse: Oct 15               │
├─────────────────────────────────────┤
│     [😔 I relapsed today]           │
└─────────────────────────────────────┘
```

## User Interactions

### Building Habit

**On Timeline**:
- Tap node → Mark complete (checkmark appears)
- Swipe right → Quick complete
- Long press → Edit habit

**On Habits Tab**:
- Tap card → See details and history
- Tap today's dot → Toggle completion
- View weekly pattern and stats

### Breaking Habit

**On Habits Tab Only**:
- View current streak (auto-updating)
- See "days clean" count
- View relapse history
- Tap "I relapsed" → Log relapse (resets streak)
- View insights (total relapses, longest streak)

## Creating a Habit

### Habit Creation Modal

```
┌─────────────────────────────────────┐
│  Create Habit               [Save]  │
├─────────────────────────────────────┤
│  Habit Type                         │
│  ○ Building (Do)  ○ Breaking (Don't)│
├─────────────────────────────────────┤
│  Habit Name                         │
│  [Morning meditation          ]     │
├─────────────────────────────────────┤
│  Icon                               │
│  🧘 💧 🏃 📚 🚭 🍺 ...             │
├─────────────────────────────────────┤
│  -- IF BUILDING HABIT --            │
│  Time                               │
│  [07:00 AM           ]              │
│                                     │
│  Repeat                             │
│  ○ Daily  ✓ Weekdays  ○ Custom     │
├─────────────────────────────────────┤
│  -- IF BREAKING HABIT --            │
│  Start Date                         │
│  [November 1, 2025   ]              │
│  (When did you stop?)               │
└─────────────────────────────────────┘
```

**Form Logic**:
- Select type first (building vs breaking)
- If **building**: Show time picker + recurrence
- If **breaking**: Show start date picker only

## Completion Tracking

### Building Habits: Daily Completion

**Database Operation**:
```typescript
async function completeHabit(habitId: string, date: string) {
  // Add to completedDates array
  await db.run(
    'INSERT INTO habit_completions (habit_id, date) VALUES (?, ?)',
    [habitId, date]
  );

  // Recalculate streak
  const habit = await getHabit(habitId);
  const newStreak = calculateBuildingStreak(habit);

  // Update habit
  await db.run(
    'UPDATE habits SET current_streak = ?, longest_streak = MAX(longest_streak, ?) WHERE id = ?',
    [newStreak, newStreak, habitId]
  );
}
```

### Breaking Habits: Relapse Logging

**Database Operation**:
```typescript
async function logRelapse(habitId: string, date: string) {
  // Add to relapseDates array
  await db.run(
    'INSERT INTO habit_relapses (habit_id, date) VALUES (?, ?)',
    [habitId, date]
  );

  // Reset current streak to 0
  await db.run(
    'UPDATE habits SET current_streak = 0 WHERE id = ?',
    [habitId]
  );

  // Note: Longest streak is preserved
}
```

## Database Schema

### Tables

**habits**
```sql
CREATE TABLE habits (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK(type IN ('building', 'breaking')),
  time TEXT,                    -- NULL for breaking habits
  icon TEXT NOT NULL,
  recurrence TEXT,              -- 'daily', 'weekdays', etc.
  custom_days TEXT,             -- JSON array: "[1,3,5]"
  start_date TEXT NOT NULL,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  total_completions INTEGER DEFAULT 0,
  completion_rate REAL DEFAULT 0,
  is_active BOOLEAN DEFAULT 1,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
```

**habit_completions** (for building habits)
```sql
CREATE TABLE habit_completions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  habit_id TEXT NOT NULL,
  date TEXT NOT NULL,           -- "2025-11-11"
  completed_at TEXT NOT NULL,   -- ISO timestamp
  FOREIGN KEY (habit_id) REFERENCES habits(id) ON DELETE CASCADE,
  UNIQUE(habit_id, date)        -- One completion per day
);
```

**habit_relapses** (for breaking habits)
```sql
CREATE TABLE habit_relapses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  habit_id TEXT NOT NULL,
  date TEXT NOT NULL,           -- "2025-11-11"
  logged_at TEXT NOT NULL,      -- ISO timestamp
  notes TEXT,                   -- Optional: why did you relapse?
  FOREIGN KEY (habit_id) REFERENCES habits(id) ON DELETE CASCADE
);
```

## Analytics & Insights

### Building Habits

**Metrics to show**:
- Current streak
- Longest streak
- Completion rate (% of scheduled days completed)
- Total completions
- Weekly pattern (which days are strongest)
- Recent trend (improving or declining)

### Breaking Habits

**Metrics to show**:
- Current streak (days clean)
- Longest streak ever
- Total relapses
- Average time between relapses
- Recent trend (getting better or worse)
- Relapse pattern (any triggers/days?)

## Edge Cases & Rules

### Building Habits

**Q: What if user completes a habit on a non-scheduled day?**
A: Allow it, but don't count toward streak. Show as "bonus completion."

**Q: What if user marks complete, then un-marks?**
A: Allow undo within same day. Recalculate streak.

**Q: What about timezones / traveling?**
A: Use local device date, not UTC. Completion is based on "calendar day."

**Q: Grace period - how many missed days allowed?**
A: 1 missed day allowed before streak breaks. On 2nd consecutive miss, reset.

### Breaking Habits

**Q: What if user accidentally logs a relapse?**
A: Allow deletion within 5 minutes. After that, it's permanent (for honesty).

**Q: What if habit started before they joined the app?**
A: Allow backdate of start_date during creation.

**Q: Should we ask for relapse details (notes)?**
A: Optional field - can help identify triggers.

**Q: What if they want to restart a broken habit?**
A: Keep old habit archived, create new one (fresh start).

## Gamification & Motivation

### Milestones

**Building Habits**:
- 7 days: "One week strong! 🎉"
- 30 days: "One month! You're building a real habit! 💪"
- 100 days: "100 day streak! Legendary! 🏆"

**Breaking Habits**:
- 1 day: "First day is the hardest. Keep going! 💪"
- 7 days: "One week clean! 🌟"
- 30 days: "One month! The habit is losing its grip! 🎉"
- 90 days: "90 days clean! Most cravings are gone! 🏆"
- 365 days: "ONE YEAR! You did it! 🎊"

### Encouragement Messages

**After relapse** (breaking habit):
"You relapsed, but that doesn't erase your progress. Your longest streak was 45 days - you CAN do this. Start again."

**After missing a day** (building habit):
"Missed yesterday? That's okay. The streak may have reset, but your progress hasn't. Get back on track today."

## Integration with Timeline

### How habits flow through the app

```
1. User creates habit
   ↓
2. Type check:
   - Building? → Add to timeline at scheduled time
   - Breaking? → Add to Habits tab only
   ↓
3. Daily loop:
   - Building: Show on timeline, wait for completion
   - Breaking: Auto-increment streak if no relapse
   ↓
4. User interaction:
   - Building: Tap to complete
   - Breaking: Tap if relapsed
   ↓
5. Update streak, save to DB, show feedback
```

## Implementation Priority

### Phase 1: Building Habits (MVP)
- [x] Create building habits
- [x] Show on timeline
- [x] Mark complete
- [x] Calculate streaks
- [x] Show in Habits tab with stats

### Phase 2: Breaking Habits (Post-MVP)
- [ ] Add habit type selection
- [ ] Create breaking habits UI
- [ ] Relapse logging flow
- [ ] Auto-incrementing streaks
- [ ] Separate UI for breaking habits

### Phase 3: Advanced Features
- [ ] Habit insights & analytics
- [ ] Relapse trigger analysis
- [ ] Habit reminders/notifications
- [ ] Export habit data
- [ ] Social accountability features

## Summary

**Key Design Decisions**:

1. **Two distinct types**: Building (do) vs Breaking (don't)
2. **Timeline placement**: Only building habits appear
3. **Streak logic**:
   - Building: Manual completion, 1-day grace period
   - Breaking: Auto-increment, manual relapse logging
4. **UI separation**: Both show in Habits tab, different cards
5. **Data model**: Shared habits table, separate completion/relapse tables
6. **Focus**: Encourage without shame, celebrate progress

This system provides:
- ✅ Flexibility for both habit types
- ✅ Clear tracking and motivation
- ✅ Honest accountability without punishment
- ✅ Insights to improve over time
