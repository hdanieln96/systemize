/**
 * Weekly Target Picker Component
 * Allows users to select how many times per week they want to complete a habit
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface WeeklyTargetPickerProps {
  value: number | undefined;
  onChange: (target: number) => void;
}

const TARGET_OPTIONS = [1, 2, 3, 4, 5, 6, 7];

export default function WeeklyTargetPicker({
  value,
  onChange,
}: WeeklyTargetPickerProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Weekly Target</Text>
      <Text style={styles.description}>
        How many times per week do you want to do this?
      </Text>
      <View style={styles.buttonContainer}>
        {TARGET_OPTIONS.map((target) => (
          <TouchableOpacity
            key={target}
            style={[
              styles.targetButton,
              value === target && styles.targetButtonSelected,
            ]}
            onPress={() => onChange(target)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.targetNumber,
                value === target && styles.targetNumberSelected,
              ]}
            >
              {target}
            </Text>
            <Text
              style={[
                styles.targetLabel,
                value === target && styles.targetLabelSelected,
              ]}
            >
              {target === 1 ? 'time' : 'times'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {value && (
        <Text style={styles.summary}>
          Target: {value}x per week{value === 7 ? ' (Every day)' : ''}
        </Text>
      )}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  targetButton: {
    flex: 1,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  targetButtonSelected: {
    backgroundColor: '#EEF2FF',
    borderColor: '#6366F1',
  },
  targetNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 2,
  },
  targetNumberSelected: {
    color: '#6366F1',
  },
  targetLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: '#9CA3AF',
  },
  targetLabelSelected: {
    color: '#818CF8',
  },
  summary: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: '500',
    color: '#6366F1',
    textAlign: 'center',
  },
});
