import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Dimensions,
} from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants';

interface DatePickerProps {
  visible: boolean;
  selectedDate: string; // YYYY-MM-DD format
  onClose: () => void;
  onSelectDate: (date: string) => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

/**
 * DatePicker - Calendar modal for selecting dates
 * Shows formatted date with "Today" quick action
 */
export default function DatePicker({
  visible,
  selectedDate,
  onClose,
  onSelectDate,
}: DatePickerProps) {
  const handleDayPress = (day: DateData) => {
    onSelectDate(day.dateString);
    onClose();
  };

  const handleTodayPress = () => {
    const today = new Date().toISOString().split('T')[0];
    onSelectDate(today);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
      presentationStyle="overFullScreen"
      statusBarTranslucent
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.modalContainer} onStartShouldSetResponder={() => true}>
          <View style={styles.header}>
            <Text style={styles.title}>Select Date</Text>
            <TouchableOpacity onPress={handleTodayPress} style={styles.todayButton}>
              <Text style={styles.todayText}>Today</Text>
            </TouchableOpacity>
          </View>

          <Calendar
            current={selectedDate}
            hideExtraDays={true}
            enableSwipeMonths={true}
            markedDates={{
              [selectedDate]: {
                selected: true,
                selectedColor: Colors.primary.main,
              },
            }}
            onDayPress={handleDayPress}
            theme={{
              backgroundColor: Colors.neutral.white,
              calendarBackground: Colors.neutral.white,
              textSectionTitleColor: Colors.text.secondary,
              selectedDayBackgroundColor: Colors.primary.main,
              selectedDayTextColor: Colors.neutral.white,
              todayTextColor: Colors.primary.main,
              dayTextColor: Colors.text.primary,
              textDisabledColor: Colors.text.tertiary,
              dotColor: Colors.primary.main,
              selectedDotColor: Colors.neutral.white,
              arrowColor: Colors.primary.main,
              monthTextColor: Colors.text.primary,
              indicatorColor: Colors.primary.main,
              textDayFontFamily: 'System',
              textMonthFontFamily: 'System',
              textDayHeaderFontFamily: 'System',
              textDayFontWeight: '400',
              textMonthFontWeight: '600',
              textDayHeaderFontWeight: '600',
              textDayFontSize: 16,
              textMonthFontSize: 18,
              textDayHeaderFontSize: 14,
            }}
            style={styles.calendar}
          />
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: Colors.neutral.white,
    borderRadius: BorderRadius.xl,
    width: SCREEN_WIDTH - 40,
    maxWidth: 400,
    padding: Spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  title: {
    ...Typography.h3,
    fontSize: 18,
    fontWeight: '600',
  },
  todayButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.primary.lighter,
    borderRadius: BorderRadius.md,
  },
  todayText: {
    ...Typography.body,
    color: Colors.primary.main,
    fontSize: 14,
    fontWeight: '600',
  },
  calendar: {
    borderRadius: BorderRadius.md,
  },
});
