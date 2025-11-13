/**
 * Monthly Habit Calendar Component
 * Calendar header showing the full month with habit completion dots
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Habit } from '@/types';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@/constants';

interface MonthlyHabitCalendarProps {
  selectedDate: Date;
  habits: Habit[];
  onDateChange: (date: Date) => void;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
}

export default function MonthlyHabitCalendar({
  selectedDate,
  habits,
  onDateChange,
  isExpanded = false,
  onToggleExpand,
}: MonthlyHabitCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date(selectedDate));

  // Get calendar data
  const getCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startingDayOfWeek = firstDay.getDay();

    const days: (Date | null)[] = [];

    // Add empty slots for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let day = 1; day <= lastDay.getDate(); day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const getCompletionCountForDate = (date: Date): number => {
    const dateStr = date.toISOString().split('T')[0];
    let count = 0;

    for (const habit of habits) {
      if (habit.completedDates.includes(dateStr)) {
        count++;
      }
    }

    return count;
  };

  const isToday = (date: Date): boolean => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isSelectedDate = (date: Date): boolean => {
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };

  const goToPreviousMonth = () => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() - 1);
    setCurrentMonth(newMonth);
  };

  const goToNextMonth = () => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() + 1);
    setCurrentMonth(newMonth);
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentMonth(today);
    onDateChange(today);
  };

  const monthName = currentMonth.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const calendarDays = getCalendarDays();
  const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  // Compact mode - just show month header
  if (!isExpanded) {
    return (
      <TouchableOpacity
        style={styles.compactContainer}
        onPress={onToggleExpand}
        activeOpacity={0.7}
      >
        <View style={styles.compactHeader}>
          <Text style={styles.compactMonthTitle}>{monthName}</Text>
          <Text style={styles.expandIcon}>▼</Text>
        </View>
      </TouchableOpacity>
    );
  }

  // Expanded mode - full calendar
  return (
    <View style={styles.container}>
      {/* Month Header */}
      <TouchableOpacity
        style={styles.header}
        onPress={onToggleExpand}
        activeOpacity={0.9}
      >
        <TouchableOpacity onPress={goToPreviousMonth} style={styles.navButton}>
          <Text style={styles.navButtonText}>‹</Text>
        </TouchableOpacity>

        <View style={styles.monthTitleContainer}>
          <Text style={styles.monthTitle}>{monthName}</Text>
          <TouchableOpacity onPress={goToToday} style={styles.todayButton}>
            <Text style={styles.todayButtonText}>Today</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={goToNextMonth} style={styles.navButton}>
          <Text style={styles.navButtonText}>›</Text>
        </TouchableOpacity>
      </TouchableOpacity>

      {/* Week Day Labels */}
      <View style={styles.weekDaysRow}>
        {weekDays.map((day, index) => (
          <View key={index} style={styles.weekDayCell}>
            <Text style={styles.weekDayLabel}>{day}</Text>
          </View>
        ))}
      </View>

      {/* Calendar Grid */}
      <View style={styles.calendarGrid}>
        {calendarDays.map((date, index) => {
          if (!date) {
            return <View key={`empty-${index}`} style={styles.dayCell} />;
          }

          const completionCount = getCompletionCountForDate(date);
          const today = isToday(date);
          const selected = isSelectedDate(date);

          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.dayCell,
                today && styles.dayCellToday,
                selected && styles.dayCellSelected,
              ]}
              onPress={() => onDateChange(date)}
            >
              <Text
                style={[
                  styles.dayNumber,
                  today && styles.dayNumberToday,
                  selected && styles.dayNumberSelected,
                ]}
              >
                {date.getDate()}
              </Text>

              {/* Completion Dots */}
              {completionCount > 0 && (
                <View style={styles.dotsContainer}>
                  {completionCount <= 3 ? (
                    // Show individual dots for 1-3 completions
                    Array.from({ length: completionCount }).map((_, i) => (
                      <View key={i} style={styles.completionDot} />
                    ))
                  ) : (
                    // Show count for 4+ completions
                    <View style={styles.completionBadge}>
                      <Text style={styles.completionBadgeText}>
                        {completionCount}
                      </Text>
                    </View>
                  )}
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Summary Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {habits.filter((h) => h.type === 'building').length}
          </Text>
          <Text style={styles.statLabel}>Building</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {habits.filter((h) => h.type === 'breaking').length}
          </Text>
          <Text style={styles.statLabel}>Breaking</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {Math.max(...habits.map((h) => h.currentStreak), 0)}
          </Text>
          <Text style={styles.statLabel}>Best Streak 🔥</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  compactContainer: {
    backgroundColor: Colors.neutral.white,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.small,
  },
  compactHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  compactMonthTitle: {
    ...Typography.h3,
    color: Colors.text.primary,
    fontWeight: '600',
  },
  expandIcon: {
    fontSize: 16,
    color: Colors.text.secondary,
  },
  container: {
    backgroundColor: Colors.neutral.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    ...Shadows.medium,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  navButton: {
    padding: Spacing.sm,
  },
  navButtonText: {
    fontSize: 28,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  monthTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  monthTitle: {
    ...Typography.h3,
    color: Colors.text.primary,
  },
  todayButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    backgroundColor: Colors.primary.main + '15',
    borderRadius: BorderRadius.sm,
  },
  todayButtonText: {
    ...Typography.small,
    fontWeight: '600',
    color: Colors.primary.main,
  },
  weekDaysRow: {
    flexDirection: 'row',
    marginBottom: Spacing.sm,
  },
  weekDayCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.xs,
  },
  weekDayLabel: {
    ...Typography.small,
    fontWeight: '600',
    color: Colors.text.secondary,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
    position: 'relative',
  },
  dayCellToday: {
    backgroundColor: Colors.primary.main + '10',
    borderRadius: BorderRadius.sm,
  },
  dayCellSelected: {
    backgroundColor: Colors.primary.main,
    borderRadius: BorderRadius.sm,
  },
  dayNumber: {
    ...Typography.body,
    color: Colors.text.primary,
    fontWeight: '500',
  },
  dayNumberToday: {
    fontWeight: '700',
    color: Colors.primary.main,
  },
  dayNumberSelected: {
    color: Colors.neutral.white,
    fontWeight: '700',
  },
  dotsContainer: {
    position: 'absolute',
    bottom: 2,
    flexDirection: 'row',
    gap: 2,
  },
  completionDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.success,
  },
  completionBadge: {
    backgroundColor: Colors.success,
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 1,
    minWidth: 16,
    alignItems: 'center',
  },
  completionBadgeText: {
    fontSize: 8,
    fontWeight: '700',
    color: Colors.neutral.white,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: Spacing.lg,
    paddingTop: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral.mediumGray,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    ...Typography.h2,
    color: Colors.text.primary,
    marginBottom: 2,
  },
  statLabel: {
    ...Typography.small,
    color: Colors.text.secondary,
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: Colors.neutral.mediumGray,
  },
});
