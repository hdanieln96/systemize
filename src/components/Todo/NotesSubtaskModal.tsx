import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  PanResponder,
  Dimensions,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@/constants';
import { Task } from '@/types';
import ModalHandle from '../Timeline/ModalHandle';

interface NotesSubtaskModalProps {
  visible: boolean;
  task?: Task;
  onClose: () => void;
  onEdit: (task: Task) => void;
}

const SCREEN_HEIGHT = Dimensions.get('window').height;
const MODAL_HEIGHT = SCREEN_HEIGHT * 0.7;

/**
 * NotesSubtaskModal - Quick view modal for notes and subtasks (read-only)
 * Shows notes and subtasks without editing capability
 */
export default function NotesSubtaskModal({
  visible,
  task,
  onClose,
  onEdit,
}: NotesSubtaskModalProps) {
  const insets = useSafeAreaInsets();
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  // Animate modal in/out
  useEffect(() => {
    if (visible) {
      Animated.spring(translateY, {
        toValue: SCREEN_HEIGHT - MODAL_HEIGHT,
        useNativeDriver: true,
        damping: 20,
        stiffness: 300,
      }).start();
    } else {
      Animated.spring(translateY, {
        toValue: SCREEN_HEIGHT,
        useNativeDriver: true,
        damping: 20,
        stiffness: 300,
      }).start();
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
    Animated.spring(translateY, {
      toValue: SCREEN_HEIGHT,
      useNativeDriver: true,
      damping: 20,
      stiffness: 300,
    }).start(() => {
      onClose();
    });
  };

  const handleEdit = () => {
    if (task) {
      onClose();
      setTimeout(() => onEdit(task), 300);
    }
  };

  if (!visible || !task) return null;

  return (
    <TouchableOpacity style={styles.modalBackdrop} activeOpacity={1} onPress={handleClose}>
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
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Notes & Subtasks</Text>
          </View>

          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.contentContainer}
          >
            {/* Notes Section */}
            {task.notes && (
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>Notes</Text>
                <View style={styles.notesBox}>
                  <Text style={styles.notesText}>{task.notes}</Text>
                </View>
              </View>
            )}

            {/* Subtasks Section */}
            {task.subtasks && task.subtasks.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>
                  Subtasks ({task.subtasks.filter((s) => s.isCompleted).length}/
                  {task.subtasks.length} completed)
                </Text>
                {task.subtasks.map((subtask) => (
                  <View key={subtask.id} style={styles.subtaskRow}>
                    <View style={styles.subtaskCheckbox}>
                      {subtask.isCompleted && <View style={styles.subtaskCheckmark} />}
                    </View>
                    <Text
                      style={[
                        styles.subtaskTitle,
                        subtask.isCompleted && styles.subtaskCompleted,
                      ]}
                    >
                      {subtask.title}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            {/* Edit Button */}
            <TouchableOpacity
              style={[styles.editButton, { backgroundColor: task.color || Colors.primary.main }]}
              onPress={handleEdit}
              activeOpacity={0.8}
            >
              <Text style={styles.editButtonText}>Edit Task</Text>
            </TouchableOpacity>

            <View style={{ height: Spacing.xl }} />
          </ScrollView>
        </Animated.View>
      </View>
    </TouchableOpacity>
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
    paddingHorizontal: Spacing.lg,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionLabel: {
    ...Typography.small,
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text.secondary,
    marginBottom: Spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  notesBox: {
    backgroundColor: Colors.background.secondary,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  notesText: {
    ...Typography.body,
    fontSize: 15,
    color: Colors.text.primary,
    lineHeight: 22,
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
  subtaskTitle: {
    ...Typography.body,
    fontSize: 15,
    color: Colors.text.primary,
    flex: 1,
  },
  subtaskCompleted: {
    textDecorationLine: 'line-through',
    color: Colors.text.tertiary,
  },
  editButton: {
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
  editButtonText: {
    ...Typography.body,
    fontSize: 18,
    fontWeight: '700',
    color: Colors.neutral.white,
  },
});
