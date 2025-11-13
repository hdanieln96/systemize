import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants';

type TaskType = 'alarm' | 'habit' | 'timeblock';

interface TypeSelectorProps {
  selectedType: TaskType;
  onSelectType: (type: TaskType) => void;
}

interface TypeOption {
  type: TaskType;
  label: string;
  icon: string;
  description: string;
}

const TASK_TYPES: TypeOption[] = [
  {
    type: 'alarm',
    label: 'Alarm',
    icon: '⏰',
    description: 'One-time reminder',
  },
  {
    type: 'habit',
    label: 'Habit',
    icon: '✅',
    description: 'Recurring activity',
  },
  {
    type: 'timeblock',
    label: 'Time Block',
    icon: '📅',
    description: 'Scheduled duration',
  },
];

/**
 * TypeSelector - Pill-style selector for task type
 * Shows three options: Alarm, Habit, Time Block
 */
export default function TypeSelector({ selectedType, onSelectType }: TypeSelectorProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Task Type</Text>
      <View style={styles.optionsContainer}>
        {TASK_TYPES.map((option) => {
          const isSelected = selectedType === option.type;

          return (
            <TouchableOpacity
              key={option.type}
              style={[styles.option, isSelected && styles.optionSelected]}
              onPress={() => onSelectType(option.type)}
              activeOpacity={0.7}
            >
              <Text style={styles.optionIcon}>{option.icon}</Text>
              <View style={styles.optionText}>
                <Text style={[styles.optionLabel, isSelected && styles.optionLabelSelected]}>
                  {option.label}
                </Text>
                <Text
                  style={[styles.optionDescription, isSelected && styles.optionDescriptionSelected]}
                >
                  {option.description}
                </Text>
              </View>
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
    marginBottom: Spacing.sm,
    paddingHorizontal: Spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  optionsContainer: {
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.background.secondary,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionSelected: {
    backgroundColor: Colors.primary.lighter,
    borderColor: Colors.primary.main,
  },
  optionIcon: {
    fontSize: 32,
    marginRight: Spacing.md,
  },
  optionText: {
    flex: 1,
  },
  optionLabel: {
    ...Typography.body,
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 2,
  },
  optionLabelSelected: {
    color: Colors.primary.dark,
  },
  optionDescription: {
    ...Typography.caption,
    fontSize: 12,
    color: Colors.text.secondary,
  },
  optionDescriptionSelected: {
    color: Colors.primary.main,
  },
});
