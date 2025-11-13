import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants';

interface IconPickerProps {
  selectedIcon: string;
  onSelectIcon: (icon: string) => void;
}

// Categorized emoji icons for different task types
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

/**
 * IconPicker - Grid of emoji icons for task selection
 * Organized by category with scroll view
 */
export default function IconPicker({ selectedIcon, onSelectIcon }: IconPickerProps) {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {Object.entries(ICON_CATEGORIES).map(([category, icons]) => (
        <View key={category} style={styles.category}>
          <Text style={styles.categoryTitle}>{category}</Text>
          <View style={styles.iconGrid}>
            {icons.map((icon) => (
              <TouchableOpacity
                key={icon}
                style={[
                  styles.iconButton,
                  selectedIcon === icon && styles.iconButtonSelected,
                ]}
                onPress={() => onSelectIcon(icon)}
                activeOpacity={0.7}
              >
                <Text style={styles.iconText}>{icon}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const ICON_SIZE = 48;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Spacing.md,
  },
  category: {
    marginBottom: Spacing.lg,
  },
  categoryTitle: {
    ...Typography.small,
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text.secondary,
    marginBottom: Spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  iconButton: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
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
});
