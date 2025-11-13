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
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@/constants';
import { Task, Subtask } from '@/types';
import ModalHandle from '../Timeline/ModalHandle';
import { getTodayString } from '@utils/timeUtils';

interface TodoEditModalProps {
  visible: boolean;
  todo?: Task; // Undefined for new todo
  onClose: () => void;
  onSave: (todoData: Partial<Task>) => Promise<void>;
  // Picker callbacks (to avoid nested modals)
  onOpenIconPicker: (icon: string, color: string) => void;
  pickerIcon: string;
  pickerColor: string;
}

const SCREEN_HEIGHT = Dimensions.get('window').height;
const MODAL_HEIGHT = SCREEN_HEIGHT * 0.9;

/**
 * TodoEditModal - Bottom sheet modal for unscheduled todo tasks
 * Features: Icon/Color picker, Priority toggle, Subtasks, Tags, Reminder, Notes
 */
export default function TodoEditModal({
  visible,
  todo,
  onClose,
  onSave,
  onOpenIconPicker,
  pickerIcon,
  pickerColor,
}: TodoEditModalProps) {
  const insets = useSafeAreaInsets();
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  // Form state
  const [title, setTitle] = useState('');
  const icon = pickerIcon;
  const color = pickerColor;
  const [priority, setPriority] = useState(false);
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [reminderDatetime, setReminderDatetime] = useState<Date | undefined>();
  const [showReminderPicker, setShowReminderPicker] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Tag input
  const [tagInput, setTagInput] = useState('');

  // Initialize form with todo data
  useEffect(() => {
    if (todo) {
      setTitle(todo.title);
      setPriority(todo.priority || false);
      setSubtasks(todo.subtasks || []);
      setTags(todo.tags || []);
      setNotes(todo.notes || '');
      if (todo.reminderDatetime) {
        setReminderDatetime(new Date(todo.reminderDatetime));
      } else {
        setReminderDatetime(undefined);
      }
    } else {
      // Reset for new todo
      setTitle('');
      setPriority(false);
      setSubtasks([]);
      setTags([]);
      setNotes('');
      setReminderDatetime(undefined);
    }
    setTagInput('');
  }, [todo, visible]);

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

  // Subtask management
  const addSubtask = () => {
    const newSubtask: Subtask = {
      id: `subtask-${Date.now()}-${Math.random()}`,
      title: '',
      isCompleted: false,
      order: subtasks.length,
    };
    setSubtasks([...subtasks, newSubtask]);
  };

  const updateSubtask = (id: string, updates: Partial<Subtask>) => {
    setSubtasks(
      subtasks.map((subtask) => (subtask.id === id ? { ...subtask, ...updates } : subtask))
    );
  };

  const deleteSubtask = (id: string) => {
    setSubtasks(subtasks.filter((s) => s.id !== id));
  };

  // Tag management
  const addTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  // Reminder management
  const handleReminderChange = (event: any, selectedDate?: Date) => {
    setShowReminderPicker(Platform.OS === 'ios');
    if (selectedDate) {
      setReminderDatetime(selectedDate);
    }
  };

  const clearReminder = () => {
    setReminderDatetime(undefined);
  };

  const formatReminderDatetime = (date: Date) => {
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const handleSave = async () => {
    if (!title.trim()) {
      console.warn('Title is required');
      return;
    }

    setIsSaving(true);

    try {
      const todoData: Partial<Task> = {
        title: title.trim(),
        type: 'timeblock',
        icon,
        color,
        time: '00:00', // Placeholder for unscheduled
        date: getTodayString(), // Use today as placeholder
        isScheduled: false, // Key difference from timeline tasks
        notes: notes.trim() || undefined,
        priority,
        subtasks: subtasks.length > 0 ? subtasks : undefined,
        tags: tags.length > 0 ? tags : undefined,
        reminderDatetime: reminderDatetime ? reminderDatetime.toISOString() : undefined,
      };

      await onSave(todoData);
      handleClose();
    } catch (error) {
      console.error('Error saving todo:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!visible) return null;

  return (
    <Animated.View style={[styles.modalBackdrop, { opacity: backdropOpacity }]}>
      <TouchableOpacity
        style={StyleSheet.absoluteFill}
        activeOpacity={1}
        onPress={handleClose}
      />
      <View pointerEvents="box-none" style={{ flex: 1, justifyContent: 'flex-end' }}>
        <Animated.View
          style={[
            styles.modalContainer,
            {
              paddingTop: insets.top + Spacing.sm,
              transform: [{ translateY }],
            },
          ]}
          pointerEvents="auto"
          onStartShouldSetResponder={() => true}
        >
          <View style={styles.handleContainer} {...panResponder.panHandlers}>
            <ModalHandle />
          </View>

          {/* Header */}
          <View style={styles.header} pointerEvents="auto">
            <Text style={styles.headerTitle}>{todo ? 'Edit Todo' : 'New Todo'}</Text>
          </View>

          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="always"
            contentContainerStyle={styles.contentContainer}
            pointerEvents="auto"
          >
            {/* Name Input with Icon Button */}
            <View style={styles.nameSection}>
              <TouchableOpacity
                style={[styles.iconButton, { backgroundColor: color }]}
                onPress={() => onOpenIconPicker(icon, color)}
                activeOpacity={0.7}
              >
                <Text style={styles.iconButtonText}>{icon}</Text>
              </TouchableOpacity>
              <TextInput
                style={styles.nameInput}
                placeholder="Todo name"
                placeholderTextColor={Colors.text.secondary}
                value={title}
                onChangeText={setTitle}
                maxLength={100}
              />
            </View>

            {/* Priority Toggle */}
            <View style={styles.prioritySection}>
              <View style={styles.priorityLeft}>
                <Text style={styles.priorityIcon}>⚡</Text>
                <Text style={styles.priorityLabel}>High Priority</Text>
              </View>
              <Switch
                value={priority}
                onValueChange={setPriority}
                trackColor={{ false: Colors.card.border, true: Colors.primary.main }}
                thumbColor={Colors.neutral.white}
              />
            </View>

            {/* Subtasks Section */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionLabel}>Subtasks</Text>
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={addSubtask}
                  activeOpacity={0.7}
                >
                  <Text style={styles.addButtonText}>+ Add</Text>
                </TouchableOpacity>
              </View>

              {subtasks.map((subtask) => (
                <View key={subtask.id} style={styles.subtaskRow}>
                  <TouchableOpacity
                    style={styles.subtaskCheckbox}
                    onPress={() => updateSubtask(subtask.id, { isCompleted: !subtask.isCompleted })}
                    activeOpacity={0.7}
                  >
                    {subtask.isCompleted && <View style={styles.subtaskCheckmark} />}
                  </TouchableOpacity>
                  <TextInput
                    style={[
                      styles.subtaskInput,
                      subtask.isCompleted && styles.subtaskInputCompleted,
                    ]}
                    placeholder="Subtask"
                    placeholderTextColor={Colors.text.secondary}
                    value={subtask.title}
                    onChangeText={(text) => updateSubtask(subtask.id, { title: text })}
                    maxLength={100}
                  />
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => deleteSubtask(subtask.id)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.deleteButtonText}>×</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>

            {/* Tags Section */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Tags</Text>

              {tags.length > 0 && (
                <View style={styles.tagsContainer}>
                  {tags.map((tag, index) => (
                    <View key={index} style={styles.tagChip}>
                      <Text style={styles.tagChipText}>{tag}</Text>
                      <TouchableOpacity onPress={() => removeTag(tag)} activeOpacity={0.7}>
                        <Text style={styles.tagChipRemove}>×</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}

              <View style={styles.tagInputRow}>
                <TextInput
                  style={styles.tagInput}
                  placeholder="Add tag..."
                  placeholderTextColor={Colors.text.secondary}
                  value={tagInput}
                  onChangeText={setTagInput}
                  onSubmitEditing={addTag}
                  maxLength={20}
                />
                <TouchableOpacity style={styles.tagAddButton} onPress={addTag} activeOpacity={0.7}>
                  <Text style={styles.tagAddButtonText}>Add</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Reminder Section */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Reminder</Text>
              <View style={styles.reminderContainer}>
                {reminderDatetime ? (
                  <View style={styles.reminderSet}>
                    <Text style={styles.reminderText}>{formatReminderDatetime(reminderDatetime)}</Text>
                    <TouchableOpacity onPress={clearReminder} activeOpacity={0.7}>
                      <Text style={styles.reminderClear}>Clear</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={styles.reminderButton}
                    onPress={() => setShowReminderPicker(true)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.reminderButtonText}>⏰ Set Reminder</Text>
                  </TouchableOpacity>
                )}
              </View>

              {showReminderPicker && (
                <DateTimePicker
                  value={reminderDatetime || new Date()}
                  mode="datetime"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={handleReminderChange}
                  minimumDate={new Date()}
                />
              )}
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

            {/* Save Button */}
            <TouchableOpacity
              style={[styles.continueButton, { backgroundColor: color }]}
              onPress={handleSave}
              disabled={isSaving}
            >
              <Text style={styles.continueButtonText}>{isSaving ? 'Saving...' : 'Save'}</Text>
            </TouchableOpacity>

            <View style={{ height: Spacing.xxl }} />
          </ScrollView>
        </Animated.View>
      </View>
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
  handleContainer: {
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.xs,
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  headerTitle: {
    ...Typography.h3,
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text.primary,
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
  prioritySection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.background.secondary,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
  },
  priorityLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  priorityIcon: {
    fontSize: 20,
  },
  priorityLabel: {
    ...Typography.body,
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  section: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
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
  addButton: {
    backgroundColor: Colors.primary.main,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.md,
  },
  addButtonText: {
    ...Typography.small,
    fontSize: 13,
    fontWeight: '600',
    color: Colors.neutral.white,
  },
  subtaskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    gap: Spacing.sm,
  },
  subtaskCheckbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: Colors.primary.main,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subtaskCheckmark: {
    width: 12,
    height: 12,
    borderRadius: 2,
    backgroundColor: Colors.primary.main,
  },
  subtaskInput: {
    ...Typography.body,
    flex: 1,
    fontSize: 16,
    color: Colors.text.primary,
    backgroundColor: Colors.background.secondary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  subtaskInputCompleted: {
    textDecorationLine: 'line-through',
    color: Colors.text.tertiary,
  },
  deleteButton: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.error,
    borderRadius: 14,
  },
  deleteButtonText: {
    fontSize: 20,
    color: Colors.neutral.white,
    fontWeight: 'bold',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  tagChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary.main + '20',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    gap: Spacing.xs,
  },
  tagChipText: {
    ...Typography.caption,
    fontSize: 14,
    color: Colors.primary.main,
    fontWeight: '600',
  },
  tagChipRemove: {
    fontSize: 18,
    color: Colors.primary.main,
    fontWeight: 'bold',
  },
  tagInputRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  tagInput: {
    ...Typography.body,
    flex: 1,
    fontSize: 16,
    color: Colors.text.primary,
    backgroundColor: Colors.background.secondary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  tagAddButton: {
    backgroundColor: Colors.primary.main,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
  },
  tagAddButtonText: {
    ...Typography.body,
    fontSize: 14,
    fontWeight: '600',
    color: Colors.neutral.white,
  },
  reminderContainer: {
    marginTop: Spacing.xs,
  },
  reminderButton: {
    backgroundColor: Colors.background.secondary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
  },
  reminderButtonText: {
    ...Typography.body,
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary.main,
  },
  reminderSet: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.background.secondary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
  },
  reminderText: {
    ...Typography.body,
    fontSize: 16,
    color: Colors.text.primary,
    fontWeight: '500',
  },
  reminderClear: {
    ...Typography.body,
    fontSize: 14,
    fontWeight: '600',
    color: Colors.error,
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
