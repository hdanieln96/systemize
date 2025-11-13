import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Animated,
  Dimensions,
} from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants';

interface IconColorPickerProps {
  visible: boolean;
  selectedIcon: string;
  selectedColor?: string;
  onClose: () => void;
  onConfirm: (icon: string, color: string) => void;
}

// Categorized emoji icons
const ICON_CATEGORIES = {
  'Time & Productivity': ['⏰', '⏱️', '⏲️', '⌚', '📅', '🕐', '🕑', '🕒', '🕓', '🕔', '🕕', '🕖'],
  'Work & Study': ['💼', '💻', '📚', '📝', '✏️', '📖', '📊', '📈', '📉', '🎯', '✅', '📋'],
  'Health & Fitness': ['💪', '🏃', '🚴', '🏋️', '🤸', '🧘', '🥗', '🍎', '💊', '🩺', '❤️', '🫀'],
  'Food & Drink': ['🍳', '☕', '🍽️', '🥐', '🍔', '🍕', '🍜', '🥤', '🍺', '🍷', '🧃', '🥛'],
  'Home & Chores': ['🏠', '🧹', '🧺', '🛁', '🚿', '🛏️', '🧼', '🧽', '🧴', '🗑️', '📦', '🔑'],
  'Social & Fun': ['👥', '🎉', '🎮', '🎬', '🎵', '🎨', '📱', '💬', '📞', '🎤', '🎧', '🎲'],
  'Travel & Transport': ['🚗', '🚕', '🚙', '🚌', '🚎', '🚐', '🚑', '🚒', '🚓', '✈️', '🚂', '🚢'],
  'Nature & Weather': ['☀️', '🌙', '⭐', '🌟', '💫', '☁️', '🌧️', '⛈️', '🌈', '🌸', '🌼', '🌻'],
  'Symbols': ['📍', '🔔', '🔕', '🎁', '💡', '🔥', '💧', '🌊', '⚡', '🎈', '🎊', '🏆'],
};

// Color palette
const COLOR_PALETTE = [
  { name: 'Blue', value: Colors.primary.main },
  { name: 'Light Blue', value: Colors.primary.light },
  { name: 'Teal', value: Colors.accent.teal },
  { name: 'Green', value: Colors.success },
  { name: 'Orange', value: Colors.accent.orange },
  { name: 'Warning', value: Colors.warning },
  { name: 'Red', value: Colors.error },
  { name: 'Purple', value: Colors.accent.purple },
  { name: 'Pink', value: '#EC407A' },
  { name: 'Indigo', value: '#5C6BC0' },
  { name: 'Cyan', value: '#00ACC1' },
  { name: 'Lime', value: '#9CCC65' },
  { name: 'Amber', value: '#FFA726' },
  { name: 'Deep Orange', value: '#FF7043' },
  { name: 'Brown', value: '#8D6E63' },
  { name: 'Gray', value: Colors.neutral.darkGray },
];

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

/**
 * IconColorPicker - Combined modal for selecting icon and color together
 * Shows icon picker at top and color picker below with a preview
 */
export default function IconColorPicker({
  visible,
  selectedIcon,
  selectedColor,
  onClose,
  onConfirm,
}: IconColorPickerProps) {
  const [tempIcon, setTempIcon] = React.useState(selectedIcon);
  const [tempColor, setTempColor] = React.useState(selectedColor || Colors.primary.main);

  React.useEffect(() => {
    if (visible) {
      setTempIcon(selectedIcon);
      setTempColor(selectedColor || Colors.primary.main);
    }
  }, [visible, selectedIcon, selectedColor]);

  const handleConfirm = () => {
    onConfirm(tempIcon, tempColor);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
      presentationStyle="overFullScreen"
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Icon & Color</Text>
            <TouchableOpacity onPress={handleConfirm} style={styles.doneButton}>
              <Text style={styles.doneText}>Done</Text>
            </TouchableOpacity>
          </View>

          {/* Preview */}
          <View style={styles.previewContainer}>
            <View style={[styles.preview, { backgroundColor: tempColor }]}>
              <Text style={styles.previewIcon}>{tempIcon}</Text>
            </View>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false} nestedScrollEnabled={true} keyboardShouldPersistTaps="handled">
            {/* Color Picker */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Select Color</Text>
              <View style={styles.colorGrid}>
                {COLOR_PALETTE.map((color, index) => {
                  const isSelected = tempColor === color.value;

                  return (
                    <TouchableOpacity
                      key={`${color.value}-${index}`}
                      style={[
                        styles.colorSwatch,
                        { backgroundColor: color.value },
                        isSelected && styles.colorSwatchSelected,
                      ]}
                      onPress={() => setTempColor(color.value)}
                      activeOpacity={0.8}
                    >
                      {isSelected && <Text style={styles.checkmark}>✓</Text>}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Icon Picker */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Select Icon</Text>
              {Object.entries(ICON_CATEGORIES).map(([category, icons]) => (
                <View key={category} style={styles.category}>
                  <Text style={styles.categoryTitle}>{category}</Text>
                  <View style={styles.iconGrid}>
                    {icons.map((icon) => (
                      <TouchableOpacity
                        key={icon}
                        style={[
                          styles.iconButton,
                          tempIcon === icon && styles.iconButtonSelected,
                        ]}
                        onPress={() => setTempIcon(icon)}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.iconText}>{icon}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              ))}
            </View>

            <View style={styles.bottomPadding} />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const SWATCH_SIZE = 52;
const ICON_SIZE = 48;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    flex: 1,
    maxHeight: SCREEN_HEIGHT * 0.85,
    backgroundColor: Colors.neutral.white,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral.lightGray,
  },
  cancelButton: {
    padding: Spacing.sm,
  },
  cancelText: {
    ...Typography.body,
    color: Colors.text.secondary,
    fontSize: 16,
  },
  title: {
    ...Typography.h3,
    fontSize: 18,
    fontWeight: '600',
  },
  doneButton: {
    padding: Spacing.sm,
  },
  doneText: {
    ...Typography.body,
    color: Colors.primary.main,
    fontSize: 16,
    fontWeight: '600',
  },
  previewContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral.lightGray,
  },
  preview: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  previewIcon: {
    fontSize: 40,
  },
  content: {
    flex: 1,
  },
  section: {
    paddingVertical: Spacing.lg,
  },
  sectionLabel: {
    ...Typography.small,
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text.secondary,
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.lg,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  category: {
    marginBottom: Spacing.lg,
  },
  categoryTitle: {
    ...Typography.small,
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text.tertiary,
    marginBottom: Spacing.sm,
    paddingHorizontal: Spacing.lg,
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.lg,
  },
  iconButton: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.background.secondary,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  iconButtonSelected: {
    backgroundColor: Colors.primary.lighter,
    borderColor: Colors.primary.main,
  },
  iconText: {
    fontSize: 24,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  colorSwatch: {
    width: SWATCH_SIZE,
    height: SWATCH_SIZE,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'transparent',
  },
  colorSwatchSelected: {
    borderColor: Colors.neutral.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  checkmark: {
    fontSize: 24,
    color: Colors.neutral.white,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  bottomPadding: {
    height: Spacing.xl,
  },
});
