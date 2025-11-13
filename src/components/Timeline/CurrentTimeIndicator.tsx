import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Colors, Typography } from '@/constants';

interface CurrentTimeIndicatorProps {
  wakeTime: string; // HH:MM format
  pixelsPerMinute: number;
}

/**
 * CurrentTimeIndicator - Shows current time as a line with animated dot
 * Only shown when viewing today's schedule
 * Updates every minute
 */
export default function CurrentTimeIndicator({
  wakeTime,
  pixelsPerMinute,
}: CurrentTimeIndicatorProps) {
  const [currentTime, setCurrentTime] = useState(getCurrentTimeString());
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Update time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(getCurrentTimeString());
    }, 60000); // Update every 60 seconds

    return () => clearInterval(interval);
  }, []);

  // Pulse animation for the dot
  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.3,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );

    animation.start();

    return () => animation.stop();
  }, [pulseAnim]);

  // Calculate Y position based on current time
  const currentMinutes = timeToMinutes(currentTime);
  const wakeMinutes = timeToMinutes(wakeTime);
  const minutesSinceWake = Math.max(0, currentMinutes - wakeMinutes);
  const topPosition = minutesSinceWake * pixelsPerMinute;

  // Format time for display (e.g., "2:30 PM")
  const displayTime = formatTimeDisplay(currentTime);

  return (
    <View style={[styles.container, { top: topPosition }]}>
      {/* Time label on left */}
      <Text style={styles.timeText}>{displayTime}</Text>

      {/* Animated dot */}
      <Animated.View
        style={[
          styles.dot,
          { transform: [{ scale: pulseAnim }] }
        ]}
      />

      {/* Horizontal line */}
      <View style={styles.line} />
    </View>
  );
}

/**
 * Get current time as HH:MM string
 */
function getCurrentTimeString(): string {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

/**
 * Convert time string (HH:MM) to minutes since midnight
 */
function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

/**
 * Format time for display (7:00 AM, 2:30 PM, etc.)
 */
function formatTimeDisplay(time: string): string {
  const [hours, minutes] = time.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 100,
    paddingLeft: 16,
  },
  timeText: {
    ...Typography.caption,
    fontSize: 11,
    fontWeight: '600',
    color: Colors.timeline.currentTime,
    backgroundColor: Colors.background.primary,
    paddingHorizontal: 4,
    paddingVertical: 2,
    marginRight: 8,
    minWidth: 60,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.timeline.currentTime,
    shadowColor: Colors.timeline.currentTime,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 4,
    elevation: 4,
  },
  line: {
    flex: 1,
    height: 2,
    backgroundColor: Colors.timeline.currentTime,
    opacity: 0.8,
    marginLeft: 4,
    marginRight: 16,
  },
});
