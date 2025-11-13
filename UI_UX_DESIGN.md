# LifePlanner UI/UX Design Guide

## Design Philosophy

**Calm, Clear, and Empowering** - The app should feel like a gentle guide through your day, not an overwhelming taskmaster. Every interaction should be intuitive and delightful.

## Visual Design System

### Color Palette

#### Primary Colors
- **Coral Pink**: `#F4A5A5` - Main brand color, timeline nodes, primary buttons
- **Soft Pink**: `#FFB6C1` - Accents, selected states, highlights
- **Rose**: `#E89B9B` - Darker variant for active states

#### Neutral Colors
- **Background**: `#F5F5F5` - Main app background
- **Card Background**: `#FFFFFF` - Task cards, modals
- **Border**: `#E0E0E0` - Dividers, outlines
- **Text Primary**: `#333333` - Main text
- **Text Secondary**: `#757575` - Supporting text
- **Text Tertiary**: `#BDBDBD` - Disabled/placeholder text

#### Semantic Colors
- **Success**: `#81C784` - Completed tasks
- **Warning**: `#FFB74D` - Upcoming deadlines
- **Info**: `#64B5F6` - Information states
- **Error**: `#E57373` - Errors, overdue tasks

#### Task Type Colors
- **Alarm**: `#F4A5A5` (Coral Pink)
- **Habit**: `#CE93D8` (Soft Purple)
- **Time Block**: `#90CAF9` (Sky Blue)
- **Interval**: `#A5D6A7` (Mint Green)

### Typography

#### Font Families
- **iOS**: SF Pro Display / SF Pro Text
- **Android**: Roboto / Roboto Condensed
- **Fallback**: System default

#### Type Scale
- **Display**: 32px / 500 weight - Screen titles
- **Heading 1**: 28px / 600 weight - Major sections
- **Heading 2**: 24px / 600 weight - Subsections
- **Heading 3**: 20px / 500 weight - Card titles
- **Body Large**: 18px / 400 weight - Primary content
- **Body**: 16px / 400 weight - Standard text
- **Body Small**: 14px / 400 weight - Supporting text
- **Caption**: 12px / 400 weight - Labels, timestamps
- **Overline**: 11px / 500 weight - Category labels (uppercase)

### Spacing System

Based on **8px** grid:
- **XXS**: 4px
- **XS**: 8px
- **SM**: 12px
- **MD**: 16px
- **LG**: 24px
- **XL**: 32px
- **XXL**: 48px

### Border Radius
- **Small**: 8px - Buttons, inputs
- **Medium**: 16px - Cards, modals
- **Large**: 24px - Timeline nodes
- **Extra Large**: 40px - Pill buttons
- **Circle**: 50% - Avatar, icon buttons

### Shadows

```css
/* Small elevation - Cards */
shadow-sm: 0px 2px 4px rgba(0, 0, 0, 0.08);

/* Medium elevation - Floating buttons */
shadow-md: 0px 4px 12px rgba(0, 0, 0, 0.12);

/* Large elevation - Modals */
shadow-lg: 0px 8px 24px rgba(0, 0, 0, 0.16);

/* Timeline nodes */
shadow-node: 0px 3px 8px rgba(244, 165, 165, 0.3);
```

## Layout Specifications

### Screen Structure

#### Safe Area
- **Top**: Account for status bar + 8px padding
- **Bottom**: Account for navigation bar + 16px padding
- **Horizontal**: 16px padding on both sides

#### Timeline Screen

**Header (Fixed)**
- Height: 180px
- Date display: 32px font, bold
- Calendar week strip: 120px height
- Bottom shadow for depth

**Timeline Content (Scrollable)**
- Time ruler on left: 40px width
- Timeline nodes: Center column
- Connecting line: 4px width, dashed for intervals
- Auto-scroll to current time on open

**Bottom Navigation**
- Height: 64px + safe area
- 4 items: Inbox, Timeline, AI (hidden initially), Settings
- Selected state: Icon + label colored, underline indicator

### Component Specifications

#### Timeline Node

**Standard Task Node**
- Diameter: 80px
- Icon size: 36px
- Border: 3px solid white (inner shadow)
- Drop shadow: shadow-node

**Time Block Node**
- Width: 80px
- Height: Dynamic based on duration (min 120px)
- Rounded corners: 40px
- Icon: 40px at top
- Label inside if space allows

**Completed State**
- Overlay: Semi-transparent white (#FFFFFF, 60% opacity)
- Checkmark: 28px, positioned top-right
- Slight desaturation of color

#### Task Card (Expanded)

```
┌─────────────────────────────────────┐
│ [Icon] Task Title              [•••]│  ← 56px height
├─────────────────────────────────────┤
│ ⏰ 7:00 AM   |   ⏱ 30 min           │  ← 40px height
├─────────────────────────────────────┤
│ 💬 Task notes or description...     │  ← Dynamic
│                                     │
│ 💤 Interval over. What's next?      │  ← If has interval
├─────────────────────────────────────┤
│            [Complete] [Edit]        │  ← 48px height
└─────────────────────────────────────┘
```

- Padding: 16px
- Border radius: 16px
- Background: White
- Shadow: shadow-md

#### Week Calendar Strip

```
  Sun   Mon   Tue   Wed   Thu   Fri   Sat
   9     10   (11)   12    13    14    15
  🔔    🔔🥤  🔔🥤   🔔    🔔    🔔    🔔
        🎯   📧🎯
```

- Each day: 48px × 88px
- Selected day: Circular highlight, Coral Pink
- Mini icons: 16px, stacked vertically (max 3, then "+N")
- Horizontal scrollable if needed

#### Floating Action Button (FAB)

- Diameter: 64px
- Icon: Plus sign, 28px
- Position: Bottom-right, 16px from edges
- Color: Gradient (Coral Pink to Soft Pink)
- Shadow: shadow-lg
- Pressed state: Scale 0.95

## Interaction Patterns

### Gestures

#### Timeline Screen
- **Tap node**: Expand card inline with animation
- **Tap expanded card background**: Collapse
- **Long press node**: Enter edit mode
- **Swipe right on node**: Quick complete (checkbox animation)
- **Swipe left on node**: Show delete/skip options
- **Drag node up/down**: Reschedule (show time hints)
- **Pull down**: Refresh (if cloud sync enabled)
- **Scroll**: Free scroll, auto-snap to hour marks

#### Todo Screen
- **Tap task**: Open edit modal
- **Long press**: Select mode (multi-select)
- **Drag task**: Drag to timeline (show drop zones)
- **Swipe right**: Quick schedule for today
- **Swipe left**: Delete with confirmation

#### Week Calendar
- **Tap day**: Jump to that day's timeline
- **Swipe left/right**: Navigate weeks
- **Long press day**: Show day summary modal

### Animations

#### Timeline Node Expansion
```javascript
// Spring animation
{
  damping: 15,
  stiffness: 150,
  mass: 0.5
}
```
- Node scales from 1.0 to 1.1
- Card fades in and slides down
- Connecting lines adjust smoothly
- Duration: ~300ms

#### Task Completion
```javascript
// Sequence animation
1. Node bounces (scale 1.0 → 1.15 → 1.0)
2. Checkmark draws in (100ms)
3. Color desaturates (200ms)
4. Confetti particles if streak milestone
```

#### Screen Transitions
- **Push**: Slide from right (iOS) / Material fade (Android)
- **Modal**: Slide up from bottom + backdrop fade
- **Tab switch**: Cross-fade, 150ms

#### Micro-interactions
- **Button press**: Scale 0.95, 100ms
- **Checkbox toggle**: Bounce + checkmark draw
- **Input focus**: Border color change + slight scale
- **Drag start**: Lift animation (scale 1.05 + shadow increase)

### Haptic Feedback

- **Light**: Tap buttons, switches
- **Medium**: Complete task, schedule item
- **Heavy**: Delete action, error state
- **Success**: Task completion, milestone reached
- **Warning**: Approaching deadline

## Screen Flows

### Timeline Screen (Home)

**Purpose**: Primary view of user's daily schedule

**Layout**:
1. Status bar + safe area
2. Header with date (large, bold) and month/year (small)
3. Week calendar strip (horizontal scroll)
4. Timeline content:
   - Left margin: Time labels (6:00, 7:00, etc.)
   - Center: Timeline with nodes and connectors
   - Right margin: Empty for balance
5. Bottom navigation
6. FAB (+ button)

**States**:
- **Loading**: Skeleton screens for nodes
- **Empty**: Friendly message + CTA to add first task
- **Populated**: Normal timeline view
- **Past time**: Grayed out with strikethrough if not completed
- **Current time**: Highlighted with pulsing indicator

### Todo Screen

**Purpose**: Manage unscheduled tasks (your todo list)

**Layout**:
1. Header: "Todo" title + search icon + filter icon
2. Task counter: "3 tasks to schedule"
3. Task list (grouped):
   - Today
   - This Week
   - Someday
4. Empty state: "No tasks in your list" + illustration

**Task Item**:
```
┌─────────────────────────────────────┐
│ ⭕️ Buy groceries                   │
│    Added 2 hours ago                │
└─────────────────────────────────────┘
```

### Settings Screen

**Purpose**: App configuration and preferences

**Sections**:
1. **Profile** (if accounts added later)
2. **Daily Schedule**
   - Default wake time
   - Default sleep time
   - Work days
3. **Notifications**
   - Enable notifications
   - Advance reminder time
   - Sound preferences
4. **Appearance**
   - Theme (Light/Dark/Auto)
   - Timeline view style
   - Completed task visibility
5. **Data**
   - Export data
   - Import data
   - Cloud sync status
6. **About**
   - Version
   - Privacy policy
   - Send feedback

### Task Edit Modal

**Layout**:
```
┌─────────────────────────────────────┐
│  ✕                            [Save]│
│                                     │
│  Task Title                         │
│  ┌─────────────────────────────────┐│
│  │ Morning jog                     ││
│  └─────────────────────────────────┘│
│                                     │
│  Type                               │
│  ⭕️ Alarm  ✓ Habit  ⭕️ Time Block  │
│                                     │
│  Time                               │
│  ┌──────────┐   Duration            │
│  │  6:00 AM │   ┌──────────┐        │
│  └──────────┘   │ 30 min   │        │
│                 └──────────┘        │
│                                     │
│  Repeat                             │
│  ⭕️ Daily  ✓ Weekdays  ⭕️ Weekends │
│  ⭕️ Custom: S M T W T F S          │
│                                     │
│  Icon & Color                       │
│  🏃 💪 🧘 ☀️ 💤 + Custom           │
│  🔴 🟠 🟡 🟢 🔵 🟣                  │
│                                     │
│  Notes                              │
│  ┌─────────────────────────────────┐│
│  │                                 ││
│  └─────────────────────────────────┘│
│                                     │
│  [Delete Task]                      │
└─────────────────────────────────────┘
```

## Iconography

### System Icons
- **Alarm**: Bell icon (🔔)
- **Habit**: Target/bullseye icon (🎯)
- **Time Block**: Calendar block (@)
- **Interval**: ZZZ or rest icon (💤)
- **Add**: Plus in circle
- **Edit**: Pencil
- **Delete**: Trash bin
- **Complete**: Checkmark
- **Settings**: Gear
- **Search**: Magnifying glass
- **Filter**: Funnel
- **Calendar**: Calendar grid

### Task Icons (User Selectable)
Organized by category:

**Morning Routine**
☀️ 🌅 ☕️ 🚿 🪥 🧘 🏃

**Work & Productivity**
💼 💻 📧 📞 ✍️ 📊 🎯

**Health & Fitness**
💪 🏋️ 🧘 🏃 🚴 🥗 💊

**Personal**
📚 🎨 🎵 🎮 📺 🛀 😴

**Social**
👥 📱 💬 🎉 ❤️

**Chores**
🧹 🧺 🍳 🛒 🚗 🏡

## Accessibility

### WCAG 2.1 AA Compliance

**Color Contrast**
- Text on background: Minimum 4.5:1
- Large text (18px+): Minimum 3:1
- Interactive elements: Minimum 3:1

**Touch Targets**
- Minimum size: 44×44 points (iOS) / 48×48dp (Android)
- Spacing between targets: 8px minimum

**Text Scaling**
- Support dynamic type / font scaling
- Test layouts at 200% text size
- Ensure no text truncation

**Screen Reader Support**
- All interactive elements have labels
- Timeline nodes: "Morning routine, 6 AM, alarm, not completed"
- State changes announced: "Task completed"
- Grouping related items with landmarks

**Keyboard Navigation** (for tablet/future web)
- Tab order follows visual flow
- Focus indicators clearly visible
- Escape key closes modals
- Enter/Space activates buttons

### Inclusive Design

**Motion Preferences**
- Respect `prefers-reduced-motion`
- Disable decorative animations
- Maintain functional animations (expand/collapse)

**Color Blindness**
- Don't rely solely on color to convey meaning
- Use icons + text labels
- Deuteranopia-friendly palette tested

**One-Handed Use**
- Primary actions within thumb reach
- FAB positioned for easy access
- Swipe gestures as shortcuts, not requirements

## Responsive Behavior

### Phone (Portrait)
- Standard layout as designed
- Timeline: Single column, full width
- Week calendar: Scrollable if needed

### Phone (Landscape)
- Hide week calendar (show via toggle)
- Maximize timeline vertical space
- Side-by-side task detail view

### Tablet (iPad, Android tablets)
- Split view: Timeline left, Task detail right
- Week calendar: Full week visible
- Larger timeline nodes (100px)

### Foldable Devices
- Adapt to multi-window mode
- Timeline in main window
- Task edit in second window

## Dark Mode

### Color Adaptations

**Dark Palette**
- Background: `#121212`
- Surface: `#1E1E1E`
- Surface variant: `#2C2C2C`
- Text primary: `#FFFFFF`
- Text secondary: `#B3B3B3`

**Coral Pink Adjustments**
- Primary: `#FF8A80` (lighter, more vibrant)
- Nodes: `#FF6E6E` with glow effect

**Principles**
- Reduce pure white (#FFFFFF → #E0E0E0)
- Increase elevation shadows
- Maintain color contrast ratios
- Preserve brand identity

## Loading & Empty States

### Loading States
- **Skeleton screens** for timeline nodes
- Animated shimmer effect
- Maintain layout structure

### Empty States
- Friendly illustration
- Concise, encouraging message
- Clear call-to-action button

**Examples**:
- "No tasks today! Tap + to add your first task"
- "Your inbox is empty. You're all caught up! 🎉"
- "No habits yet. Start building your routine."

### Error States
- Clear error message
- Suggested action to resolve
- Retry button if applicable

## Performance Guidelines

### Animation Budget
- Target: 60 FPS (16.67ms per frame)
- Use `useNativeDriver: true` when possible
- Avoid animating layout properties
- Test on low-end devices (iPhone SE, budget Android)

### Image Optimization
- Icons: Use SVG or vector icons
- User images: Compress and cache
- Lazy load images off-screen

### Render Optimization
- Memoize timeline calculation
- Virtualize long lists (>50 items)
- Debounce search inputs (300ms)
- Throttle scroll events (100ms)

## Localization Considerations

### Text Expansion
- Design for 30% text expansion
- Avoid truncating key information
- Use multi-line layouts when needed

### RTL Support (Future)
- Mirror layouts for Arabic, Hebrew
- Icons remain unchanged
- Timeline flows right-to-left

### Date/Time Formats
- Respect user locale
- 12h vs 24h time format
- Date format (MM/DD vs DD/MM)
- First day of week (Sunday vs Monday)

## Brand Voice & Copywriting

### Tone
- **Friendly**: Warm, approachable language
- **Encouraging**: Positive reinforcement
- **Concise**: Short, scannable text
- **Non-judgmental**: No shame for missed tasks

### Example Microcopy

**Completion Messages**
- "Nice work! ✓"
- "Task completed"
- "3 day streak! 🔥"

**Interval Prompts**
- "Interval over. What's next?"
- "Take a breath. Ready for more?"
- "Time to transition."

**Error Messages**
- "Oops! Couldn't save task. Try again?"
- "No internet connection. Changes saved locally."

**Empty States**
- "Your day is a blank canvas"
- "No tasks yet. That's okay!"

**Notifications**
- "Time for [Task Name]"
- "In 15 minutes: [Task Name]"
- "You missed [Task Name]. Reschedule?"
