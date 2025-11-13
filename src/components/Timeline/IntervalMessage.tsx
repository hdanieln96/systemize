import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography } from '@/constants';

interface IntervalMessageProps {
  message: string;
  durationMinutes?: number;
}

/**
 * IntervalMessage - Shows rest period between tasks
 * Gray italic text with sleep emoji
 * Height is controlled by parent through absolute positioning
 */
export default function IntervalMessage({
  message,
  durationMinutes,
}: IntervalMessageProps) {
  // Safety check: don't render if message is empty
  if (!message || message.trim() === '') {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.message}>{message}</Text>
      {durationMinutes && durationMinutes > 0 && (
        <Text style={styles.duration}>{formatDuration(durationMinutes)}</Text>
      )}
    </View>
  );
}

function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours === 0) {
    return `${mins} min break`;
  } else if (mins === 0) {
    return `${hours} hr break`;
  } else {
    return `${hours} hr ${mins} min break`;
  }
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8, // Reduced padding
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: {
    ...Typography.caption,
    fontSize: 12,
    fontStyle: 'italic',
    color: Colors.neutral.gray,
    textAlign: 'center',
  },
  duration: {
    ...Typography.caption,
    fontSize: 10,
    color: Colors.neutral.darkGray,
    marginTop: 2,
  },
});
