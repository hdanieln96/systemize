import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '@/constants';
import { Task } from '@/types';

interface TimelineNodeProps {
  task: Task;
  onToggle?: () => void;
  onPress?: () => void;
  isCurrentTask?: boolean;
}

/**
 * TimelineNode - Circular node for instant tasks (alarms, habits without duration)
 * Displays as a 64px circle with icon centered
 * Parent component handles positioning
 */
export default function TimelineNode({
  task,
  onToggle,
  onPress,
  isCurrentTask = false,
}: TimelineNodeProps) {
  const backgroundColor = task.isCompleted
    ? Colors.success
    : Colors.primary.main;

  return (
    <TouchableOpacity
      style={[
        styles.node,
        { backgroundColor },
        isCurrentTask && styles.nodeCurrentPulse,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={styles.icon}>{task.icon}</Text>

      {task.isCompleted && (
        <View style={styles.checkmarkOverlay}>
          <Text style={styles.checkmark}>✓</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const NODE_SIZE = 64;

const styles = StyleSheet.create({
  node: {
    width: NODE_SIZE,
    height: NODE_SIZE,
    borderRadius: NODE_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  nodeCurrentPulse: {
    borderWidth: 2,
    borderColor: Colors.accent.orange,
  },
  icon: {
    fontSize: 28,
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
