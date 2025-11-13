/**
 * Habit Item Component
 * Displays a single habit row with completion button and stats
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Habit } from '@/types';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@/constants';

interface HabitItemProps {
  habit: Habit;
  isCompletedToday: boolean;
  onToggleCompletion: (habitId: string) => void;
  onPress: (habitId: string) => void;
}

export default function HabitItem({
  habit,
  isCompletedToday,
  onToggleCompletion,
  onPress,
}: HabitItemProps) {
  const getTimeDisplay = () => {
    if (habit.time) {
      // Convert 24h to 12h format
      const [hours, minutes] = habit.time.split(':');
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour % 12 || 12;
      return `${displayHour}:${minutes} ${ampm}`;
    }
    if (habit.timeWindow) {
      const icons = {
        morning: '🌅',
        afternoon: '☀️',
        evening: '🌙',
        anytime: '⏰',
      };
      return icons[habit.timeWindow];
    }
    return null;
  };

  const getFrequencyDisplay = () => {
    if (habit.frequencyType === 'weekly' && habit.weeklyTarget) {
      return `${habit.weeklyTarget}x/week`;
    }
    if (habit.frequencyType === 'daily') {
      return 'Daily';
    }
    if (habit.frequencyType === 'custom_days' && habit.customDays) {
      return `${habit.customDays.length} days/week`;
    }
    return null;
  };

  const getEndDateDisplay = () => {
    if (!habit.endDate) return null;

    const endDate = new Date(habit.endDate + 'T00:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const daysLeft = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (daysLeft < 0) {
      return '⏱️ Completed';
    } else if (daysLeft === 0) {
      return '⏱️ Last day!';
    } else if (daysLeft === 1) {
      return '⏱️ 1 day left';
    } else {
      return `⏱️ ${daysLeft} days left`;
    }
  };

  const getUnitDisplay = () => {
    if (!habit.unitTarget || !habit.unitType) return null;
    return `${habit.unitTarget} ${habit.unitType}`;
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        isCompletedToday && styles.containerCompleted,
      ]}
      onPress={() => onPress(habit.id)}
      activeOpacity={0.7}
    >
      <View style={styles.leftSection}>
        {/* Completion Button */}
        <TouchableOpacity
          style={[
            styles.checkButton,
            isCompletedToday && styles.checkButtonCompleted,
            { backgroundColor: habit.color || Colors.primary.main},
          ]}
          onPress={(e) => {
            e.stopPropagation();
            onToggleCompletion(habit.id);
          }}
        >
          {isCompletedToday && (
            <Text style={styles.checkmark}>✓</Text>
          )}
        </TouchableOpacity>

        {/* Habit Info */}
        <View style={styles.habitInfo}>
          <View style={styles.titleRow}>
            <Text style={styles.icon}>{habit.icon}</Text>
            <Text
              style={[
                styles.title,
                isCompletedToday && styles.titleCompleted,
              ]}
              numberOfLines={1}
            >
              {habit.title}
            </Text>
          </View>

          <View style={styles.metaRow}>
            {getTimeDisplay() && (
              <Text style={styles.metaText}>{getTimeDisplay()}</Text>
            )}
            {getFrequencyDisplay() && (
              <>
                {getTimeDisplay() && <Text style={styles.metaDot}>•</Text>}
                <Text style={styles.metaText}>{getFrequencyDisplay()}</Text>
              </>
            )}
            {getUnitDisplay() && (
              <>
                <Text style={styles.metaDot}>•</Text>
                <Text style={styles.metaText}>{getUnitDisplay()}</Text>
              </>
            )}
            {habit.duration && (
              <>
                <Text style={styles.metaDot}>•</Text>
                <Text style={styles.metaText}>{habit.duration}</Text>
              </>
            )}
            {getEndDateDisplay() && (
              <>
                <Text style={styles.metaDot}>•</Text>
                <Text style={[styles.metaText, styles.endDateText]}>
                  {getEndDateDisplay()}
                </Text>
              </>
            )}
          </View>
        </View>
      </View>

      {/* Stats Section */}
      <View style={styles.statsSection}>
        <View style={styles.statBadge}>
          <Text style={styles.statNumber}>{habit.currentStreak}</Text>
          <Text style={styles.statLabel}>🔥</Text>
        </View>
        {habit.type === 'building' && (
          <View style={styles.completionRate}>
            <Text style={styles.completionText}>
              {Math.round(habit.completionRate)}%
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    backgroundColor: Colors.neutral.white,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
    ...Shadows.small,
  },
  containerCompleted: {
    backgroundColor: Colors.neutral.lightGray,
    opacity: 0.8,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  checkButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  checkButtonCompleted: {
    opacity: 0.8,
  },
  checkmark: {
    color: Colors.neutral.white,
    fontSize: 18,
    fontWeight: '700',
  },
  habitInfo: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  icon: {
    fontSize: 20,
    marginRight: 8,
  },
  title: {
    ...Typography.body,
    fontWeight: '600',
    color: Colors.text.primary,
    flex: 1,
  },
  titleCompleted: {
    color: Colors.neutral.darkGray,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  metaText: {
    ...Typography.small,
    color: Colors.text.secondary,
  },
  metaDot: {
    ...Typography.small,
    color: Colors.neutral.gray,
    marginHorizontal: 6,
  },
  endDateText: {
    color: Colors.accent.orange,
    fontWeight: '600',
  },
  statsSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  statBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.neutral.lightGray,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  statNumber: {
    ...Typography.small,
    fontWeight: '700',
    color: Colors.text.primary,
    marginRight: 2,
  },
  statLabel: {
    fontSize: 12,
  },
  completionRate: {
    backgroundColor: Colors.primary.main + '15',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  completionText: {
    ...Typography.small,
    fontWeight: '600',
    color: Colors.primary.main,
  },
});
