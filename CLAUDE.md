# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**LifePlanner** is a daily system scheduler mobile app that helps users plan their day from wake-up to sleep with a visual timeline interface. The app combines task scheduling, habit tracking, and todo list management with a beautiful, intuitive timeline visualization.

### Core Features
- **Visual Timeline**: Daily schedule with color-coded task nodes and icons
- **Habit Tracking**: Recurring habits with completion tracking and streaks
- **Task Management**: Time-blocked tasks, alarms, and interval-based rest periods
- **Todo List**: Unscheduled tasks that can be dragged onto the timeline
- **Week View Calendar**: Overview of daily activities across the week

## Tech Stack

### Frontend
- **React Native** with **Expo** (managed workflow)
- **TypeScript** for type safety
- **React Navigation** for routing
- **Zustand** for state management (lightweight alternative to Redux)
- **React Native Paper** for UI components
- **React Native Reanimated** for smooth animations
- **expo-notifications** for local notifications

### Data & Storage
- **SQLite** (expo-sqlite) for local database
- **Expo SecureStore** for sensitive data
- **Optional**: Supabase for cloud sync (free tier)

### Development Tools
- **Expo CLI** for development and building
- **EAS Build** for production builds
- **Jest** for unit testing
- **Detox** for E2E testing (optional)

## Project Structure

```
lifeplanner/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Timeline/        # Timeline visualization components
│   │   ├── TaskCard/        # Individual task/habit cards
│   │   ├── Calendar/        # Week view calendar
│   │   ├── HabitTracker/    # Habit tracking UI
│   │   └── shared/          # Shared UI components
│   ├── screens/             # Main app screens
│   │   ├── TimelineScreen.tsx
│   │   ├── TodoScreen.tsx
│   │   ├── SettingsScreen.tsx
│   │   └── TaskEditScreen.tsx
│   ├── navigation/          # Navigation configuration
│   ├── store/               # Zustand store slices
│   │   ├── taskStore.ts
│   │   ├── habitStore.ts
│   │   └── settingsStore.ts
│   ├── services/            # Business logic layer
│   │   ├── database/        # SQLite operations
│   │   ├── scheduler/       # Schedule computation logic
│   │   ├── notifications/   # Notification management
│   │   └── sync/            # Optional cloud sync
│   ├── types/               # TypeScript type definitions
│   ├── utils/               # Helper functions
│   ├── constants/           # App constants (colors, sizes)
│   └── hooks/               # Custom React hooks
├── assets/                  # Images, fonts, icons
└── app.json                 # Expo configuration
```

## Key Architecture Patterns

### Data Model

**Task Entity** (Primary model for all schedulable items):
```typescript
{
  id: string;
  type: 'alarm' | 'habit' | 'timeblock' | 'interval';
  title: string;
  startTime: string;        // "HH:mm" format
  duration: number;          // minutes
  icon: string;              // icon name/emoji
  color: string;             // hex color
  recurrence: RecurrencePattern;
  completedDates: string[];  // ISO date strings
  metadata: Record<string, any>;
}
```

**RecurrencePattern**:
- Daily schedules are generated from task templates
- Each task has a recurrence rule (daily, weekdays, weekends, custom days)
- Completions are tracked by date, enabling streak calculation

### Timeline Generation Algorithm

1. **Fetch all active tasks** for the selected date
2. **Sort by startTime** to create chronological order
3. **Calculate intervals** between tasks (rest periods)
4. **Insert interval nodes** with contextual prompts
5. **Compute visual layout** (node sizes, positions, connecting lines)

### State Management Strategy

Using **Zustand** with separate stores for different concerns:
- `taskStore`: Task CRUD, filtering, scheduling logic
- `habitStore`: Habit tracking, streak calculation
- `settingsStore`: User preferences, app configuration
- `uiStore`: UI state (selected date, filters, modal visibility)

Each store follows the pattern:
```typescript
interface Store {
  // State
  items: T[];
  loading: boolean;
  // Actions
  fetch: () => Promise<void>;
  create: (item: T) => Promise<void>;
  update: (id: string, updates: Partial<T>) => Promise<void>;
  delete: (id: string) => Promise<void>;
}
```

### Database Schema

**tasks** table:
- Core task/habit information
- JSON fields for recurrence patterns and metadata

**completions** table:
- task_id, completion_date, completed_at timestamp
- Enables historical tracking and analytics

**settings** table:
- Key-value store for user preferences

## Development Commands

### Setup
```bash
# Install dependencies
npm install

# Start development server
npm start

# Start with cache clear
npm start -- --clear
```

### Running the App
```bash
# iOS simulator
npm run ios

# Android emulator
npm run android

# Web (for quick testing)
npm run web
```

### Testing
```bash
# Run unit tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run specific test file
npm test -- TaskCard.test.tsx

# Generate coverage
npm test -- --coverage
```

### Building
```bash
# Development build (local)
eas build --profile development --platform ios

# Production build
eas build --profile production --platform all

# Create preview build for testing
eas build --profile preview --platform ios
```

### Code Quality
```bash
# Lint TypeScript
npm run lint

# Type check
npm run type-check

# Format with Prettier
npm run format
```

## Critical Implementation Notes

### Timeline Visualization

The timeline is the centerpiece of the app. Implementation approach:

1. **Use ScrollView with absolute positioning** for timeline nodes
2. **Calculate node positions** based on time (pixels per minute ratio)
3. **Draw connecting lines** using SVG or React Native Skia
4. **Animate node expansion** when tapping for details
5. **Handle gestures** for drag-to-reschedule functionality

Key file: `src/components/Timeline/TimelineRenderer.tsx`

### Notification System

- **Local notifications only** (no push notifications needed initially)
- Schedule notifications when tasks are created/updated
- Cancel old notifications when tasks are edited
- Badge count shows pending tasks

Key file: `src/services/notifications/NotificationManager.ts`

### Performance Optimization

- **Memoize timeline calculations** - expensive operation
- **Virtualize long lists** in Inbox view
- **Lazy load week calendar data** - only fetch visible week
- **Debounce search/filter operations**
- **Use React.memo** for TaskCard components
- **Optimize re-renders** with shallow equality checks in Zustand

### Date & Time Handling

- **Use date-fns** for all date operations (lightweight, tree-shakeable)
- Store all times in **24-hour format** ("HH:mm")
- Store dates in **ISO 8601 format** for consistency
- Handle timezone changes gracefully
- Consider user's locale for time display

## UI/UX Design Principles

### Color Palette
- **Primary**: Coral Pink (#F4A5A5) - for timeline nodes, buttons
- **Accent**: Soft Pink (#FFB6C1) - for selected states
- **Background**: Light Gray (#F5F5F5)
- **Text**: Dark Gray (#333333)
- **Completed**: Muted coral with checkmark overlay

### Typography
- **Headers**: SF Pro Display / Roboto Bold, 24-28pt
- **Body**: SF Pro Text / Roboto Regular, 16pt
- **Time Labels**: SF Pro Text / Roboto Medium, 14pt

### Spacing & Layout
- **Timeline node diameter**: 80px (standard), 120px (time blocks)
- **Node spacing**: Proportional to time gaps (min 60px)
- **Horizontal padding**: 16px
- **Vertical rhythm**: 8px base unit

### Interactions
- **Tap task**: Expand to show details inline
- **Long press**: Edit mode
- **Swipe right**: Mark complete
- **Swipe left**: Delete/skip
- **Drag node**: Reschedule task
- **Pull to refresh**: Reload timeline

### Animations
- **Spring animations** for node expansion (native driver)
- **Fade transitions** between screens
- **Smooth scroll** to current time on load
- **Confetti effect** for habit streak milestones

## Development Phases

### Phase 1: Core Timeline (Weeks 1-2)
- [ ] Set up Expo + TypeScript project
- [ ] Create basic navigation structure
- [ ] Implement SQLite database with schema
- [ ] Build Timeline component with static data
- [ ] Create TaskCard component
- [ ] Add task creation/editing flow

### Phase 2: Habit Tracking (Week 3)
- [ ] Implement habit completion tracking
- [ ] Build streak calculation algorithm
- [ ] Create week calendar view
- [ ] Add habit analytics/insights
- [ ] Visual feedback for completions

### Phase 3: Todo List (Week 4)
- [ ] Build Todo screen with task list
- [ ] Implement drag-to-schedule from Todo list
- [ ] Add task filtering and search
- [ ] Priority levels and sorting

### Phase 4: Notifications & Polish (Week 5)
- [ ] Set up local notification system
- [ ] Add notification scheduling logic
- [ ] Implement settings screen
- [ ] Animations and micro-interactions
- [ ] App icon and splash screen

### Phase 5: Testing & Optimization (Week 6)
- [ ] Write unit tests for core logic
- [ ] Performance profiling and optimization
- [ ] User testing and feedback iteration
- [ ] Bug fixes and edge cases

## Testing Strategy

### Unit Tests
- Task scheduling algorithm
- Streak calculation logic
- Recurrence pattern matching
- Date/time utilities
- Store actions and state updates

### Integration Tests
- Database operations
- Notification scheduling
- Task CRUD flows
- Timeline generation

### Manual Testing Checklist
- [ ] Create tasks for different times
- [ ] Complete/uncomplete habits
- [ ] Reschedule via drag
- [ ] Edit recurring tasks
- [ ] Notification delivery
- [ ] Timezone changes
- [ ] Date transitions at midnight
- [ ] Week navigation

## Common Pitfalls & Solutions

### Issue: Timeline jumps when scrolling
**Solution**: Use `scrollToY` with animated: false on mount, then enable smooth scrolling.

### Issue: Notifications not firing
**Solution**: Check permissions, ensure tasks have future times, verify notification manager is initialized.

### Issue: Date inconsistencies
**Solution**: Always use UTC for storage, convert to local time only for display. Use date-fns consistently.

### Issue: Poor performance with many tasks
**Solution**: Implement virtual scrolling, limit rendered date range to ±3 days, memoize calculations.

### Issue: State updates not reflecting
**Solution**: Ensure Zustand actions return new objects (immutable updates), don't mutate state directly.

## Future Enhancements

- Cloud sync with Supabase (multi-device)
- Task templates and quick add
- Focus mode / Pomodoro timer
- Weekly/monthly analytics dashboard
- Integration with calendar apps
- Dark mode theme
- Custom themes and icon packs
- Voice input for task creation
- Smart scheduling suggestions (ML-based)
- Social features (share routines, accountability partners)

## External Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Paper Components](https://callstack.github.io/react-native-paper/)
- [Zustand Guide](https://docs.pmnd.rs/zustand/getting-started/introduction)
- [React Navigation Docs](https://reactnavigation.org/docs/getting-started)
- [Date-fns Documentation](https://date-fns.org/docs/Getting-Started)
