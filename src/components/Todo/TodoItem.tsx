import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { Colors, Typography, Spacing } from '@/constants';
import { Task } from '@/types';
import Checkbox from './Checkbox';
import DeleteAction from './DeleteAction';

interface TodoItemProps {
  task: Task;
  onEdit: (task: Task) => void;
  onToggle: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  onOpenNoteView: (task: Task) => void;
}

export default function TodoItem({
  task,
  onEdit,
  onToggle,
  onDelete,
  onOpenNoteView,
}: TodoItemProps) {
  const swipeableRef = useRef<Swipeable>(null);

  const hasNotesOrSubtasks = task.notes || (task.subtasks && task.subtasks.length > 0);

  const renderRightActions = (
    progress: Animated.AnimatedInterpolation<number>,
    dragX: Animated.AnimatedInterpolation<number>
  ) => {
    return (
      <DeleteAction
        onPress={() => {
          swipeableRef.current?.close();
          onDelete(task.id);
        }}
        dragX={dragX}
      />
    );
  };

  const handleContainerPress = () => {
    onEdit(task);
  };

  const handleTogglePress = (e: any) => {
    e.stopPropagation();
    onToggle(task.id);
  };

  const handleNoteIconPress = (e: any) => {
    e.stopPropagation();
    onOpenNoteView(task);
  };

  return (
    <Swipeable
      ref={swipeableRef}
      renderRightActions={renderRightActions}
      overshootRight={false}
      rightThreshold={40}
    >
      <TouchableOpacity
        style={styles.container}
        onPress={handleContainerPress}
        activeOpacity={0.7}
      >
        {/* Icon */}
        <Text style={styles.icon}>{task.icon}</Text>

        {/* Content */}
        <View style={styles.content}>
          <Text style={[styles.title, task.isCompleted && styles.completedText]}>
            {task.title}
          </Text>

          {/* Notes preview */}
          {task.notes && (
            <Text style={styles.notes} numberOfLines={1}>
              {task.notes}
            </Text>
          )}

          {/* Priority + Tags Row */}
          <View style={styles.metaRow}>
            {task.priority && (
              <View style={styles.priorityBadge}>
                <Text style={styles.priorityText}>!</Text>
              </View>
            )}

            {task.tags && task.tags.length > 0 && (
              <View style={styles.tagsContainer}>
                {task.tags.slice(0, 2).map((tag, index) => (
                  <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
                {task.tags.length > 2 && (
                  <Text style={styles.moreText}>+{task.tags.length - 2}</Text>
                )}
              </View>
            )}

            {/* Subtask count */}
            {task.subtasks && task.subtasks.length > 0 && (
              <Text style={styles.subtaskCount}>
                {task.subtasks.filter((s) => s.isCompleted).length}/{task.subtasks.length}{' '}
                subtasks
              </Text>
            )}
          </View>
        </View>

        {/* Note Icon (conditional) */}
        {hasNotesOrSubtasks && (
          <TouchableOpacity
            style={styles.noteIconButton}
            onPress={handleNoteIconPress}
            activeOpacity={0.7}
          >
            <Text style={styles.noteIcon}>📋</Text>
          </TouchableOpacity>
        )}

        {/* Checkbox */}
        <TouchableOpacity onPress={handleTogglePress} activeOpacity={0.7}>
          <Checkbox checked={task.isCompleted} />
        </TouchableOpacity>
      </TouchableOpacity>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.primary,
    borderRadius: 12,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  icon: {
    fontSize: 24,
    marginRight: Spacing.sm,
  },
  content: {
    flex: 1,
  },
  title: {
    ...Typography.h3,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: Colors.text.tertiary,
  },
  notes: {
    ...Typography.caption,
    fontSize: 13,
    color: Colors.text.secondary,
    marginBottom: Spacing.xs,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },
  priorityBadge: {
    backgroundColor: Colors.error,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  priorityText: {
    color: Colors.neutral.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
  tagsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  tag: {
    backgroundColor: Colors.primary.main + '20',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: 8,
  },
  tagText: {
    ...Typography.caption,
    fontSize: 11,
    color: Colors.primary.main,
    fontWeight: '600',
  },
  moreText: {
    ...Typography.caption,
    fontSize: 11,
    color: Colors.text.secondary,
  },
  subtaskCount: {
    ...Typography.caption,
    fontSize: 11,
    color: Colors.text.secondary,
  },
  noteIconButton: {
    padding: Spacing.xs,
    marginLeft: Spacing.xs,
  },
  noteIcon: {
    fontSize: 20,
  },
});
