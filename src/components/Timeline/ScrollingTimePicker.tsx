import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants';

interface ScrollingTimePickerProps {
  label: string;
  time: Date;
  onChange: (time: Date) => void;
}

/**
 * ScrollingTimePicker - Native time picker for iOS/Android
 * Shows scrolling wheel picker on iOS, dialog on Android
 */
export default function ScrollingTimePicker({
  label,
  time,
  onChange,
}: ScrollingTimePickerProps) {
  const [showPicker, setShowPicker] = React.useState(Platform.OS === 'ios');

  const handleChange = (event: DateTimePickerEvent, selectedTime?: Date) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }

    if (selectedTime) {
      onChange(selectedTime);
    }
  };

  const formatTime = (date: Date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    const displayMinutes = minutes.toString().padStart(2, '0');
    return `${displayHours}:${displayMinutes} ${ampm}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      {Platform.OS === 'ios' ? (
        <DateTimePicker
          value={time}
          mode="time"
          display="compact"
          onChange={handleChange}
          style={styles.picker}
          textColor={Colors.text.primary}
        />
      ) : (
        <>
          <TouchableOpacity
            style={styles.androidButton}
            onPress={() => setShowPicker(true)}
          >
            <Text style={styles.androidTimeText}>{formatTime(time)}</Text>
          </TouchableOpacity>
          {showPicker && (
            <DateTimePicker
              value={time}
              mode="time"
              display="default"
              onChange={handleChange}
            />
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  label: {
    ...Typography.small,
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text.secondary,
    marginBottom: Spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  picker: {
    height: 120,
    width: 100,
  },
  androidButton: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.md,
    borderWidth: 2,
    borderColor: Colors.neutral.lightGray,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    alignItems: 'center',
    minWidth: 120,
  },
  androidTimeText: {
    ...Typography.body,
    fontSize: 16,
    color: Colors.text.primary,
    fontWeight: '600',
  },
});
