import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@/constants';
import { Task } from '@/types';
import ScrollingTimePicker from './ScrollingTimePicker';
import NotificationSelector from './NotificationSelector';

interface TaskEditModalProps {
  visible: boolean;
  task?: Task; // Undefined for new task
  initialDate?: string; // YYYY-MM-DD
  onClose: () => void;
  onSave: (taskData: Partial<Task>) => Promise<void>;
  // Picker callbacks (to avoid nested modals)
  onOpenIconPicker: (icon: string, color: string) => void;
  onOpenDatePicker: (date: string) => void;
  pickerIcon: string;
  pickerColor: string;
  pickerDate: string;
}

const SCREEN_HEIGHT = Dimensions.get('window').height;
const MODAL_HEIGHT = SCREEN_HEIGHT * 0.85; // Reduced from 0.9 to account for bottom nav

/**
 * TaskEditModal - Redesigned bottom sheet modal for Timeline tasks
 * Features: Icon/Color picker, Date picker, Time range, Notes, Notifications
 */
export default function TaskEditModal({
  visible,
  task,
  initialDate,
  onClose,
  onSave,
  onOpenIconPicker,
  onOpenDatePicker,
  pickerIcon,
  pickerColor,
  pickerDate,
}: TaskEditModalProps) {
  const insets = useSafeAreaInsets();
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  // Initialize form state directly from props to avoid flicker
  const getInitialStartTime = () => {
    if (task) {
      const [hours, minutes] = task.time.split(':').map(Number);
      const taskStartTime = new Date();
      taskStartTime.setHours(hours, minutes, 0, 0);
      return taskStartTime;
    }
    return new Date();
  };

  const getInitialEndTime = () => {
    if (task && task.endTime) {
      const [endHours, endMinutes] = task.endTime.split(':').map(Number);
      const taskEndTime = new Date();
      taskEndTime.setHours(endHours, endMinutes, 0, 0);
      return taskEndTime;
    }
    const defaultEnd = new Date();
    defaultEnd.setMinutes(defaultEnd.getMinutes() + 15);
    return defaultEnd;
  };

  // Form state - initialize directly to avoid flicker
  const [title, setTitle] = useState(task?.title || '');
  const icon = pickerIcon; // Use picker state from parent
  const color = pickerColor; // Use picker state from parent
  const date = pickerDate; // Use picker state from parent
  const [startTime, setStartTime] = useState(getInitialStartTime);
  const [endTime, setEndTime] = useState(getInitialEndTime);
  const [notes, setNotes] = useState(task?.notes || '');
  const [notifications, setNotifications] = useState<number[]>(task?.notifications || []);
  const [isSaving, setIsSaving] = useState(false);

  // Update form when task or visibility changes
  useEffect(() => {
    if (visible) {
      if (task) {
        setTitle(task.title);
        setNotes(task.notes || '');
        setNotifications(task.notifications || []);

        // Parse start time
        const [hours, minutes] = task.time.split(':').map(Number);
        const taskStartTime = new Date();
        taskStartTime.setHours(hours, minutes, 0, 0);
        setStartTime(taskStartTime);

        // Parse end time if it exists
        if (task.endTime) {
          const [endHours, endMinutes] = task.endTime.split(':').map(Number);
          const taskEndTime = new Date();
          taskEndTime.setHours(endHours, endMinutes, 0, 0);
          setEndTime(taskEndTime);
        }
      } else {
        // Reset for new task
        setTitle('');
        const now = new Date();
        setStartTime(now);
        const defaultEnd = new Date(now);
        defaultEnd.setMinutes(now.getMinutes() + 15);
        setEndTime(defaultEnd);
        setNotes('');
        setNotifications([]);
      }
    }
  }, [task, visible, initialDate]);

  // Animate modal in/out
  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: SCREEN_HEIGHT - MODAL_HEIGHT,
          useNativeDriver: true,
          damping: 20,
          stiffness: 300,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: SCREEN_HEIGHT,
          useNativeDriver: true,
          damping: 20,
          stiffness: 300,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const handleClose = () => {
    Keyboard.dismiss();
    Animated.parallel([
      Animated.spring(translateY, {
        toValue: SCREEN_HEIGHT,
        useNativeDriver: true,
        damping: 20,
        stiffness: 300,
      }),
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
    });
  };

  const calculateDuration = () => {
    const diffMs = endTime.getTime() - startTime.getTime();
    return Math.round(diffMs / 60000); // Convert to minutes
  };

  const formatDate = (dateString: string) => {
    const d = new Date(dateString + 'T00:00:00');
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    };
    return d.toLocaleDateString('en-US', options);
  };

  const handleSave = async () => {
    if (!title.trim()) {
      console.warn('Title is required');
      return;
    }

    setIsSaving(true);

    try {
      const startHours = startTime.getHours().toString().padStart(2, '0');
      const startMinutes = startTime.getMinutes().toString().padStart(2, '0');
      const startTimeString = `${startHours}:${startMinutes}`;

      const endHours = endTime.getHours().toString().padStart(2, '0');
      const endMinutes = endTime.getMinutes().toString().padStart(2, '0');
      const endTimeString = `${endHours}:${endMinutes}`;

      const taskData: Partial<Task> = {
        title: title.trim(),
        type: 'timeblock',
        icon,
        color,
        time: startTimeString,
        endTime: endTimeString,
        duration: calculateDuration(),
        date,
        notes: notes.trim() || undefined,
        notifications: notifications.length > 0 ? notifications : undefined,
        isRecurring: false,
      };

      await onSave(taskData);
      handleClose();
    } catch (error) {
      console.error('Error saving task:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!visible) return null;

  return (
    <Animated.View style={[styles.modalBackdrop, { opacity: backdropOpacity }]}>
      {/* Backdrop tap area - positioned behind modal */}
      <TouchableWithoutFeedback onPress={handleClose}>
        <View style={StyleSheet.absoluteFill} />
      </TouchableWithoutFeedback>

      {/* Modal content - no touch interception */}
      <Animated.View
        style={[
          styles.modalContainer,
          {
            transform: [{ translateY }],
          },
        ]}
      >
            {/* Header with close button */}
            <View style={[styles.header, { paddingTop: insets.top + Spacing.xs }]} pointerEvents="auto">
              <Text style={styles.headerTitle}>{task ? 'Edit Task' : 'New Task'}</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={handleClose}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={{ flex: 1 }}
              keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 20}
            >
              <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={styles.contentContainer}
                scrollEventThrottle={8}
                bounces={true}
                alwaysBounceVertical={true}
                nestedScrollEnabled={true}
                scrollEnabled={true}
                contentInsetAdjustmentBehavior="automatic"
              >
              {/* Name Input with Icon Button */}
              <View style={styles.nameSection}>
                <TouchableOpacity
                  style={[styles.iconButton, { backgroundColor: color }]}
                  onPress={() => onOpenIconPicker(icon, color)}
                  activeOpacity={0.7}
                  delayLongPress={0}
                >
                  <Text style={styles.iconButtonText}>{icon}</Text>
                </TouchableOpacity>
                <TextInput
                  style={styles.nameInput}
                  placeholder="Task name"
                  placeholderTextColor={Colors.text.secondary}
                  value={title}
                  onChangeText={setTitle}
                  maxLength={100}
                />
              </View>

              {/* Date Selector */}
              <TouchableOpacity
                style={styles.dateSelector}
                onPress={() => onOpenDatePicker(date)}
                activeOpacity={0.7}
                delayLongPress={0}
              >
                <View style={styles.dateSelectorLeft}>
                  <Text style={styles.dateIcon}>📅</Text>
                  <Text style={styles.dateText}>{formatDate(date)}</Text>
                </View>
                <Text style={styles.chevron}>›</Text>
              </TouchableOpacity>

              {/* Time Section */}
              <View style={styles.timeSection}>
                <Text style={styles.sectionLabel}>Time</Text>
                <View style={styles.timePickerRow}>
                  <View style={styles.timePickerContainer}>
                    <ScrollingTimePicker
                      label="Start"
                      time={startTime}
                      onChange={setStartTime}
                    />
                  </View>
                  <Text style={styles.timeArrow}>→</Text>
                  <View style={styles.timePickerContainer}>
                    <ScrollingTimePicker
                      label="End"
                      time={endTime}
                      onChange={setEndTime}
                    />
                  </View>
                </View>
                <Text style={styles.durationText}>({calculateDuration()} min)</Text>
              </View>

              {/* Notes Section */}
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>Notes</Text>
                <TextInput
                  style={styles.notesInput}
                  placeholder="Add notes..."
                  placeholderTextColor={Colors.text.secondary}
                  value={notes}
                  onChangeText={setNotes}
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                  maxLength={500}
                />
              </View>

              {/* Notifications Section */}
              <View style={styles.section}>
                <NotificationSelector
                  selectedNotifications={notifications}
                  onChange={setNotifications}
                />
              </View>

              {/* Save Button */}
              <TouchableOpacity
                style={[styles.continueButton, { backgroundColor: color }]}
                onPress={handleSave}
                disabled={isSaving}
              >
                <Text style={styles.continueButtonText}>
                  {isSaving ? 'Saving...' : 'Save'}
                </Text>
              </TouchableOpacity>

              {/* Bottom padding: Safe area + Nav bar height (88px) + breathing room */}
              <View style={{ height: insets.bottom + 88 + Spacing.lg }} />
            </ScrollView>
          </KeyboardAvoidingView>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.modal.backdrop,
    justifyContent: 'flex-end',
  },
  modalContainer: {
    height: MODAL_HEIGHT,
    backgroundColor: Colors.modal.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    ...Shadows.large,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.sm,
  },
  headerTitle: {
    ...Typography.h3,
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text.primary,
    lineHeight: 32,
    includeFontPadding: false,
  },
  closeButton: {
    position: 'absolute',
    right: Spacing.lg,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text.secondary,
    lineHeight: 20,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
  },
  nameSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    gap: Spacing.md,
  },
  iconButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  iconButtonText: {
    fontSize: 28,
  },
  nameInput: {
    ...Typography.body,
    flex: 1,
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.background.secondary,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
  },
  dateSelectorLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  dateIcon: {
    fontSize: 20,
  },
  dateText: {
    ...Typography.body,
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  todayBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary.lighter,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.md,
    gap: Spacing.xs,
  },
  todayText: {
    ...Typography.small,
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary.main,
  },
  chevron: {
    fontSize: 18,
    color: Colors.primary.main,
    fontWeight: '600',
  },
  timeSection: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.background.secondary,
    marginHorizontal: Spacing.lg,
    marginVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
  sectionLabel: {
    ...Typography.small,
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text.secondary,
    marginBottom: Spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  timePickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.lg,
    height: 140,
    overflow: 'hidden',
  },
  timePickerContainer: {
    alignItems: 'center',
    overflow: 'hidden',
    height: 140,
  },
  timeArrow: {
    fontSize: 20,
    color: Colors.text.secondary,
    fontWeight: '600',
    marginTop: 0,
  },
  durationText: {
    ...Typography.small,
    fontSize: 13,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginTop: Spacing.sm,
    fontWeight: '500',
  },
  section: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  notesInput: {
    ...Typography.body,
    fontSize: 16,
    color: Colors.text.primary,
    backgroundColor: Colors.background.secondary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 2,
    borderColor: 'transparent',
    minHeight: 80,
  },
  continueButton: {
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  continueButtonText: {
    ...Typography.body,
    fontSize: 18,
    fontWeight: '700',
    color: Colors.neutral.white,
  },
});
