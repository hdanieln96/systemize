import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors } from '@/constants';
import WeeklyGrid from '@/components/Timeline/WeeklyGrid';
import DailyModal from '@/components/Timeline/DailyModal';
import TaskEditModal from '@/components/Timeline/TaskEditModal';
import IconColorPicker from '@/components/Timeline/IconColorPicker';
import DatePicker from '@/components/Timeline/DatePicker';
import { useTaskStore } from '@/store/taskStore';
import { useTaskModal } from '@/contexts/TaskModalContext';
import { Task } from '@/types';
import {
  mockTasks,
  mockSettings,
  getCurrentWeekDates,
  getTasksForDate,
} from '@/components/Timeline/mockData';

/**
 * TimelineScreen - Main timeline view with dual-view pattern
 * Shows weekly grid background + sliding daily modal
 */
export default function TimelineScreen() {
  const [selectedDate, setSelectedDate] = useState('2025-11-11'); // Default to today
  const [isModalExpanded, setIsModalExpanded] = useState(false);

  // Task modal context (shared with navigation)
  const { isVisible: editModalVisible, editingTask, openModal, closeModal } = useTaskModal();

  // Picker modal states (lifted from TaskEditModal to avoid nested modals)
  const [showIconColorPicker, setShowIconColorPicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [pickerIcon, setPickerIcon] = useState('⏰');
  const [pickerColor, setPickerColor] = useState('#4A90E2');
  const [pickerDate, setPickerDate] = useState('2025-11-11');

  // Zustand store (will replace mock data when data layer is ready)
  const { toggleCompletion, addTask, updateTask } = useTaskStore();

  // Sync picker state when editing a task or modal visibility changes
  useEffect(() => {
    if (editModalVisible && editingTask) {
      setPickerIcon(editingTask.icon);
      setPickerColor(editingTask.color || '#4A90E2');
      setPickerDate(editingTask.date);
    } else if (editModalVisible && !editingTask) {
      // Reset to defaults for new task
      setPickerIcon('⏰');
      setPickerColor('#4A90E2');
      setPickerDate(selectedDate);
    } else if (!editModalVisible) {
      // Close any open picker modals when main modal closes
      setShowIconColorPicker(false);
      setShowDatePicker(false);
    }
  }, [editModalVisible, editingTask, selectedDate]);

  const weekDates = getCurrentWeekDates();
  // TODO: Replace with Zustand store tasks when data layer is integrated
  const selectedDayTasks = getTasksForDate(selectedDate);

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    // Don't auto-expand - let user swipe to expand
  };

  const handleToggleExpand = () => {
    setIsModalExpanded(!isModalExpanded);
  };

  const handleTaskToggle = async (taskId: string) => {
    try {
      await toggleCompletion(taskId);
    } catch (error) {
      console.error('Failed to toggle task:', error);
      // TODO: Show error toast
    }
  };

  const handleTaskPress = (taskId: string) => {
    // Find task in mock data
    // TODO: Replace with Zustand store when data layer is integrated
    const task = mockTasks.find((t) => t.id === taskId);
    if (task) {
      openModal(task);
    }
  };

  const handleSaveTask = async (taskData: Partial<Task>) => {
    try {
      if (editingTask) {
        // Update existing task
        await updateTask(editingTask.id, taskData);
      } else {
        // Create new task
        await addTask(taskData as Omit<Task, 'id' | 'createdAt' | 'updatedAt'>);
      }
      closeModal();
    } catch (error) {
      console.error('Failed to save task:', error);
      // TODO: Show user-facing error message (e.g., toast notification)
      // For now, prevent modal from closing so user knows something went wrong
      throw error;
    }
  };

  return (
    <View style={styles.container}>
      {/* Weekly Grid Background */}
      <WeeklyGrid
        weekDates={weekDates}
        tasks={mockTasks}
        selectedDate={selectedDate}
        onDateSelect={handleDateSelect}
      />

      {/* Daily Modal (slides up/down) */}
      <DailyModal
        tasks={selectedDayTasks}
        wakeTime={mockSettings.wakeTime}
        sleepTime={mockSettings.sleepTime}
        isExpanded={isModalExpanded}
        onToggleExpand={handleToggleExpand}
        onTaskToggle={handleTaskToggle}
        onTaskPress={handleTaskPress}
      />

      {/* Task Edit Modal */}
      <TaskEditModal
        visible={editModalVisible}
        task={editingTask}
        initialDate={selectedDate}
        onClose={closeModal}
        onSave={handleSaveTask}
        onOpenIconPicker={(icon, color) => {
          setPickerIcon(icon);
          setPickerColor(color);
          setShowIconColorPicker(true);
        }}
        onOpenDatePicker={(date) => {
          setPickerDate(date);
          setShowDatePicker(true);
        }}
        pickerIcon={pickerIcon}
        pickerColor={pickerColor}
        pickerDate={pickerDate}
      />

      {/* Icon & Color Picker Modal (lifted out to avoid nesting) */}
      <IconColorPicker
        visible={showIconColorPicker}
        selectedIcon={pickerIcon}
        selectedColor={pickerColor}
        onClose={() => setShowIconColorPicker(false)}
        onConfirm={(icon, color) => {
          setPickerIcon(icon);
          setPickerColor(color);
          setShowIconColorPicker(false);
        }}
      />

      {/* Date Picker Modal (lifted out to avoid nesting) */}
      <DatePicker
        visible={showDatePicker}
        selectedDate={pickerDate}
        onClose={() => setShowDatePicker(false)}
        onSelectDate={(date) => {
          setPickerDate(date);
          setShowDatePicker(false);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.secondary,
  },
});
