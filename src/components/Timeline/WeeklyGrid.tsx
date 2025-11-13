import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing } from '@/constants';
import { Task } from '@/types';
import DayColumn from './DayColumn';

interface WeeklyGridProps {
  weekDates: string[]; // Array of 7 dates ["2025-11-09", "2025-11-10", ...]
  tasks: Task[]; // All tasks for the week
  selectedDate: string;
  onDateSelect: (date: string) => void;
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
}: WeeklyGridProps) {
  const insets = useSafeAreaInsets();
  const today = '2025-11-11'; // TODO: Replace with actual current date from utils

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <View style={styles.container}>
      {/* Month header */}
      <View style={[styles.header, { paddingTop: insets.top + Spacing.sm }]}>
        <Text style={styles.monthText}>November 2025</Text>
        <Text style={styles.chevron}>❯</Text>
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
  monthText: {
    ...Typography.h3,
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  chevron: {
    fontSize: 16,
    color: Colors.primary.main,
  },
  gridContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.sm,
    justifyContent: 'space-between',
  },
});
