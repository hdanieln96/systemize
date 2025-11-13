import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Typography } from '@/constants';
import { Task } from '@/types';

interface DayColumnProps {
  date: string; // "2025-11-11"
  dayName: string; // "Mon"
  dayNumber: number; // 11
  tasks: Task[];
  isToday?: boolean;
  isSelected?: boolean;
  onPress?: () => void;
}

/**
 * DayColumn - Single day column in the weekly grid
 * Shows day name, date number, and tasks as a mini vertical timeline
 */
export default function DayColumn({
  date,
  dayName,
  dayNumber,
  tasks,
  isToday = false,
  isSelected = false,
  onPress,
}: DayColumnProps) {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        isSelected && styles.containerSelected,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Day name */}
      <Text style={[styles.dayName, isToday && styles.dayNameToday]}>
        {dayName}
      </Text>

      {/* Day number */}
      <View style={[styles.dayNumber, isToday && styles.dayNumberToday]}>
        <Text style={[styles.dayNumberText, isToday && styles.dayNumberTextToday]}>
          {dayNumber}
        </Text>
      </View>

      {/* Timeline with stretched task icons */}
      <View style={styles.timelineContainer}>
        {tasks.map((task) => (
          <StretchedTaskIcon key={task.id} task={task} />
        ))}
      </View>
    </TouchableOpacity>
  );
}

interface StretchedTaskIconProps {
  task: Task;
}

/**
 * StretchedTaskIcon - Task icon with vertical duration bar
 * Positioned by start time, height by duration
 */
function StretchedTaskIcon({ task }: StretchedTaskIconProps) {
  const PIXELS_PER_MINUTE = 0.5; // Scaled down for weekly view
  const WAKE_TIME_MINUTES = 6 * 60; // 6 AM as baseline
  const MIN_BAR_HEIGHT = 20;
  const MAX_BAR_HEIGHT = 80;

  // Calculate Y position based on task start time
  const [hours, minutes] = task.time.split(':').map(Number);
  const taskMinutes = hours * 60 + minutes;
  const minutesSinceWake = Math.max(0, taskMinutes - WAKE_TIME_MINUTES);
  const topPosition = minutesSinceWake * PIXELS_PER_MINUTE;

  // Calculate duration bar height
  const durationMinutes = task.duration || 30;
  const barHeight = Math.max(
    MIN_BAR_HEIGHT,
    Math.min(MAX_BAR_HEIGHT, durationMinutes * PIXELS_PER_MINUTE)
  );

  // Determine color
  const taskColor = task.color || Colors.primary.main;

  return (
    <View style={[styles.stretchedIconWrapper, { top: topPosition }]}>
      {/* Icon circle */}
      <View
        style={[
          styles.iconCircle,
          {
            borderColor: taskColor,
            backgroundColor: Colors.background.primary,
          },
        ]}
      >
        <Text style={styles.iconEmoji}>{task.icon}</Text>
      </View>

      {/* Duration bar extending downward */}
      <View
        style={[
          styles.durationBar,
          {
            height: barHeight,
            backgroundColor: taskColor,
          },
        ]}
      />
    </View>
  );
}

const COLUMN_WIDTH = 48;
const ICON_CIRCLE_SIZE = 32;

const styles = StyleSheet.create({
  container: {
    width: COLUMN_WIDTH,
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 2,
    borderRadius: 12,
  },
  containerSelected: {
    backgroundColor: Colors.background.blueLight,
    borderWidth: 2,
    borderColor: Colors.primary.main,
    shadowColor: Colors.primary.main,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  dayName: {
    ...Typography.caption,
    fontSize: 11,
    fontWeight: '600',
    color: Colors.text.secondary,
    marginBottom: 4,
  },
  dayNameToday: {
    color: Colors.primary.main,
  },
  dayNumber: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    backgroundColor: 'transparent',
  },
  dayNumberToday: {
    backgroundColor: Colors.primary.main,
  },
  dayNumberText: {
    ...Typography.body,
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  dayNumberTextToday: {
    color: Colors.neutral.white,
  },
  timelineContainer: {
    flex: 1,
    width: '100%',
    position: 'relative',
    alignItems: 'center',
  },
  // Stretched icon styles
  stretchedIconWrapper: {
    position: 'absolute',
    alignItems: 'center',
    width: '100%',
  },
  iconCircle: {
    width: ICON_CIRCLE_SIZE,
    height: ICON_CIRCLE_SIZE,
    borderRadius: ICON_CIRCLE_SIZE / 2,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
    zIndex: 2,
  },
  iconEmoji: {
    fontSize: 16,
  },
  durationBar: {
    position: 'absolute',
    top: ICON_CIRCLE_SIZE / 2,
    width: 4,
    borderRadius: 2,
    opacity: 0.7,
    zIndex: 1,
  },
});
