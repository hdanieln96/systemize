/**
 * Weekly Date Header Component
 * Shows Sun-Sat date row similar to Timeline screen's WeeklyGrid
 * Displays below the calendar and above habit preview rows
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants';

interface WeeklyDateHeaderProps {
  weekDates: string[]; // Array of 7 date strings (YYYY-MM-DD)
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

export default function WeeklyDateHeader({
  weekDates,
  selectedDate,
  onDateSelect,
}: WeeklyDateHeaderProps) {
  const getDayLabel = (dateStr: string): string => {
    const date = new Date(dateStr + 'T00:00:00');
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[date.getDay()];
  };

  const getDayNumber = (dateStr: string): number => {
    const date = new Date(dateStr + 'T00:00:00');
    return date.getDate();
  };

  const isToday = (dateStr: string): boolean => {
    const date = new Date(dateStr + 'T00:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (dateStr: string): boolean => {
    const date = new Date(dateStr + 'T00:00:00');
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };

  return (
    <View style={styles.container}>
      {weekDates.map((dateStr) => {
        const today = isToday(dateStr);
        const selected = isSelected(dateStr);
        const date = new Date(dateStr + 'T00:00:00');

        return (
          <TouchableOpacity
            key={dateStr}
            style={[
              styles.dayColumn,
              selected && styles.dayColumnSelected,
            ]}
            onPress={() => onDateSelect(date)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.dayLabel,
                today && styles.dayLabelToday,
                selected && styles.dayLabelSelected,
              ]}
            >
              {getDayLabel(dateStr)}
            </Text>
            <View
              style={[
                styles.dateCircle,
                today && styles.dateCircleToday,
                selected && styles.dateCircleSelected,
              ]}
            >
              <Text
                style={[
                  styles.dateNumber,
                  today && styles.dateNumberToday,
                  selected && styles.dateNumberSelected,
                ]}
              >
                {getDayNumber(dateStr)}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.neutral.white,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    marginBottom: Spacing.md,
  },
  dayColumn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  dayColumnSelected: {
    backgroundColor: Colors.primary.main + '08',
    borderRadius: BorderRadius.sm,
  },
  dayLabel: {
    ...Typography.caption,
    fontWeight: '600',
    color: Colors.text.secondary,
    marginBottom: 6,
  },
  dayLabelToday: {
    color: Colors.primary.main,
  },
  dayLabelSelected: {
    color: Colors.primary.main,
    fontWeight: '700',
  },
  dateCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  dateCircleToday: {
    backgroundColor: Colors.primary.main + '15',
  },
  dateCircleSelected: {
    backgroundColor: Colors.primary.main,
  },
  dateNumber: {
    ...Typography.body,
    fontWeight: '500',
    color: Colors.text.primary,
  },
  dateNumberToday: {
    fontWeight: '700',
    color: Colors.primary.main,
  },
  dateNumberSelected: {
    color: Colors.neutral.white,
    fontWeight: '700',
  },
});
