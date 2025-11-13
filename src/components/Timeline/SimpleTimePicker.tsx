import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants';

interface SimpleTimePickerProps {
  value: Date;
  onChange: (date: Date) => void;
}

/**
 * SimpleTimePicker - Custom time picker without DateTimePicker dependency
 * Shows a modal with hour and minute scroll pickers
 */
export default function SimpleTimePicker({ value, onChange }: SimpleTimePickerProps) {
  const [showPicker, setShowPicker] = useState(false);
  const [selectedHour, setSelectedHour] = useState(value.getHours());
  const [selectedMinute, setSelectedMinute] = useState(value.getMinutes());

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  const formatTime = (date: Date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  const handleConfirm = () => {
    const newDate = new Date(value);
    newDate.setHours(selectedHour, selectedMinute, 0, 0);
    onChange(newDate);
    setShowPicker(false);
  };

  return (
    <>
      <TouchableOpacity style={styles.timeButton} onPress={() => setShowPicker(true)}>
        <Text style={styles.timeButtonText}>{formatTime(value)}</Text>
      </TouchableOpacity>

      <Modal visible={showPicker} transparent animationType="fade" onRequestClose={() => setShowPicker(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.pickerContainer}>
            <View style={styles.pickerHeader}>
              <Text style={styles.pickerTitle}>Select Time</Text>
            </View>

            <View style={styles.pickerBody}>
              {/* Hour picker */}
              <View style={styles.column}>
                <Text style={styles.columnLabel}>Hour</Text>
                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false} nestedScrollEnabled={true}>
                  {hours.map((hour) => (
                    <TouchableOpacity
                      key={hour}
                      style={[styles.timeOption, selectedHour === hour && styles.timeOptionSelected]}
                      onPress={() => setSelectedHour(hour)}
                    >
                      <Text style={[styles.timeOptionText, selectedHour === hour && styles.timeOptionTextSelected]}>
                        {hour.toString().padStart(2, '0')}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {/* Minute picker */}
              <View style={styles.column}>
                <Text style={styles.columnLabel}>Minute</Text>
                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false} nestedScrollEnabled={true}>
                  {minutes.map((minute) => (
                    <TouchableOpacity
                      key={minute}
                      style={[styles.timeOption, selectedMinute === minute && styles.timeOptionSelected]}
                      onPress={() => setSelectedMinute(minute)}
                    >
                      <Text style={[styles.timeOptionText, selectedMinute === minute && styles.timeOptionTextSelected]}>
                        {minute.toString().padStart(2, '0')}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>

            <View style={styles.pickerFooter}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setShowPicker(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
                <Text style={styles.confirmButtonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  timeButton: {
    backgroundColor: Colors.background.secondary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  timeButtonText: {
    ...Typography.body,
    fontSize: 18,
    fontWeight: '600',
    color: Colors.primary.main,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  pickerContainer: {
    backgroundColor: Colors.neutral.white,
    borderRadius: BorderRadius.lg,
    width: '100%',
    maxWidth: 320,
    maxHeight: '70%',
  },
  pickerHeader: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral.lightGray,
  },
  pickerTitle: {
    ...Typography.h3,
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text.primary,
    textAlign: 'center',
  },
  pickerBody: {
    flexDirection: 'row',
    padding: Spacing.md,
    height: 300,
  },
  column: {
    flex: 1,
    marginHorizontal: Spacing.xs,
  },
  columnLabel: {
    ...Typography.caption,
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text.secondary,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  scrollView: {
    flex: 1,
  },
  timeOption: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.xs,
    alignItems: 'center',
  },
  timeOptionSelected: {
    backgroundColor: Colors.primary.lighter,
  },
  timeOptionText: {
    ...Typography.body,
    fontSize: 16,
    color: Colors.text.primary,
  },
  timeOptionTextSelected: {
    color: Colors.primary.main,
    fontWeight: '700',
  },
  pickerFooter: {
    flexDirection: 'row',
    padding: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral.lightGray,
    gap: Spacing.sm,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.background.secondary,
    alignItems: 'center',
  },
  cancelButtonText: {
    ...Typography.body,
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  confirmButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.primary.main,
    alignItems: 'center',
  },
  confirmButtonText: {
    ...Typography.body,
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutral.white,
  },
});
