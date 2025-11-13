import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Typography } from '@/constants';
import { Task } from '@/types';

interface ExtendedBlockProps {
  task: Task;
  onToggle?: () => void;
  onPress?: () => void;
  height: number; // Height is now passed from parent based on duration
}

/**
 * ExtendedBlock - Pill-shaped time block for tasks with duration
 * Height is calculated by parent based on duration
 * Parent component handles positioning
 */
export default function ExtendedBlock({
  task,
  onToggle,
  onPress,
  height,
}: ExtendedBlockProps) {
  const backgroundColor = task.isCompleted
    ? Colors.success
    : Colors.primary.main;

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  return (
    <TouchableOpacity
      style={[
        styles.block,
        { backgroundColor, height: Math.max(height, 80) }, // Minimum height
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={styles.icon}>{task.icon}</Text>

      <View style={styles.timeContainer}>
        <Text style={styles.timeText}>{formatTime(task.time)}</Text>
        {task.endTime && (
          <>
            <Text style={styles.timeText}>-</Text>
            <Text style={styles.timeText}>{formatTime(task.endTime)}</Text>
          </>
        )}
      </View>

      {task.duration && (
        <Text style={styles.durationText}>
          ({formatDuration(task.duration)})
        </Text>
      )}

      {task.isCompleted && (
        <View style={styles.checkmarkOverlay}>
          <Text style={styles.checkmark}>✓</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours === 0) {
    return `${mins} min`;
  } else if (mins === 0) {
    return `${hours} hr`;
  } else {
    return `${hours} hr, ${mins} min`;
  }
}

const BLOCK_WIDTH = 64;

const styles = StyleSheet.create({
  block: {
    width: BLOCK_WIDTH,
    borderRadius: BLOCK_WIDTH / 2, // Pill shape
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  icon: {
    fontSize: 28,
    marginBottom: 4,
  },
  timeContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 4,
  },
  timeText: {
    ...Typography.caption,
    color: Colors.neutral.white,
    fontSize: 10,
    fontWeight: '600',
  },
  durationText: {
    ...Typography.caption,
    color: Colors.neutral.white,
    fontSize: 9,
    marginTop: 2,
    opacity: 0.9,
  },
  checkmarkOverlay: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.success,
    borderWidth: 2,
    borderColor: Colors.neutral.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    fontSize: 12,
    color: Colors.neutral.white,
    fontWeight: 'bold',
  },
});
