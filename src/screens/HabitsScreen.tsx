/**
 * Habits Screen
 * 3-Layer Architecture: Monthly Calendar → Weekly Grid → Sliding Modal
 * Follows Timeline screen pattern
 */

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Spacing, Typography } from '@constants/index';
import { useHabitStore } from '@store/habitStore';
import { useHabitModal } from '@/contexts/HabitModalContext';
import { Habit } from '@/types';
import MonthlyHabitCalendar from '@components/habits/MonthlyHabitCalendar';
import WeeklyDateHeader from '@components/habits/WeeklyDateHeader';
import HabitsListModal from '@components/habits/HabitsListModal';
import HabitEditModal from '@components/habits/HabitEditModal';
import IconColorPicker from '@components/Timeline/IconColorPicker';

export default function HabitsScreen() {
  const insets = useSafeAreaInsets();
  const { habits, refreshHabits, addHabit, updateHabit, logCompletion } = useHabitStore();
  const { isVisible, habitId, closeModal, openEditModal } = useHabitModal();

  // Selected date state (for weekly view)
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Picker state (lifted to avoid nested modals)
  const [pickerIcon, setPickerIcon] = useState<string>('⭐');
  const [pickerColor, setPickerColor] = useState<string>(Colors.primary.main);
  const [showIconPicker, setShowIconPicker] = useState(false);

  // Modal expansion states
  const [isCalendarExpanded, setIsCalendarExpanded] = useState(false);
  const [isListModalExpanded, setIsListModalExpanded] = useState(false);

  useEffect(() => {
    refreshHabits();
  }, []);

  // Get editing habit
  const editingHabit = habitId ? habits.find((h) => h.id === habitId) : undefined;

  // Initialize picker values when modal opens
  useEffect(() => {
    if (isVisible) {
      if (editingHabit) {
        setPickerIcon(editingHabit.icon);
        setPickerColor(editingHabit.color || Colors.primary.main);
      } else {
        // Defaults for new habit
        setPickerIcon('⭐');
        setPickerColor(Colors.primary.main);
      }
    }
  }, [isVisible, editingHabit]);

  // Handler for opening icon/color picker
  const handleOpenIconPicker = (icon: string, color: string) => {
    setPickerIcon(icon);
    setPickerColor(color);
    setShowIconPicker(true);
  };

  // Handler for saving habit
  const handleSaveHabit = async (habitData: Partial<Habit>) => {
    if (editingHabit) {
      // Update existing habit
      await updateHabit(editingHabit.id, habitData);
    } else {
      // Create new habit - cast to required type
      await addHabit(habitData as Omit<Habit, 'id' | 'createdAt' | 'updatedAt'>);
    }
    await refreshHabits();
  };

  // Handler for toggling habit completion
  const handleToggleCompletion = async (habitId: string, date?: string) => {
    const habit = habits.find((h) => h.id === habitId);
    if (!habit) return;

    const targetDate = date || new Date().toISOString().split('T')[0];

    // Check if already completed
    const isCompleted = habit.completedDates.includes(targetDate);

    if (isCompleted) {
      // TODO: Implement removeHabitCompletion in habitStore
      // For now, just refresh to show updated data
      await refreshHabits();
    } else {
      await logCompletion(habitId, targetDate);
    }
  };

  // Handler for habit press (open detail/edit)
  const handleHabitPress = (habitId: string) => {
    openEditModal(habitId);
  };

  // Get week dates based on selected date
  const getWeekDates = (): string[] => {
    const dates: string[] = [];
    const startOfWeek = new Date(selectedDate);
    const dayOfWeek = startOfWeek.getDay();

    // Go to Sunday of the current week
    startOfWeek.setDate(startOfWeek.getDate() - dayOfWeek);

    // Get 7 days starting from Sunday
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(date.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }

    return dates;
  };

  const weekDates = getWeekDates();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={[styles.container, { paddingTop: insets.top }]}>
        {/* Layer 1: Compact/Expandable Monthly Calendar Header */}
        <View style={styles.calendarHeader}>
          <MonthlyHabitCalendar
            selectedDate={selectedDate}
            habits={habits}
            onDateChange={setSelectedDate}
            isExpanded={isCalendarExpanded}
            onToggleExpand={() => setIsCalendarExpanded(!isCalendarExpanded)}
          />
        </View>

        {/* Layer 2: Weekly Date Header & Habit Preview (behind modal) */}
        <View style={styles.weeklyContainer}>
          <WeeklyDateHeader
            weekDates={weekDates}
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
          />

          {/* Habit preview rows - simple icons showing this week's habits */}
          <View style={styles.habitPreviewContainer}>
            {habits.filter((h) => h.isActive).slice(0, 3).map((habit) => (
              <View key={habit.id} style={styles.habitPreviewRow}>
                <View style={styles.habitIconContainer}>
                  <Text style={styles.habitIcon}>{habit.icon}</Text>
                  <Text style={styles.habitPreviewTitle} numberOfLines={1}>
                    {habit.title}
                  </Text>
                </View>
                <View style={styles.weekCompletionDots}>
                  {weekDates.map((date) => {
                    const isCompleted = habit.completedDates.includes(date);
                    return (
                      <View
                        key={date}
                        style={[
                          styles.completionDot,
                          isCompleted && styles.completionDotFilled,
                          { borderColor: habit.color || Colors.primary.main },
                          isCompleted && { backgroundColor: habit.color || Colors.primary.main },
                        ]}
                      />
                    );
                  })}
                </View>
              </View>
            ))}
            {habits.filter((h) => h.isActive).length > 3 && (
              <Text style={styles.moreHabitsText}>
                +{habits.filter((h) => h.isActive).length - 3} more habits
              </Text>
            )}
          </View>
        </View>

        {/* Layer 3: Sliding Bottom Sheet Modal with Habit List */}
        <HabitsListModal
          habits={habits.filter((h) => h.isActive)}
          isExpanded={isListModalExpanded}
          onToggleExpand={() => setIsListModalExpanded(!isListModalExpanded)}
          onHabitToggle={handleToggleCompletion}
          onHabitPress={handleHabitPress}
        />

        {/* Layer 4: Edit Modal */}
        <HabitEditModal
          visible={isVisible}
          habit={editingHabit}
          onClose={closeModal}
          onSave={handleSaveHabit}
          onOpenIconPicker={handleOpenIconPicker}
          pickerIcon={pickerIcon}
          pickerColor={pickerColor}
        />

        {/* Icon Color Picker Modal */}
        <IconColorPicker
          visible={showIconPicker}
          selectedIcon={pickerIcon}
          selectedColor={pickerColor}
          onConfirm={(icon, color) => {
            setPickerIcon(icon);
            setPickerColor(color);
            setShowIconPicker(false);
          }}
          onClose={() => setShowIconPicker(false)}
        />
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  calendarHeader: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    zIndex: 10,
  },
  weeklyContainer: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
  },
  habitPreviewContainer: {
    marginTop: Spacing.sm,
  },
  habitPreviewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.neutral.white,
    borderRadius: 8,
    marginBottom: Spacing.xs,
  },
  habitIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  habitIcon: {
    fontSize: 20,
    marginRight: Spacing.sm,
  },
  habitPreviewTitle: {
    ...Typography.small,
    fontWeight: '600',
    color: Colors.text.primary,
    flex: 1,
  },
  weekCompletionDots: {
    flexDirection: 'row',
    gap: 6,
    marginLeft: Spacing.sm,
  },
  completionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1.5,
    backgroundColor: 'transparent',
  },
  completionDotFilled: {
    borderWidth: 0,
  },
  moreHabitsText: {
    ...Typography.caption,
    color: Colors.text.secondary,
    textAlign: 'center',
    paddingVertical: Spacing.sm,
  },
});
