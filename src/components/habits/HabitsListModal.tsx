/**
 * Habits List Modal - Sliding bottom sheet modal
 * Shows all habits organized by Building/Breaking sections
 * Inspired by DailyModal from Timeline screen
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  Animated,
  PanResponder,
} from 'react-native';
import { Colors, Typography, Spacing } from '@/constants';
import { Habit } from '@/types';
import ModalHandle from '../Timeline/ModalHandle';
import HabitItem from './HabitItem';

interface HabitsListModalProps {
  habits: Habit[];
  isExpanded: boolean;
  onToggleExpand: () => void;
  onHabitToggle: (habitId: string) => void;
  onHabitPress: (habitId: string) => void;
}

const SCREEN_HEIGHT = Dimensions.get('window').height;
const COLLAPSED_HEIGHT = 280;
const EXPANDED_HEIGHT = SCREEN_HEIGHT * 0.7; // 70% of screen height

export default function HabitsListModal({
  habits,
  isExpanded,
  onToggleExpand,
  onHabitToggle,
  onHabitPress,
}: HabitsListModalProps) {
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT - COLLAPSED_HEIGHT)).current;
  const panStartY = useRef(0);

  // Split habits into building and breaking
  const buildingHabits = habits.filter((h) => h.type === 'building' && h.isActive);
  const breakingHabits = habits.filter((h) => h.type === 'breaking' && h.isActive);

  // Check if habit is completed today
  const isCompletedToday = (habit: Habit): boolean => {
    const today = new Date().toISOString().split('T')[0];
    return habit.completedDates.includes(today);
  };

  // Update position when isExpanded changes
  useEffect(() => {
    Animated.spring(translateY, {
      toValue: isExpanded
        ? SCREEN_HEIGHT - EXPANDED_HEIGHT
        : SCREEN_HEIGHT - COLLAPSED_HEIGHT,
      useNativeDriver: true,
      damping: 25,
      stiffness: 400,
      mass: 0.6,
    }).start();
  }, [isExpanded]);

  // Pan responder for gestures
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Only capture vertical gestures
        return Math.abs(gestureState.dy) > Math.abs(gestureState.dx);
      },
      onPanResponderGrant: () => {
        panStartY.current = (translateY as any)._value;
      },
      onPanResponderMove: (_, gestureState) => {
        const newY = panStartY.current + gestureState.dy;
        // Constrain within bounds
        if (
          newY >= SCREEN_HEIGHT - EXPANDED_HEIGHT &&
          newY <= SCREEN_HEIGHT - COLLAPSED_HEIGHT
        ) {
          translateY.setValue(newY);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        // Snap to collapsed or expanded based on velocity and position
        const shouldExpand =
          gestureState.vy < -0.5 ||
          (translateY as any)._value < SCREEN_HEIGHT - EXPANDED_HEIGHT + 100;

        Animated.spring(translateY, {
          toValue: shouldExpand
            ? SCREEN_HEIGHT - EXPANDED_HEIGHT
            : SCREEN_HEIGHT - COLLAPSED_HEIGHT,
          useNativeDriver: true,
          damping: 25,
          stiffness: 400,
          mass: 0.6,
        }).start();

        // Update state
        if ((shouldExpand && !isExpanded) || (!shouldExpand && isExpanded)) {
          onToggleExpand();
        }
      },
    })
  ).current;

  return (
    <Animated.View style={[styles.modal, { transform: [{ translateY }] }]}>
      <View style={styles.modalContent}>
        {/* Drag Handle */}
        <View {...panResponder.panHandlers} style={styles.handleArea}>
          <ModalHandle />
        </View>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Habits ({habits.length} active)</Text>
        </View>

        {/* Habit List */}
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {habits.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>🎯</Text>
              <Text style={styles.emptyTitle}>No habits yet</Text>
              <Text style={styles.emptySubtitle}>
                Tap the + button to create your first habit
              </Text>
            </View>
          ) : (
            <>
              {/* Building Habits Section */}
              {buildingHabits.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Building Habits</Text>
                  {buildingHabits.map((habit) => (
                    <HabitItem
                      key={habit.id}
                      habit={habit}
                      isCompletedToday={isCompletedToday(habit)}
                      onToggleCompletion={onHabitToggle}
                      onPress={onHabitPress}
                    />
                  ))}
                </View>
              )}

              {/* Breaking Habits Section */}
              {breakingHabits.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Breaking Habits</Text>
                  {breakingHabits.map((habit) => (
                    <HabitItem
                      key={habit.id}
                      habit={habit}
                      isCompletedToday={isCompletedToday(habit)}
                      onToggleCompletion={onHabitToggle}
                      onPress={onHabitPress}
                    />
                  ))}
                </View>
              )}
            </>
          )}
        </ScrollView>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  modal: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: SCREEN_HEIGHT,
    backgroundColor: Colors.neutral.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  modalContent: {
    flex: 1,
  },
  handleArea: {
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral.mediumGray,
  },
  headerTitle: {
    ...Typography.h2,
    color: Colors.text.primary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    ...Typography.h3,
    color: Colors.text.secondary,
    marginBottom: Spacing.md,
    textTransform: 'uppercase',
    fontSize: 12,
    letterSpacing: 1,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: Spacing.md,
  },
  emptyTitle: {
    ...Typography.h2,
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },
  emptySubtitle: {
    ...Typography.body,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
});
