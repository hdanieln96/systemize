import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography } from '@/constants';

interface TimeRulerProps {
  wakeTime: string; // "06:00"
  sleepTime: string; // "23:00"
  pixelsPerHour?: number;
}

/**
 * TimeRuler - Displays hourly time labels along the left side
 * Shows hours from wake time to sleep time
 */
export default function TimeRuler({
  wakeTime,
  sleepTime,
  pixelsPerHour = 120,
}: TimeRulerProps) {
  const hours = generateHourLabels(wakeTime, sleepTime);

  // Safety check: don't render if no hours
  if (hours.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      {hours.map((hour, index) => (
        <View
          key={`${hour}-${index}`}
          style={[styles.hourLabel, { height: pixelsPerHour }]}
        >
          <Text style={styles.hourText}>{hour}</Text>
          {index < hours.length - 1 && <View style={styles.tickMark} />}
        </View>
      ))}
    </View>
  );
}

function generateHourLabels(wakeTime: string, sleepTime: string): string[] {
  const [wakeHour] = wakeTime.split(':').map(Number);
  const [sleepHour] = sleepTime.split(':').map(Number);

  const labels: string[] = [];
  let currentHour = wakeHour;

  while (currentHour <= sleepHour) {
    const period = currentHour >= 12 ? 'PM' : 'AM';
    const displayHour = currentHour % 12 || 12;
    labels.push(`${displayHour} ${period}`);

    currentHour++;
    if (currentHour > 23) break; // Safety check
  }

  return labels;
}

const RULER_WIDTH = 60;

const styles = StyleSheet.create({
  container: {
    width: RULER_WIDTH,
    paddingRight: 8,
  },
  hourLabel: {
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    position: 'relative',
  },
  hourText: {
    ...Typography.caption,
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text.secondary,
  },
  tickMark: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: 4,
    height: 1,
    backgroundColor: Colors.neutral.mediumGray,
  },
});
