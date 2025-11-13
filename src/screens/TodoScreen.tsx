import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing } from '@constants/index';
import { useTaskStore } from '@store/taskStore';
import { useTodoModal } from '../contexts/TodoModalContext';
import { Task } from '@/types';
import TodoEditModal from '@components/Todo/TodoEditModal';
import IconColorPicker from '@components/Timeline/IconColorPicker';
import TodoItem from '@components/Todo/TodoItem';
import NotesSubtaskModal from '@components/Todo/NotesSubtaskModal';

export default function TodoScreen() {
  const insets = useSafeAreaInsets();
  const { unscheduledTasks, refreshTasks, toggleCompletion, addTask, updateTask, removeTask } =
    useTaskStore();
  const { isVisible, editingTodo, closeModal, openModal } = useTodoModal();
  const tasks = unscheduledTasks();

  // Picker state (lifted to avoid nested modals)
  const [pickerIcon, setPickerIcon] = useState<string>('📝');
  const [pickerColor, setPickerColor] = useState<string>(Colors.primary.main);
  const [showIconPicker, setShowIconPicker] = useState(false);

  // Notes/subtask modal state
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [selectedTaskForNotes, setSelectedTaskForNotes] = useState<Task | undefined>();

  useEffect(() => {
    refreshTasks();
  }, []);

  // Initialize picker values when modal opens
  useEffect(() => {
    if (isVisible) {
      if (editingTodo) {
        setPickerIcon(editingTodo.icon);
        setPickerColor(editingTodo.color || Colors.primary.main);
      } else {
        // Defaults for new todo
        setPickerIcon('📝');
        setPickerColor(Colors.primary.main);
      }
    }
  }, [isVisible, editingTodo]);

  // Handler for opening icon/color picker
  const handleOpenIconPicker = (icon: string, color: string) => {
    setPickerIcon(icon);
    setPickerColor(color);
    setShowIconPicker(true);
  };

  // Handler for saving todo
  const handleSaveTodo = async (todoData: Partial<Task>) => {
    if (editingTodo) {
      // Update existing todo
      await updateTask(editingTodo.id, todoData);
    } else {
      // Create new todo - cast to required type
      await addTask(todoData as Omit<Task, 'id' | 'createdAt' | 'updatedAt'>);
    }
    await refreshTasks();
  };

  // Handler for opening edit modal
  const handleEditTodo = (task: Task) => {
    openModal(task);
  };

  // Handler for deleting todo
  const handleDeleteTodo = async (taskId: string) => {
    await removeTask(taskId);
    await refreshTasks();
  };

  // Handler for opening notes/subtask modal
  const handleOpenNoteView = (task: Task) => {
    setSelectedTaskForNotes(task);
    setShowNoteModal(true);
  };

  const renderTask = ({ item }: { item: Task }) => (
    <TodoItem
      task={item}
      onEdit={handleEditTodo}
      onToggle={toggleCompletion}
      onDelete={handleDeleteTodo}
      onOpenNoteView={handleOpenNoteView}
    />
  );

  if (tasks.length === 0) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={[styles.emptyContainer, { paddingTop: insets.top }]}>
          <Text style={styles.emptyIcon}>📝</Text>
          <Text style={styles.emptyTitle}>No unscheduled tasks</Text>
          <Text style={styles.emptySubtitle}>
            Tap the + button to create a new todo
          </Text>
        </View>

        {/* Modals */}
        <TodoEditModal
          visible={isVisible}
          todo={editingTodo}
          onClose={closeModal}
          onSave={handleSaveTodo}
          onOpenIconPicker={handleOpenIconPicker}
          pickerIcon={pickerIcon}
          pickerColor={pickerColor}
        />

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
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <FlatList
          data={tasks}
          renderItem={renderTask}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      </View>

      {/* Modals */}
      <TodoEditModal
        visible={isVisible}
        todo={editingTodo}
        onClose={closeModal}
        onSave={handleSaveTodo}
        onOpenIconPicker={handleOpenIconPicker}
        pickerIcon={pickerIcon}
        pickerColor={pickerColor}
      />

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

      <NotesSubtaskModal
        visible={showNoteModal}
        task={selectedTaskForNotes}
        onClose={() => setShowNoteModal(false)}
        onEdit={handleEditTodo}
      />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.secondary,
  },
  listContent: {
    padding: Spacing.md,
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: Colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: Spacing.md,
  },
  emptyTitle: {
    ...Typography.display,
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },
  emptySubtitle: {
    ...Typography.body,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
});
