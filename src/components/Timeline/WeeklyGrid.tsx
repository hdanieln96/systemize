import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing } from '@/constants';
import { Task } from '@/types';
import DayColumn from './DayColumn';

interface WeeklyGridProps {
  weekDates: string[]; // Array of 7 dates ["2025-11-09", "2025-11-10", ...]
  tasks: Task[]; // All tasks for the week
  selectedDate: string;
  onDateSelect: (date: string) => void;
  weekOffset?: number; // 0 = current week, -1 = last week, +1 = next week
  onPreviousWeek?: () => void;
  onNextWeek?: () => void;
  onGoToToday?: () => void;
}

/**
 * WeeklyGrid - Shows 7-day week view with task icons
 * Displays at top of screen, above the daily modal
 */
export default function WeeklyGrid({
  weekDates,
  tasks,
  selectedDate,
  onDateSelect,
  weekOffset = 0,
  onPreviousWeek,
  onNextWeek,
  onGoToToday,
}: WeeklyGridProps) {
  const insets = useSafeAreaInsets();

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Get dynamic month/year from first date in week
  const monthYearText = weekDates.length > 0
    ? (() => {
        const firstDate = new Date(weekDates[0]);
        const monthNames = [
          'January', 'February', 'March', 'April', 'May', 'June',
          'July', 'August', 'September', 'October', 'November', 'December'
        ];
        return `${monthNames[firstDate.getMonth()]} ${firstDate.getFullYear()}`;
      })()
    : '';

  return (
    <View style={styles.container}>
      {/* Month header with navigation */}
      <View style={[styles.header, { paddingTop: insets.top + Spacing.sm }]}>
        {/* Previous week button */}
        <TouchableOpacity
          onPress={onPreviousWeek}
          style={styles.navButton}
          accessibilityLabel="Previous week"
          accessibilityRole="button"
        >
          <Text style={styles.navButtonText}>‹</Text>
        </TouchableOpacity>

        {/* Month/Year and Today button */}
        <View style={styles.centerContainer}>
          <Text style={styles.monthText}>{monthYearText}</Text>
          {weekOffset !== 0 && onGoToToday && (
            <TouchableOpacity
              onPress={onGoToToday}
              style={styles.todayButton}
              accessibilityLabel="Jump to today"
              accessibilityRole="button"
            >
              <Text style={styles.todayButtonText}>Today</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Next week button */}
        <TouchableOpacity
          onPress={onNextWeek}
          style={styles.navButton}
          accessibilityLabel="Next week"
          accessibilityRole="button"
        >
          <Text style={styles.navButtonText}>›</Text>
        </TouchableOpacity>
      </View>

      {/* Day columns */}
      <View style={styles.gridContainer}>
        {weekDates.map((date, index) => {
          const dayNumber = parseInt(date.split('-')[2], 10);
          const tasksForDay = tasks.filter(task => task.date === date);

          return (
            <DayColumn
              key={date}
              date={date}
              dayName={dayNames[index]}
              dayNumber={dayNumber}
              tasks={tasksForDay}
              isToday={date === today}
              isSelected={date === selectedDate}
              onPress={() => onDateSelect(date)}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background.primary,
    paddingBottom: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  navButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  navButtonText: {
    fontSize: 32,
    fontWeight: '300',
    color: Colors.primary.main,
    lineHeight: 36,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthText: {
    ...Typography.h3,
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  todayButton: {
    marginTop: 4,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: Colors.primary.main,
  },
  todayButtonText: {
    ...Typography.caption,
    fontSize: 12,
    fontWeight: '600',
    color: Colors.neutral.white,
  },
  gridContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.sm,
    justifyContent: 'space-between',
  },
});
