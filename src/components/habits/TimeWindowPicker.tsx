/**
 * Time Window Picker Component
 * Allows users to select a flexible time window for habits
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

type TimeWindow = 'morning' | 'afternoon' | 'evening' | 'anytime';

interface TimeWindowOption {
  value: TimeWindow;
  label: string;
  icon: string;
  timeRange: string;
}

const TIME_WINDOWS: TimeWindowOption[] = [
  { value: 'morning', label: 'Morning', icon: '🌅', timeRange: '6AM - 12PM' },
  { value: 'afternoon', label: 'Afternoon', icon: '☀️', timeRange: '12PM - 6PM' },
  { value: 'evening', label: 'Evening', icon: '🌙', timeRange: '6PM - 12AM' },
  { value: 'anytime', label: 'Anytime', icon: '⏰', timeRange: 'Flexible' },
];

interface TimeWindowPickerProps {
  value: TimeWindow | undefined;
  onChange: (timeWindow: TimeWindow) => void;
}

export default function TimeWindowPicker({
  value,
  onChange,
}: TimeWindowPickerProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Time Window</Text>
      <Text style={styles.description}>
        When do you prefer to complete this habit?
      </Text>
      <View style={styles.buttonContainer}>
        {TIME_WINDOWS.map((window) => (
          <TouchableOpacity
            key={window.value}
            style={[
              styles.windowButton,
              value === window.value && styles.windowButtonSelected,
            ]}
            onPress={() => onChange(window.value)}
            activeOpacity={0.7}
          >
            <Text style={styles.windowIcon}>{window.icon}</Text>
            <View style={styles.windowTextContainer}>
              <Text
                style={[
                  styles.windowLabel,
                  value === window.value && styles.windowLabelSelected,
                ]}
              >
                {window.label}
              </Text>
              <Text
                style={[
                  styles.windowTimeRange,
                  value === window.value && styles.windowTimeRangeSelected,
                ]}
              >
                {window.timeRange}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 12,
  },
  buttonContainer: {
    gap: 8,
  },
  windowButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  windowButtonSelected: {
    backgroundColor: '#EEF2FF',
    borderColor: '#6366F1',
  },
  windowIcon: {
    fontSize: 28,
    marginRight: 12,
  },
  windowTextContainer: {
    flex: 1,
  },
  windowLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  windowLabelSelected: {
    color: '#6366F1',
  },
  windowTimeRange: {
    fontSize: 13,
    color: '#9CA3AF',
  },
  windowTimeRangeSelected: {
    color: '#818CF8',
  },
});
