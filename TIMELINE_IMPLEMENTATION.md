# Timeline Screen - Detailed Implementation Plan

## Overview

Based on the provided screenshots, the Timeline screen has a unique **dual-view pattern**:
1. **Weekly Grid Background** - Shows all 7 days with task icons
2. **Daily Modal Overlay** - Slides up to show detailed timeline for selected day

## Visual Design Specifications

### Layout Structure

```
┌─────────────────────────────────────┐
│  Status Bar                         │
├─────────────────────────────────────┤
│  November 11, 2025 ❯               │
│  [Sun Mon Tue Wed Thu Fri Sat]     │  ← Week selector
├─────────────────────────────────────┤
│                                     │
│  Weekly Grid Background             │
│  ┌───┬───┬───┬───┬───┬───┬───┐    │
│  │ 9 │10 │11*│12 │13 │14 │15 │    │  * = today
│  ├───┼───┼───┼───┼───┼───┼───┤    │
│  │🔔│🔔│🔔│🔔│🔔│🔔│🔔│    │  6 AM
│  │💧│💧│💧│💧│💧│💧│💧│    │  7 AM
│  │📧│📧│📧│📧│📧│📧│📧│    │  8 AM
│  │   │   │ @ │   │   │   │   │    │  (extended blocks)
│  └───┴───┴───┴───┴───┴───┴───┘    │
│                                     │
├─────────────────────────────────────┤
│  ╭─────────────────────────────╮   │  ← Draggable handle
│  │                             │   │
│  │  Daily Timeline Modal       │   │  ← Slides up/down
│  │                             │   │
│  │  6:00 AM  🔔 Rise and Shine │✓│ │
│  │           ↓                 │   │
│  │  💤 Interval over...        │   │
│  │           ↓                 │   │
│  │  7:00 AM  💧 Drink water    │○│ │
│  │           ↓                 │   │
│  │  💤 Reflect...              │   │
│  │           ↓                 │   │
│  │  7:30 AM  📧 Answer Emails  │○│ │
│  │         - 9:00 AM           │   │  ← Extended block
│  │         (1 hr, 30 min)      │   │
│  │                             │   │
│  ╰─────────────────────────────╯   │
├─────────────────────────────────────┤
│  [Inbox] [Timeline] [AI] [Settings] │  ← Bottom Nav
│                 (+)                  │  ← FAB
└─────────────────────────────────────┘
```

## Key Design Elements

### 1. Timeline Nodes (Task Icons)

**Three visual states:**

**A. Circular Node (Instant Task/Alarm)**
- Shape: Circle
- Size: 64px diameter
- Style: Solid fill with icon centered
- Connection: Dashed line to next node

**B. Extended Block (Time Block with Duration)**
- Shape: Rounded rectangle (pill shape)
- Width: 64px
- Height: Calculated based on duration
- Style: Solid fill with icon centered
- Connection: Solid line to next node

**C. Interval Message (Between Tasks)**
- Text: "💤 Interval over. What's next?"
- Text: "💤 Reflect on the respite."
- Style: Gray italic text, smaller font
- Purpose: Shows breathing room between tasks

**Visual Formula:**
```
Height = (duration_in_minutes / 60) * 120px_per_hour
```

Example:
- 30 min = 60px
- 1 hour = 120px
- 1.5 hours = 180px

### 2. Modal States

**Collapsed State:**
- Height: ~200px
- Shows: Only task icons in a horizontal row
- Background: White with blur
- Handle: Visible drag handle at top

**Expanded State:**
- Height: ~80% of screen
- Shows: Full timeline with times, titles, checkboxes
- Background: White with blur
- Handle: Visible drag handle at top

**Transition:**
- Animation: Spring (0.4s, bouncy)
- Gesture: Swipe up/down on handle or anywhere on modal
- Snap points: Collapsed (200px), Expanded (80%)

### 3. Weekly Grid Background

**Structure:**
```
7 columns (Sun-Sat)
Each column shows:
- Day number at top
- Vertical timeline of task icons
- Icons stacked vertically
- Color coding: Complete (green), Incomplete (red), Upcoming (gray)
```

**Icon Representation:**
- Each task = Small circular icon (32px)
- Stacked vertically with 4px gap
- Extended blocks shown as taller rectangles
- Current day highlighted with pink circle

**Interaction:**
- Tap any day column → Updates modal to show that day's timeline
- Modal slides up automatically when day is tapped

### 4. Wake/Sleep Time Configuration

**Settings Integration:**
```
Settings → Daily Schedule
- Wake Time: [07:00 AM] picker
- Sleep Time: [11:00 PM] picker
```

**Timeline Behavior:**
- Timeline starts at Wake Time
- Timeline ends at Sleep Time
- Time ruler adjusts dynamically
- Hours outside wake/sleep are grayed out or hidden

## Component Breakdown

### File Structure
```
src/
├── screens/
│   └── TimelineScreen.tsx           # Main container
├── components/
│   └── Timeline/
│       ├── WeeklyGrid.tsx           # Background grid
│       ├── DayColumn.tsx            # Single day column
│       ├── DailyModal.tsx           # Sliding modal
│       ├── TimelineNode.tsx         # Individual task node
│       ├── ExtendedBlock.tsx        # Time block node
│       ├── IntervalMessage.tsx      # Rest period message
│       ├── TimeRuler.tsx            # Left time labels
│       ├── CurrentTimeIndicator.tsx # "Next up in..."
│       └── ModalHandle.tsx          # Drag handle
└── utils/
    ├── timelineLayout.ts            # Calculate node positions
    └── timeUtils.ts                 # Time formatting/calculations
```

## Implementation Checklist

### Phase 1.1: Data Layer (Week 2, Days 1-2)
- [ ] Create Task CRUD service (`src/services/tasks.ts`)
  - [ ] `createTask(task: Task): Promise<string>`
  - [ ] `updateTask(id: string, updates: Partial<Task>): Promise<void>`
  - [ ] `deleteTask(id: string): Promise<void>`
  - [ ] `getTasksForDate(date: string): Promise<Task[]>`
  - [ ] `getTasksForWeek(startDate: string): Promise<Task[]>`
  - [ ] `toggleTaskCompletion(id: string): Promise<void>`

- [ ] Create Zustand store (`src/store/taskStore.ts`)
  - [ ] State: `tasks`, `selectedDate`, `wakeTime`, `sleepTime`
  - [ ] Actions: `loadTasks()`, `addTask()`, `updateTask()`, `deleteTask()`, `setSelectedDate()`
  - [ ] Computed: `currentDayTasks`, `weekTasks`, `sortedTimelineTasks`

- [ ] Create Settings store (`src/store/settingsStore.ts`)
  - [ ] State: `wakeTime`, `sleepTime`, `notifications`, `theme`
  - [ ] Actions: `updateWakeTime()`, `updateSleepTime()`, `loadSettings()`, `saveSettings()`

### Phase 1.2: Weekly Grid Background (Week 2, Days 3-4)
- [ ] Create `WeeklyGrid.tsx`
  - [ ] Calculate current week dates
  - [ ] Render 7 day columns
  - [ ] Handle day selection
  - [ ] Pass selected day to modal

- [ ] Create `DayColumn.tsx`
  - [ ] Show day name + date number
  - [ ] Render task icons vertically
  - [ ] Color code icons (green/red/gray)
  - [ ] Highlight current day
  - [ ] Handle tap to select day
  - [ ] Visual: Selected state (pink border)

- [ ] Implement icon layout algorithm
  - [ ] Stack icons vertically
  - [ ] Scale extended blocks appropriately
  - [ ] Apply color based on completion status

### Phase 1.3: Daily Modal Structure (Week 2, Day 5)
- [ ] Create `DailyModal.tsx`
  - [ ] Animated wrapper (react-native-reanimated)
  - [ ] Two states: collapsed (200px), expanded (80%)
  - [ ] Gesture handler (pan gesture)
  - [ ] Snap points
  - [ ] Blur background
  - [ ] Handle bar at top

- [ ] Create `ModalHandle.tsx`
  - [ ] Draggable bar (40px wide, 4px tall)
  - [ ] Gray color (#E0E0E0)
  - [ ] Centered at top
  - [ ] Visual feedback on drag

- [ ] Implement modal animations
  - [ ] Spring animation config
  - [ ] Swipe up → Expand
  - [ ] Swipe down → Collapse
  - [ ] Auto-expand when day is selected

### Phase 1.4: Timeline Nodes (Week 3, Days 1-2)
- [ ] Create `TimelineNode.tsx` (Circular node)
  - [ ] Props: `task`, `isCompleted`, `onToggle`
  - [ ] Circle (64px diameter)
  - [ ] Icon centered (emoji or custom)
  - [ ] Solid fill color
  - [ ] Connected by dashed line to next node
  - [ ] Pulse animation on current task

- [ ] Create `ExtendedBlock.tsx` (Time block)
  - [ ] Props: `task`, `duration`, `startTime`, `endTime`
  - [ ] Pill shape (rounded rectangle)
  - [ ] Height based on duration
  - [ ] Icon centered vertically
  - [ ] Time range shown below icon
  - [ ] Solid line connection

- [ ] Create `IntervalMessage.tsx`
  - [ ] Props: `message`, `duration`
  - [ ] Gray text with sleep emoji
  - [ ] Italic style
  - [ ] Positioned between nodes
  - [ ] Shows time until next task

- [ ] Implement timeline layout algorithm
  - [ ] Calculate vertical positions
  - [ ] Handle overlapping blocks
  - [ ] Adjust spacing based on time gaps
  - [ ] Apply wake/sleep time boundaries

### Phase 1.5: Time Ruler & Indicators (Week 3, Day 3)
- [ ] Create `TimeRuler.tsx`
  - [ ] Render hourly labels (6 AM, 7 AM, etc.)
  - [ ] Align with nodes
  - [ ] Start at wake time
  - [ ] End at sleep time
  - [ ] Fixed to left side of modal
  - [ ] Gray text, 12px font

- [ ] Create `CurrentTimeIndicator.tsx`
  - [ ] Show "Next up in 8h 13m. Ready?"
  - [ ] Pink text color
  - [ ] Position based on current time
  - [ ] Clock icon
  - [ ] Updates every minute

- [ ] Implement auto-scroll to current time
  - [ ] On modal open, scroll to "now"
  - [ ] Smooth animation
  - [ ] Keep current time indicator visible

### Phase 1.6: Task Interactions (Week 3, Day 4)
- [ ] Implement task completion toggle
  - [ ] Tap checkbox → Toggle state
  - [ ] Update UI immediately (optimistic)
  - [ ] Save to database
  - [ ] Show checkmark animation
  - [ ] Update weekly grid icon color

- [ ] Implement task tap → Expand details
  - [ ] Show full task card
  - [ ] Display: Title, time, notes, repeat info
  - [ ] Quick actions: Edit, Delete, Skip
  - [ ] Slide-in animation

- [ ] Handle long press → Edit mode
  - [ ] Vibration feedback
  - [ ] Show edit modal
  - [ ] Pre-fill form with task data

### Phase 1.7: Task Creation Modal (Week 3, Day 5)
- [ ] Create `TaskEditModal.tsx`
  - [ ] Full-screen modal
  - [ ] Form fields:
    - [ ] Task title (text input)
    - [ ] Icon picker (emoji grid)
    - [ ] Time picker (hour:minute)
    - [ ] Duration picker (for time blocks)
    - [ ] Task type selector (Alarm, Habit, Block)
    - [ ] Recurrence options (daily, weekdays, custom)
  - [ ] Save button
  - [ ] Cancel button
  - [ ] Delete button (if editing)

- [ ] Connect FAB to modal
  - [ ] Tap FAB → Open modal
  - [ ] Default to current time
  - [ ] Pre-select date from timeline

- [ ] Implement save logic
  - [ ] Validate inputs
  - [ ] Save to database
  - [ ] Update Zustand store
  - [ ] Close modal
  - [ ] Show success toast

### Phase 1.8: Polish & Refinements (Week 3, Weekend)
- [ ] Add loading states
  - [ ] Skeleton loaders for timeline
  - [ ] Loading spinner while fetching

- [ ] Add empty states
  - [ ] "No tasks today" message
  - [ ] Illustration + CTA button
  - [ ] "Tap + to add your first task"

- [ ] Add error handling
  - [ ] Database errors → Toast message
  - [ ] Failed to load tasks → Retry button
  - [ ] Network errors (if cloud sync)

- [ ] Performance optimization
  - [ ] Memoize timeline calculations
  - [ ] Virtualize long lists (if >50 tasks)
  - [ ] Debounce gesture handlers
  - [ ] Optimize re-renders

- [ ] Accessibility
  - [ ] Screen reader labels
  - [ ] Sufficient color contrast
  - [ ] Touch target sizes (min 44x44px)
  - [ ] Focus indicators

## Design Tokens & Styling

### Colors (Deep Ocean Blue Theme)
```typescript
const TimelineColors = {
  // Nodes
  nodeDefault: '#4A90E2',        // Deep ocean blue
  nodeDefaultGradient: ['#4A90E2', '#5CA9FB'],  // Blue gradient
  nodeCompleted: '#66BB6A',      // Green
  nodeIncomplete: '#FF6B6B',     // Softer red
  nodeUpcoming: '#E0E0E0',       // Gray

  // Modal
  modalBackground: '#FFFFFF',
  modalBackdrop: 'rgba(0,0,0,0.3)',
  modalHandle: '#E0E0E0',

  // Grid
  gridBackground: '#F5F5F5',
  gridBorder: '#E0E0E0',

  // Text
  timeLabel: '#757575',
  intervalText: '#BDBDBD',
  currentTime: '#FFA726',        // Orange for time indicator

  // Accents
  activeTab: '#4A90E2',          // Blue for active elements
  fabShadow: 'rgba(74, 144, 226, 0.4)',
};
```

### Spacing
```typescript
const TimelineSpacing = {
  nodeSize: 64,                  // Default circular node
  nodeGap: 8,                    // Gap between nodes
  hourHeight: 120,               // Pixels per hour
  modalCollapsed: 200,           // Collapsed modal height
  modalExpanded: '80%',          // Expanded modal height
  gridColumnWidth: 48,           // Width of day column
  timeRulerWidth: 60,            // Width of time labels
};
```

### Typography
```typescript
const TimelineTypography = {
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  taskTime: {
    fontSize: 12,
    fontWeight: '400',
    color: '#757575',
  },
  timeLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#757575',
  },
  intervalMessage: {
    fontSize: 12,
    fontWeight: '400',
    fontStyle: 'italic',
    color: '#BDBDBD',
  },
};
```

### Animations
```typescript
const TimelineAnimations = {
  modalSlide: {
    type: 'spring',
    damping: 20,
    stiffness: 300,
    mass: 0.8,
  },
  nodeAppear: {
    type: 'timing',
    duration: 200,
    easing: 'ease-out',
  },
  checkmarkDraw: {
    type: 'timing',
    duration: 300,
    easing: 'ease-in-out',
  },
};
```

## Layout Algorithm Details

### Node Positioning
```typescript
interface NodePosition {
  y: number;        // Vertical position (px from top)
  height: number;   // Node height
  type: 'circle' | 'block';
}

function calculateNodePositions(
  tasks: Task[],
  wakeTime: string,
  pixelsPerHour: number
): NodePosition[] {
  const positions: NodePosition[] = [];
  const wakeMinutes = timeToMinutes(wakeTime);

  for (const task of tasks) {
    const taskMinutes = timeToMinutes(task.time);
    const minutesSinceWake = taskMinutes - wakeMinutes;

    // Y position
    const y = (minutesSinceWake / 60) * pixelsPerHour;

    // Height
    let height = 64; // Default circular
    if (task.duration) {
      height = (task.duration / 60) * pixelsPerHour;
    }

    positions.push({
      y,
      height,
      type: task.duration ? 'block' : 'circle',
    });
  }

  return positions;
}
```

### Time to Minutes Converter
```typescript
function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

function minutesToTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${mins.toString().padStart(2, '0')} ${period}`;
}
```

### Interval Calculation
```typescript
function calculateIntervals(tasks: Task[]): Interval[] {
  const intervals: Interval[] = [];

  for (let i = 0; i < tasks.length - 1; i++) {
    const current = tasks[i];
    const next = tasks[i + 1];

    const currentEnd = current.endTime || current.time;
    const gap = timeToMinutes(next.time) - timeToMinutes(currentEnd);

    if (gap > 0) {
      intervals.push({
        afterTaskId: current.id,
        durationMinutes: gap,
        message: gap > 60
          ? '💤 Interval over. What\'s next?'
          : '💤 Reflect on the respite.',
      });
    }
  }

  return intervals;
}
```

## Testing Checklist

### Unit Tests
- [ ] Timeline layout calculations
- [ ] Time conversion utilities
- [ ] Node positioning algorithm
- [ ] Interval calculation logic
- [ ] Zustand store actions

### Integration Tests
- [ ] Task CRUD operations
- [ ] Modal slide animations
- [ ] Day selection updates modal
- [ ] Task completion updates grid
- [ ] Settings changes affect timeline

### UI Tests
- [ ] Modal gestures (swipe up/down)
- [ ] Task node tap interactions
- [ ] Day column selection
- [ ] FAB opens modal
- [ ] Form validation

### Edge Cases
- [ ] No tasks for selected day
- [ ] Tasks past midnight
- [ ] Overlapping time blocks
- [ ] Very long task durations (>8 hours)
- [ ] Wake time after sleep time
- [ ] Empty database

## Performance Targets

- [ ] Timeline renders in < 300ms
- [ ] Modal animation at 60 FPS
- [ ] Smooth scrolling with 100+ tasks
- [ ] Day switch < 200ms
- [ ] Task toggle response < 100ms

## Documentation

- [ ] Component API documentation
- [ ] Algorithm explanations
- [ ] State management flow diagram
- [ ] User interaction flows
- [ ] Design decision rationale

---

## Next Steps

Once this checklist is complete, Phase 1 will be done and we move to:
- **Phase 2**: Habit tracking (Week 4)
- **Phase 3**: Todo list (Week 5)
- **Phase 4**: Notifications & polish (Week 6)

**Estimated Time**: 2 weeks (10-15 hours total)
**Start Date**: Ready to begin
**Priority**: High - Core feature
