/**
 * Habit Edit Modal
 * Bottom sheet modal for creating/editing habits with 14 form fields
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  PanResponder,
  Dimensions,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Keyboard,
  Switch,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@/constants';
import { Habit, HabitType, RecurrenceType } from '@/types';
import ModalHandle from '../Timeline/ModalHandle';
import CategorySelector from './CategorySelector';
import TimeWindowPicker from './TimeWindowPicker';
import WeeklyTargetPicker from './WeeklyTargetPicker';

interface HabitEditModalProps {
  visible: boolean;
  habit?: Habit; // Undefined for new habit
  onClose: () => void;
  onSave: (habitData: Partial<Habit>) => Promise<void>;
  onOpenIconPicker: (icon: string, color: string) => void;
  pickerIcon: string;
  pickerColor: string;
}

const SCREEN_HEIGHT = Dimensions.get('window').height;
const MODAL_HEIGHT = SCREEN_HEIGHT * 0.95;

export default function HabitEditModal({
  visible,
  habit,
  onClose,
  onSave,
  onOpenIconPicker,
  pickerIcon,
  pickerColor,
}: HabitEditModalProps) {
  const insets = useSafeAreaInsets();
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  // Form state - 14 fields
  const [title, setTitle] = useState('');
  const icon = pickerIcon;
  const color = pickerColor;
  const [habitType, setHabitType] = useState<HabitType>('building');
  const [category, setCategory] = useState<Habit['category']>();
  const [time, setTime] = useState<string | undefined>();
  const [timeWindow, setTimeWindow] = useState<Habit['timeWindow']>();
  const [frequencyType, setFrequencyType] = useState<Habit['frequencyType']>('daily');
  const [weeklyTarget, setWeeklyTarget] = useState<number | undefined>();
  const [recurrence, setRecurrence] = useState<RecurrenceType>('daily');
  const [customDays, setCustomDays] = useState<number[]>([]);
  const [duration, setDuration] = useState('');
  const [unitTarget, setUnitTarget] = useState<number | undefined>();
  const [unitType, setUnitType] = useState('');
  const [hasEndDate, setHasEndDate] = useState(false);
  const [endDate, setEndDate] = useState<string | undefined>();
  const [hasReminder, setHasReminder] = useState(false);
  const [notes, setNotes] = useState('');
  const [replacementBehavior, setReplacementBehavior] = useState('');

  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Initialize form with habit data
  useEffect(() => {
    if (habit) {
      setTitle(habit.title);
      setHabitType(habit.type);
      setCategory(habit.category);
      setTime(habit.time);
      setTimeWindow(habit.timeWindow);
      setFrequencyType(habit.frequencyType || 'daily');
      setWeeklyTarget(habit.weeklyTarget);
      setRecurrence(habit.recurrence || 'daily');
      setCustomDays(habit.customDays || []);
      setDuration(habit.duration || '');
      setUnitTarget(habit.unitTarget);
      setUnitType(habit.unitType || '');
      setHasEndDate(!!habit.endDate);
      setEndDate(habit.endDate);
      setHasReminder(habit.hasReminder || false);
      setNotes(habit.notes || '');
      setReplacementBehavior(habit.replacementBehavior || '');
    } else {
      // Reset for new habit
      setTitle('');
      setHabitType('building');
      setCategory(undefined);
      setTime(undefined);
      setTimeWindow(undefined);
      setFrequencyType('daily');
      setWeeklyTarget(undefined);
      setRecurrence('daily');
      setCustomDays([]);
      setDuration('');
      setUnitTarget(undefined);
      setUnitType('');
      setHasEndDate(false);
      setEndDate(undefined);
      setHasReminder(false);
      setNotes('');
      setReplacementBehavior('');
    }
  }, [habit, visible]);

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

  // Pan responder for swipe down to dismiss
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return gestureState.dy > 5 && Math.abs(gestureState.dy) > Math.abs(gestureState.dx);
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          translateY.setValue(SCREEN_HEIGHT - MODAL_HEIGHT + gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 100 || gestureState.vy > 0.5) {
          handleClose();
        } else {
          Animated.spring(translateY, {
            toValue: SCREEN_HEIGHT - MODAL_HEIGHT,
            useNativeDriver: true,
            damping: 20,
            stiffness: 300,
          }).start();
        }
      },
    })
  ).current;

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

  const handleSave = async () => {
    if (!title.trim()) {
      return;
    }

    setIsSaving(true);

    const habitData: Partial<Habit> = {
      title: title.trim(),
      icon,
      color,
      type: habitType,
      category,
      time,
      timeWindow,
      frequencyType,
      weeklyTarget,
      recurrence,
      customDays: customDays.length > 0 ? customDays : undefined,
      duration: duration.trim() || undefined,
      unitTarget: unitTarget || undefined,
      unitType: unitType.trim() || undefined,
      endDate: hasEndDate ? endDate : undefined,
      hasReminder,
      notes: notes.trim() || undefined,
      replacementBehavior: replacementBehavior.trim() || undefined,
      startDate: habit?.startDate || new Date().toISOString().split('T')[0],
      currentStreak: habit?.currentStreak || 0,
      longestStreak: habit?.longestStreak || 0,
      completedDates: habit?.completedDates || [],
      relapseDates: habit?.relapseDates || [],
      totalCompletions: habit?.totalCompletions || 0,
      completionRate: habit?.completionRate || 0,
      isActive: true,
    };

    try {
      await onSave(habitData);
      handleClose();
    } catch (error) {
      console.error('Error saving habit:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const toggleCustomDay = (day: number) => {
    if (customDays.includes(day)) {
      setCustomDays(customDays.filter((d) => d !== day));
    } else {
      setCustomDays([...customDays, day].sort());
    }
  };

  if (!visible) return null;

  return (
    <View style={styles.container} pointerEvents="box-none">
      {/* Backdrop */}
      <Animated.View
        style={[styles.backdrop, { opacity: backdropOpacity }]}
        onTouchEnd={handleClose}
      />

      {/* Modal */}
      <Animated.View
        style={[
          styles.modal,
          {
            transform: [{ translateY }],
            paddingBottom: insets.bottom + 16,
          },
        ]}
      >
        {/* Handle */}
        <View {...panResponder.panHandlers} style={styles.handleContainer}>
          <ModalHandle />
        </View>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose}>
            <Text style={styles.cancelButton}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {habit ? 'Edit Habit' : 'New Habit'}
          </Text>
          <TouchableOpacity onPress={handleSave} disabled={isSaving || !title.trim()}>
            <Text
              style={[
                styles.saveButton,
                (!title.trim() || isSaving) && styles.saveButtonDisabled,
              ]}
            >
              {isSaving ? 'Saving...' : 'Save'}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.content}>
            {/* 1. Title */}
            <View style={styles.section}>
              <Text style={styles.label}>Title *</Text>
              <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
                placeholder="e.g., Morning meditation"
                placeholderTextColor="#9CA3AF"
                autoFocus={!habit}
              />
            </View>

            {/* 2. Icon & Color */}
            <View style={styles.section}>
              <Text style={styles.label}>Icon & Color</Text>
              <TouchableOpacity
                style={[styles.iconButton, { backgroundColor: color }]}
                onPress={() => onOpenIconPicker(icon, color)}
              >
                <Text style={styles.iconText}>{icon}</Text>
              </TouchableOpacity>
            </View>

            {/* 3. Habit Type */}
            <View style={styles.section}>
              <Text style={styles.label}>Habit Type</Text>
              <View style={styles.typeToggleContainer}>
                <TouchableOpacity
                  style={[
                    styles.typeButton,
                    habitType === 'building' && styles.typeButtonActive,
                  ]}
                  onPress={() => setHabitType('building')}
                >
                  <Text
                    style={[
                      styles.typeButtonText,
                      habitType === 'building' && styles.typeButtonTextActive,
                    ]}
                  >
                    🏗️ Building
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.typeButton,
                    habitType === 'breaking' && styles.typeButtonActive,
                  ]}
                  onPress={() => setHabitType('breaking')}
                >
                  <Text
                    style={[
                      styles.typeButtonText,
                      habitType === 'breaking' && styles.typeButtonTextActive,
                    ]}
                  >
                    🚫 Breaking
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* 4. Category */}
            <CategorySelector value={category} onChange={setCategory} />

            {/* 5 & 6. Time / Time Window (only for building habits) */}
            {habitType === 'building' && (
              <View style={styles.section}>
                <Text style={styles.label}>Scheduling</Text>
                <View style={styles.schedulingToggle}>
                  <TouchableOpacity
                    style={[
                      styles.schedulingButton,
                      time !== undefined && styles.schedulingButtonActive,
                    ]}
                    onPress={() => {
                      setTimeWindow(undefined);
                      setShowTimePicker(true);
                    }}
                  >
                    <Text
                      style={[
                        styles.schedulingButtonText,
                        time !== undefined && styles.schedulingButtonTextActive,
                      ]}
                    >
                      ⏰ Specific Time
                    </Text>
                    {time && (
                      <Text style={styles.schedulingSubtext}>{time}</Text>
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.schedulingButton,
                      timeWindow !== undefined && styles.schedulingButtonActive,
                    ]}
                    onPress={() => {
                      setTime(undefined);
                      // Show time window picker below
                    }}
                  >
                    <Text
                      style={[
                        styles.schedulingButtonText,
                        timeWindow !== undefined && styles.schedulingButtonTextActive,
                      ]}
                    >
                      🕐 Flexible Window
                    </Text>
                  </TouchableOpacity>
                </View>

                {showTimePicker && (
                  <DateTimePicker
                    value={time ? new Date(`2000-01-01T${time}`) : new Date()}
                    mode="time"
                    is24Hour={false}
                    display="spinner"
                    onChange={(event, selectedDate) => {
                      setShowTimePicker(false);
                      if (selectedDate) {
                        const hours = selectedDate.getHours().toString().padStart(2, '0');
                        const minutes = selectedDate.getMinutes().toString().padStart(2, '0');
                        setTime(`${hours}:${minutes}`);
                      }
                    }}
                  />
                )}

                {time === undefined && (
                  <TimeWindowPicker value={timeWindow} onChange={setTimeWindow} />
                )}
              </View>
            )}

            {/* 7, 8, 9, 10. Frequency (daily/weekly/custom) */}
            <View style={styles.section}>
              <Text style={styles.label}>Frequency</Text>
              <View style={styles.frequencyToggle}>
                <TouchableOpacity
                  style={[
                    styles.frequencyButton,
                    frequencyType === 'daily' && styles.frequencyButtonActive,
                  ]}
                  onPress={() => setFrequencyType('daily')}
                >
                  <Text
                    style={[
                      styles.frequencyButtonText,
                      frequencyType === 'daily' && styles.frequencyButtonTextActive,
                    ]}
                  >
                    Daily
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.frequencyButton,
                    frequencyType === 'weekly' && styles.frequencyButtonActive,
                  ]}
                  onPress={() => setFrequencyType('weekly')}
                >
                  <Text
                    style={[
                      styles.frequencyButtonText,
                      frequencyType === 'weekly' && styles.frequencyButtonTextActive,
                    ]}
                  >
                    Weekly
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.frequencyButton,
                    frequencyType === 'custom_days' && styles.frequencyButtonActive,
                  ]}
                  onPress={() => setFrequencyType('custom_days')}
                >
                  <Text
                    style={[
                      styles.frequencyButtonText,
                      frequencyType === 'custom_days' && styles.frequencyButtonTextActive,
                    ]}
                  >
                    Custom
                  </Text>
                </TouchableOpacity>
              </View>

              {frequencyType === 'weekly' && (
                <WeeklyTargetPicker value={weeklyTarget} onChange={setWeeklyTarget} />
              )}

              {frequencyType === 'custom_days' && (
                <View style={styles.daysSelector}>
                  <Text style={styles.daysLabel}>Select Days</Text>
                  <View style={styles.daysRow}>
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                      <TouchableOpacity
                        key={index}
                        style={[
                          styles.dayButton,
                          customDays.includes(index) && styles.dayButtonSelected,
                        ]}
                        onPress={() => toggleCustomDay(index)}
                      >
                        <Text
                          style={[
                            styles.dayButtonText,
                            customDays.includes(index) && styles.dayButtonTextSelected,
                          ]}
                        >
                          {day}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}
            </View>

            {/* 11. Duration/Goal */}
            <View style={styles.section}>
              <Text style={styles.label}>Goal / Duration (Optional)</Text>
              <TextInput
                style={styles.input}
                value={duration}
                onChangeText={setDuration}
                placeholder='e.g., "30 minutes", "8 glasses", "20 pages"'
                placeholderTextColor="#9CA3AF"
              />
            </View>

            {/* Unit-Based Tracking */}
            <View style={styles.section}>
              <Text style={styles.label}>Unit Tracking (Optional)</Text>
              <Text style={styles.description}>
                Track quantifiable progress (e.g., glasses of water, pages read)
              </Text>
              <View style={styles.unitRow}>
                <TextInput
                  style={[styles.input, styles.unitTargetInput]}
                  value={unitTarget?.toString() || ''}
                  onChangeText={(text) => {
                    const num = parseInt(text);
                    setUnitTarget(isNaN(num) ? undefined : num);
                  }}
                  placeholder="8"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="number-pad"
                />
                <TextInput
                  style={[styles.input, styles.unitTypeInput]}
                  value={unitType}
                  onChangeText={setUnitType}
                  placeholder="glasses, minutes, pages..."
                  placeholderTextColor="#9CA3AF"
                />
              </View>
              {unitTarget && unitType && (
                <Text style={styles.unitPreview}>
                  Target: {unitTarget} {unitType} per completion
                </Text>
              )}
            </View>

            {/* End Date */}
            <View style={styles.section}>
              <View style={styles.switchRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.label}>Time-Bound Challenge</Text>
                  <Text style={styles.description}>
                    Set an optional end date for this habit
                  </Text>
                </View>
                <Switch
                  value={hasEndDate}
                  onValueChange={(value) => {
                    setHasEndDate(value);
                    if (value && !endDate) {
                      // Default to 30 days from now
                      const futureDate = new Date();
                      futureDate.setDate(futureDate.getDate() + 30);
                      setEndDate(futureDate.toISOString().split('T')[0]);
                    }
                  }}
                  trackColor={{ false: '#D1D5DB', true: '#A5B4FC' }}
                  thumbColor={hasEndDate ? '#6366F1' : '#F3F4F6'}
                />
              </View>
              {hasEndDate && (
                <TouchableOpacity
                  style={styles.dateButton}
                  onPress={() => setShowEndDatePicker(true)}
                >
                  <Text style={styles.dateButtonText}>
                    📅 {endDate ? new Date(endDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Select end date'}
                  </Text>
                </TouchableOpacity>
              )}
              {showEndDatePicker && (
                <DateTimePicker
                  value={endDate ? new Date(endDate + 'T00:00:00') : new Date()}
                  mode="date"
                  display="spinner"
                  minimumDate={new Date()}
                  onChange={(event, selectedDate) => {
                    setShowEndDatePicker(false);
                    if (selectedDate) {
                      setEndDate(selectedDate.toISOString().split('T')[0]);
                    }
                  }}
                />
              )}
            </View>

            {/* 12. Reminder Toggle */}
            <View style={styles.section}>
              <View style={styles.switchRow}>
                <View>
                  <Text style={styles.label}>Reminder Notifications</Text>
                  <Text style={styles.description}>
                    Get notified at the scheduled time
                  </Text>
                </View>
                <Switch
                  value={hasReminder}
                  onValueChange={setHasReminder}
                  trackColor={{ false: '#D1D5DB', true: '#A5B4FC' }}
                  thumbColor={hasReminder ? '#6366F1' : '#F3F4F6'}
                />
              </View>
            </View>

            {/* 13. Notes (Why am I doing this?) */}
            <View style={styles.section}>
              <Text style={styles.label}>Notes (Optional)</Text>
              <Text style={styles.description}>Why are you building this habit?</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={notes}
                onChangeText={setNotes}
                placeholder="Your motivation, reasons, or notes..."
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={3}
              />
            </View>

            {/* 14. Replacement Behavior (breaking habits only) */}
            {habitType === 'breaking' && (
              <View style={styles.section}>
                <Text style={styles.label}>Replacement Behavior (Optional)</Text>
                <Text style={styles.description}>
                  What will you do instead when tempted?
                </Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={replacementBehavior}
                  onChangeText={setReplacementBehavior}
                  placeholder="e.g., Drink water when I crave soda..."
                  placeholderTextColor="#9CA3AF"
                  multiline
                  numberOfLines={2}
                />
              </View>
            )}
          </View>
        </ScrollView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modal: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: MODAL_HEIGHT,
    backgroundColor: Colors.neutral.white,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    ...Shadows.large,
  },
  handleContainer: {
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral.mediumGray,
  },
  headerTitle: {
    ...Typography.h3,
    color: Colors.text.primary,
  },
  cancelButton: {
    ...Typography.body,
    color: Colors.text.secondary,
  },
  saveButton: {
    ...Typography.body,
    color: Colors.primary.main,
    fontWeight: '600',
  },
  saveButtonDisabled: {
    color: Colors.neutral.gray,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: Spacing.lg,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  label: {
    ...Typography.body,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },
  description: {
    ...Typography.small,
    color: Colors.text.secondary,
    marginBottom: Spacing.sm,
  },
  input: {
    ...Typography.body,
    backgroundColor: Colors.neutral.lightGray,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.neutral.mediumGray,
    color: Colors.text.primary,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  iconButton: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.small,
  },
  iconText: {
    fontSize: 40,
  },
  typeToggleContainer: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  typeButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    backgroundColor: Colors.neutral.lightGray,
    borderRadius: BorderRadius.md,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  typeButtonActive: {
    backgroundColor: Colors.primary.main + '15',
    borderColor: Colors.primary.main,
  },
  typeButtonText: {
    ...Typography.body,
    color: Colors.text.secondary,
    textAlign: 'center',
    fontWeight: '600',
  },
  typeButtonTextActive: {
    color: Colors.primary.main,
  },
  schedulingToggle: {
    gap: Spacing.md,
  },
  schedulingButton: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    backgroundColor: Colors.neutral.lightGray,
    borderRadius: BorderRadius.md,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  schedulingButtonActive: {
    backgroundColor: Colors.primary.main + '15',
    borderColor: Colors.primary.main,
  },
  schedulingButtonText: {
    ...Typography.body,
    color: Colors.text.secondary,
    fontWeight: '600',
  },
  schedulingButtonTextActive: {
    color: Colors.primary.main,
  },
  schedulingSubtext: {
    ...Typography.small,
    color: Colors.primary.main,
    marginTop: 4,
  },
  frequencyToggle: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  frequencyButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.neutral.lightGray,
    borderRadius: BorderRadius.md,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  frequencyButtonActive: {
    backgroundColor: Colors.primary.main + '15',
    borderColor: Colors.primary.main,
  },
  frequencyButtonText: {
    ...Typography.body,
    color: Colors.text.secondary,
    textAlign: 'center',
    fontWeight: '600',
  },
  frequencyButtonTextActive: {
    color: Colors.primary.main,
  },
  daysSelector: {
    marginTop: Spacing.md,
  },
  daysLabel: {
    ...Typography.small,
    color: Colors.text.secondary,
    marginBottom: Spacing.sm,
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.neutral.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  dayButtonSelected: {
    backgroundColor: Colors.primary.main + '15',
    borderColor: Colors.primary.main,
  },
  dayButtonText: {
    ...Typography.body,
    color: Colors.text.secondary,
    fontWeight: '600',
  },
  dayButtonTextSelected: {
    color: Colors.primary.main,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  unitRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  unitTargetInput: {
    flex: 1,
    textAlign: 'center',
  },
  unitTypeInput: {
    flex: 2,
  },
  unitPreview: {
    ...Typography.small,
    color: Colors.primary.main,
    marginTop: Spacing.sm,
    fontWeight: '600',
  },
  dateButton: {
    marginTop: Spacing.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    backgroundColor: Colors.primary.main + '15',
    borderRadius: BorderRadius.md,
    borderWidth: 2,
    borderColor: Colors.primary.main,
  },
  dateButtonText: {
    ...Typography.body,
    color: Colors.primary.main,
    fontWeight: '600',
    textAlign: 'center',
  },
});
