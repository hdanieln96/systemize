import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing } from '@/constants';

interface EmptyStateProps {
  message?: string;
  icon?: string;
}

/**
 * EmptyState - Shows when no tasks exist for selected date
 * Simple, centered message with icon
 */
export default function EmptyState({
  message = 'No tasks scheduled',
  icon = '📅',
}: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.message}>{message}</Text>
      <Text style={styles.hint}>Tap + to add your first task</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
    paddingHorizontal: Spacing.lg,
  },
  icon: {
    fontSize: 64,
    marginBottom: Spacing.md,
    opacity: 0.5,
  },
  message: {
    ...Typography.h3,
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.secondary,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  hint: {
    ...Typography.body,
    fontSize: 14,
    color: Colors.text.secondary,
    opacity: 0.7,
    textAlign: 'center',
  },
});
