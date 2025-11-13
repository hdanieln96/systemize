import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants';

interface NotificationSelectorProps {
  selectedNotifications: number[];
  onChange: (notifications: number[]) => void;
}

// Notification options in minutes before event
const NOTIFICATION_OPTIONS = [
  { label: 'At time of event', value: 0 },
  { label: '5 minutes before', value: 5 },
  { label: '10 minutes before', value: 10 },
  { label: '15 minutes before', value: 15 },
  { label: '30 minutes before', value: 30 },
];

/**
 * NotificationSelector - Multi-select notification options
 * Shows as toggleable chips for selecting reminder times
 */
export default function NotificationSelector({
  selectedNotifications,
  onChange,
}: NotificationSelectorProps) {
  const toggleNotification = (value: number) => {
    const isSelected = selectedNotifications.includes(value);

    if (isSelected) {
      // Remove from selection
      onChange(selectedNotifications.filter((n) => n !== value));
    } else {
      // Add to selection
      onChange([...selectedNotifications, value].sort((a, b) => a - b));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Notifications</Text>
      <Text style={styles.hint}>Select when you'd like to be reminded</Text>
      <View style={styles.optionsContainer}>
        {NOTIFICATION_OPTIONS.map((option) => {
          const isSelected = selectedNotifications.includes(option.value);

          return (
            <TouchableOpacity
              key={option.value}
              style={[styles.chip, isSelected && styles.chipSelected]}
              onPress={() => toggleNotification(option.value)}
              activeOpacity={0.7}
            >
              <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                {option.label}
              </Text>
              {isSelected && <Text style={styles.checkIcon}>✓</Text>}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: Spacing.md,
  },
  label: {
    ...Typography.small,
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text.secondary,
    marginBottom: Spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  hint: {
    ...Typography.small,
    fontSize: 12,
    color: Colors.text.tertiary,
    marginBottom: Spacing.md,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.full,
    borderWidth: 2,
    borderColor: Colors.neutral.lightGray,
  },
  chipSelected: {
    backgroundColor: Colors.primary.lighter,
    borderColor: Colors.primary.main,
  },
  chipText: {
    ...Typography.body,
    fontSize: 14,
    color: Colors.text.secondary,
    fontWeight: '500',
  },
  chipTextSelected: {
    color: Colors.primary.main,
    fontWeight: '600',
  },
  checkIcon: {
    fontSize: 14,
    color: Colors.primary.main,
    marginLeft: Spacing.xs,
    fontWeight: 'bold',
  },
});
