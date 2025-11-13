/**
 * Weekly Habit Grid Component
 * Shows a 7-day grid for tracking habit completions
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Habit } from '@/types';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@/constants';

interface WeeklyHabitGridProps {
  habits: Habit[];
  weekDates: string[]; // Array of 7 date strings (YYYY-MM-DD)
  onToggleCompletion: (habitId: string, date: string) => void;
  onHabitPress: (habitId: string) => void;
}

export default function WeeklyHabitGrid({
  habits,
  weekDates,
  onToggleCompletion,
  onHabitPress,
}: WeeklyHabitGridProps) {
  const getDayLabel = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    }

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[date.getDay()];
  };

  const getDayNumber = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00');
    return date.getDate();
  };

  const isCompletedOnDate = (habit: Habit, date: string): boolean => {
    return habit.completedDates.includes(date);
  };

  const isHabitScheduledOnDate = (habit: Habit, date: string): boolean => {
    const dayOfWeek = new Date(date + 'T00:00:00').getDay(); // 0 = Sunday

    if (habit.frequencyType === 'daily') {
      return true;
    }

    if (habit.frequencyType === 'custom_days' && habit.customDays) {
      return habit.customDays.includes(dayOfWeek);
    }

    // For weekly frequency, habit is always "available" but not required
    if (habit.frequencyType === 'weekly') {
      return true;
    }

    return true;
  };

  if (habits.length === 0) {
    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyText}>No habits yet</Text>
        <Text style={styles.emptySubtext}>
          Tap the + button to create your first habit
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* Header - Days of week */}
      <View style={styles.header}>
        <View style={styles.habitLabelColumn}>
          <Text style={styles.headerLabel}>Habits</Text>
        </View>
        {weekDates.map((date) => (
          <View key={date} style={styles.dayColumn}>
            <Text style={styles.dayLabel}>{getDayLabel(date)}</Text>
            <Text style={styles.dayNumber}>{getDayNumber(date)}</Text>
          </View>
        ))}
      </View>

      {/* Habit Rows */}
      {habits.map((habit) => (
        <View key={habit.id} style={styles.habitRow}>
          {/* Habit Info */}
          <TouchableOpacity
            style={styles.habitLabelColumn}
            onPress={() => onHabitPress(habit.id)}
          >
            <View style={styles.habitLabel}>
              <Text style={styles.habitIcon}>{habit.icon}</Text>
              <View style={styles.habitTextContainer}>
                <Text style={styles.habitTitle} numberOfLines={1}>
                  {habit.title}
                </Text>
                <View style={styles.habitMeta}>
                  <View
                    style={[
                      styles.streakBadge,
                      { backgroundColor: habit.color || Colors.primary.main},
                    ]}
                  >
                    <Text style={styles.streakText}>
                      {habit.currentStreak}🔥
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </TouchableOpacity>

          {/* Completion Checkboxes */}
          {weekDates.map((date) => {
            const isCompleted = isCompletedOnDate(habit, date);
            const isScheduled = isHabitScheduledOnDate(habit, date);

            return (
              <View key={date} style={styles.dayColumn}>
                <TouchableOpacity
                  style={[
                    styles.checkBox,
                    isCompleted && styles.checkBoxCompleted,
                    !isScheduled && styles.checkBoxUnscheduled,
                    { borderColor: habit.color || Colors.primary.main},
                  ]}
                  onPress={() => onToggleCompletion(habit.id, date)}
                  disabled={!isScheduled}
                >
                  {isCompleted && (
                    <View
                      style={[
                        styles.checkMark,
                        { backgroundColor: habit.color || Colors.primary.main},
                      ]}
                    >
                      <Text style={styles.checkMarkText}>✓</Text>
                    </View>
                  )}
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    ...Typography.h3,
    color: Colors.neutral.gray,
    marginBottom: 8,
  },
  emptySubtext: {
    ...Typography.body,
    color: Colors.neutral.darkGray,
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.neutral.lightGray,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
  },
  headerLabel: {
    ...Typography.small,
    fontWeight: '700',
    color: Colors.text.primary,
    textTransform: 'uppercase',
  },
  habitRow: {
    flexDirection: 'row',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.neutral.white,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
    ...Shadows.small,
  },
  habitLabelColumn: {
    width: 140,
    justifyContent: 'center',
    paddingRight: Spacing.sm,
  },
  habitLabel: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  habitIcon: {
    fontSize: 24,
    marginRight: 8,
  },
  habitTextContainer: {
    flex: 1,
  },
  habitTitle: {
    ...Typography.small,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 2,
  },
  habitMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  streakBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  streakText: {
    ...Typography.caption,
    fontWeight: '700',
    color: Colors.neutral.white,
  },
  dayColumn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayLabel: {
    ...Typography.caption,
    fontWeight: '600',
    color: Colors.text.secondary,
    marginBottom: 2,
  },
  dayNumber: {
    ...Typography.small,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  checkBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.neutral.white,
  },
  checkBoxCompleted: {
    backgroundColor: 'transparent',
  },
  checkBoxUnscheduled: {
    borderColor: Colors.neutral.mediumGray,
    opacity: 0.3,
  },
  checkMark: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkMarkText: {
    color: Colors.neutral.white,
    fontSize: 16,
    fontWeight: '700',
  },
});
