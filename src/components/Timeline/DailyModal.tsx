import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, Animated, PanResponder } from 'react-native';
import { Colors } from '@/constants';
import { Task } from '@/types';
import ModalHandle from './ModalHandle';
import TimelineTaskItem from './TimelineTaskItem';
import IntervalMessage from './IntervalMessage';
import EmptyState from './EmptyState';
import TimeRuler from './TimeRuler';

interface DailyModalProps {
  tasks: Task[];
  wakeTime: string;
  sleepTime: string;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

const SCREEN_HEIGHT = Dimensions.get('window').height;
const COLLAPSED_HEIGHT = 200;
const EXPANDED_HEIGHT = SCREEN_HEIGHT * 0.85; // 85% of screen height
const PIXELS_PER_HOUR = 80; // Height of each hour slot (reduced for better fit)
const PIXELS_PER_MINUTE = PIXELS_PER_HOUR / 60; // ~1.33px per minute
const RULER_WIDTH = 60; // Width of time ruler on left
const TASK_ITEM_HEIGHT = 80; // Approximate height of each task item

/**
 * DailyModal - Sliding modal with time-based timeline
 * Shows tasks positioned by actual time with time ruler on left
 * Wake and sleep times bookend the day
 */
interface DailyModalInternalProps extends DailyModalProps {
  onTaskToggle: (taskId: string) => void;
  onTaskPress?: (taskId: string) => void;
}

/**
 * Parse time string to minutes since midnight
 */
function parseTimeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

/**
 * Calculate time difference between tasks in minutes
 */
function calculateInterval(task1: Task, task2: Task): number {
  const task1End = task1.endTime ? parseTimeToMinutes(task1.endTime) : parseTimeToMinutes(task1.time) + (task1.duration || 30);
  const task2Start = parseTimeToMinutes(task2.time);
  return Math.max(0, task2Start - task1End);
}

/**
 * Format interval minutes to readable string
 */
function formatIntervalMessage(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min break`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m break` : `${hours}h break`;
}

export default function DailyModal({
  tasks,
  wakeTime,
  sleepTime,
  isExpanded,
  onToggleExpand,
  onTaskToggle,
  onTaskPress,
}: DailyModalInternalProps) {
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT - COLLAPSED_HEIGHT)).current;
  const panStartY = useRef(0);
  const scrollRef = useRef<ScrollView>(null);

  // Generate complete task list with wake and sleep markers
  const allTasks = React.useMemo(() => {
    // Don't generate system tasks if no regular tasks exist
    if (tasks.length === 0) {
      return [];
    }

    const wakeTask: Task = {
      id: 'wake',
      title: 'Wake Up',
      icon: '🌅',
      time: wakeTime,
      duration: 0,
      isCompleted: false,
      date: new Date().toISOString().split('T')[0],
      color: '#FF9500',
    };

    const sleepTask: Task = {
      id: 'sleep',
      title: 'Sleep',
      icon: '😴',
      time: sleepTime,
      duration: 0,
      isCompleted: false,
      date: new Date().toISOString().split('T')[0],
      color: '#5E5CE6',
    };

    // Combine and sort by time
    return [wakeTask, ...tasks, sleepTask].sort((a, b) => {
      return parseTimeToMinutes(a.time) - parseTimeToMinutes(b.time);
    });
  }, [tasks, wakeTime, sleepTime]);

  // Calculate Y position for a task based on time
  const calculateTaskY = (task: Task): number => {
    const taskMinutes = parseTimeToMinutes(task.time);
    const wakeMinutes = parseTimeToMinutes(wakeTime);
    const minutesSinceWake = Math.max(0, taskMinutes - wakeMinutes);
    return minutesSinceWake * PIXELS_PER_MINUTE;
  };

  // Update position when isExpanded changes
  useEffect(() => {
    Animated.spring(translateY, {
      toValue: isExpanded ? SCREEN_HEIGHT - EXPANDED_HEIGHT : SCREEN_HEIGHT - COLLAPSED_HEIGHT,
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
        // Only capture vertical gestures from the handle area
        return Math.abs(gestureState.dy) > Math.abs(gestureState.dx);
      },
      onPanResponderGrant: () => {
        panStartY.current = (translateY as any)._value;
      },
      onPanResponderMove: (_, gestureState) => {
        const newY = panStartY.current + gestureState.dy;
        // Constrain within bounds
        if (newY >= SCREEN_HEIGHT - EXPANDED_HEIGHT && newY <= SCREEN_HEIGHT - COLLAPSED_HEIGHT) {
          translateY.setValue(newY);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        // Snap to collapsed or expanded based on velocity and position
        const shouldExpand =
          gestureState.vy < -0.5 || (translateY as any)._value < SCREEN_HEIGHT - EXPANDED_HEIGHT + 100;

        Animated.spring(translateY, {
          toValue: shouldExpand ? SCREEN_HEIGHT - EXPANDED_HEIGHT : SCREEN_HEIGHT - COLLAPSED_HEIGHT,
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

  // Calculate total timeline height based on wake/sleep times
  const wakeMinutes = parseTimeToMinutes(wakeTime);
  const sleepMinutes = parseTimeToMinutes(sleepTime);
  const totalMinutes = sleepMinutes - wakeMinutes;
  const timelineHeight = totalMinutes * PIXELS_PER_MINUTE;

  return (
    <Animated.View style={[styles.modal, { transform: [{ translateY }] }]}>
      <View style={styles.modalContent}>
        <View {...panResponder.panHandlers} style={styles.handleArea}>
          <ModalHandle />
        </View>

        {tasks.length === 0 ? (
          <View style={styles.emptyContainer}>
            <EmptyState />
          </View>
        ) : (
          <ScrollView
            ref={scrollRef}
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {allTasks.map((task, index) => {
              const isSystemTask = task.id === 'wake' || task.id === 'sleep';
              const isFirst = index === 0;
              const isLast = index === allTasks.length - 1;

              // Calculate interval after this task
              const showIntervalAfter = !isLast && calculateInterval(task, allTasks[index + 1]) > 10;
              const intervalMinutes = !isLast ? calculateInterval(task, allTasks[index + 1]) : 0;

              return (
                <React.Fragment key={task.id}>
                  {/* Task Item */}
                  <TimelineTaskItem
                    task={task}
                    onToggle={isSystemTask ? undefined : () => onTaskToggle(task.id)}
                    onPress={isSystemTask ? undefined : (onTaskPress ? () => onTaskPress(task.id) : undefined)}
                    showConnectorAbove={!isFirst}
                    showConnectorBelow={!isLast}
                  />

                  {/* Interval Message */}
                  {showIntervalAfter && (
                    <IntervalMessage message={formatIntervalMessage(intervalMinutes)} />
                  )}
                </React.Fragment>
              );
            })}
          </ScrollView>
        )}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  modal: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: SCREEN_HEIGHT,
    backgroundColor: Colors.modal.background,
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
    paddingVertical: 12,
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 20,
    paddingBottom: 40,
    paddingHorizontal: 16,
  },
});
