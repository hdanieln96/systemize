import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants';

interface ColorPickerProps {
  selectedColor?: string;
  onSelectColor: (color: string) => void;
}

// Preset colors for tasks - vibrant and accessible
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

/**
 * ColorPicker - Grid of color swatches for task customization
 * Shows checkmark on selected color
 */
export default function ColorPicker({ selectedColor, onSelectColor }: ColorPickerProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Task Color</Text>
      <View style={styles.colorGrid}>
        {COLOR_PALETTE.map((color) => {
          const isSelected = selectedColor === color.value;

          return (
            <TouchableOpacity
              key={color.value}
              style={[
                styles.colorSwatch,
                { backgroundColor: color.value },
                isSelected && styles.colorSwatchSelected,
              ]}
              onPress={() => onSelectColor(color.value)}
              activeOpacity={0.8}
            >
              {isSelected && <Text style={styles.checkmark}>✓</Text>}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const SWATCH_SIZE = 52;

const styles = StyleSheet.create({
  container: {
    paddingVertical: Spacing.md,
  },
  label: {
    ...Typography.small,
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text.secondary,
    marginBottom: Spacing.sm,
    paddingHorizontal: Spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    paddingHorizontal: Spacing.md,
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
});
