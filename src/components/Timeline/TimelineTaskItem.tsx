import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Typography } from '@/constants';
import { Task } from '@/types';

interface TimelineTaskItemProps {
  task: Task;
  onToggle?: () => void;
  onPress?: () => void;
  showConnectorAbove?: boolean;
  showConnectorBelow?: boolean;
}

/**
 * Calculate icon size based on task duration
 * Scales from 40px (short tasks) to 120px (long tasks)
 * NOTE: Currently disabled for consistent layout. Kept for future use.
 */
function calculateIconSize(duration: number | undefined): number {
  if (!duration) return 56; // default medium size

  // Linear scaling with bounds
  // < 30 min: 40-50px
  // 30-60 min: 56-70px
  // > 60 min: 80-120px (capped)
  if (duration < 30) {
    return Math.max(40, 40 + duration * 0.33);
  } else if (duration < 60) {
    return Math.max(56, 56 + (duration - 30) * 0.47);
  } else {
    return Math.min(120, 70 + (duration - 60) * 0.67);
  }
}

const ICON_SIZE = 56; // Fixed size for consistent alignment
const EMOJI_SIZE = 28; // 50% of icon size
const LEFT_COLUMN_WIDTH = 80; // Fixed width for alignment

/**
 * TimelineTaskItem - Single task item in the timeline
 * Layout: [Icon + Connector Line] on left | [Time + Title] in center | [Checkbox] on right
 * Uses fixed icon size for clean, aligned appearance
 */
function TimelineTaskItem({
  task,
  onToggle,
  onPress,
  showConnectorAbove = false,
  showConnectorBelow = false,
}: TimelineTaskItemProps) {
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  const iconColor = task.isCompleted ? Colors.habit.completed : Colors.error;

  return (
    <View style={styles.container}>
      {/* Left side: Timeline with icon and connectors */}
      <View style={styles.leftColumn}>
        {/* Connector line above */}
        {showConnectorAbove && <View style={styles.connectorLine} />}

        {/* Icon circle - fixed size */}
        <View style={[styles.iconCircle, { backgroundColor: iconColor }]}>
          <Text style={styles.icon}>{task.icon}</Text>
        </View>

        {/* Connector line below */}
        {showConnectorBelow && <View style={styles.connectorLine} />}
      </View>

      {/* Center: Task info - tappable to edit */}
      <TouchableOpacity
        style={styles.centerColumn}
        onPress={onPress}
        disabled={!onPress}
        activeOpacity={0.7}
      >
        <View style={styles.timeRow}>
          <Text style={styles.timeText}>{formatTime(task.time)}</Text>
          {task.isRecurring && <Text style={styles.recurringIcon}>↻</Text>}
        </View>
        <Text style={[styles.titleText, task.isCompleted && styles.titleCompleted]}>
          {task.title}
        </Text>
        {task.duration && task.duration > 0 && (
          <Text style={styles.durationText}>
            {formatTime(task.time)}{task.endTime ? ` – ${formatTime(task.endTime)}` : ''} ({formatDuration(task.duration)})
          </Text>
        )}
      </TouchableOpacity>

      {/* Right: Checkbox */}
      <TouchableOpacity
        style={styles.checkboxContainer}
        onPress={onToggle}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <View style={[styles.checkbox, task.isCompleted && styles.checkboxChecked]}>
          {task.isCompleted && <Text style={styles.checkmark}>✓</Text>}
        </View>
      </TouchableOpacity>
    </View>
  );
}

function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins} min`;
  if (mins === 0) return `${hours} hr`;
  return `${hours} hr, ${mins} min`;
}

const CONNECTOR_WIDTH = 2;

// Export memoized component to prevent unnecessary re-renders
export default React.memo(TimelineTaskItem, (prevProps, nextProps) => {
  return (
    prevProps.task.id === nextProps.task.id &&
    prevProps.task.isCompleted === nextProps.task.isCompleted &&
    prevProps.task.title === nextProps.task.title &&
    prevProps.task.icon === nextProps.task.icon &&
    prevProps.task.time === nextProps.task.time &&
    prevProps.task.duration === nextProps.task.duration &&
    prevProps.showConnectorAbove === nextProps.showConnectorAbove &&
    prevProps.showConnectorBelow === nextProps.showConnectorBelow
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  leftColumn: {
    width: LEFT_COLUMN_WIDTH,
    alignItems: 'center',
    marginRight: 12,
  },
  connectorLine: {
    width: CONNECTOR_WIDTH,
    flex: 1,
    backgroundColor: Colors.neutral.mediumGray,
    minHeight: 20,
  },
  iconCircle: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    borderRadius: ICON_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  icon: {
    fontSize: EMOJI_SIZE,
  },
  centerColumn: {
    flex: 1,
    justifyContent: 'center',
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  timeText: {
    ...Typography.caption,
    fontSize: 13,
    color: Colors.text.secondary,
    fontWeight: '500',
  },
  recurringIcon: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  titleText: {
    ...Typography.body,
    fontSize: 17,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
    color: Colors.text.secondary,
  },
  durationText: {
    ...Typography.caption,
    fontSize: 12,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  checkboxContainer: {
    padding: 4,
    justifyContent: 'center',
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: Colors.neutral.gray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: Colors.success,
    borderColor: Colors.success,
  },
  checkmark: {
    fontSize: 16,
    color: Colors.neutral.white,
    fontWeight: 'bold',
  },
});
