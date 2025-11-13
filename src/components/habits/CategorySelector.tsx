/**
 * Category Selector Component
 * Allows users to select a habit category with icon + label
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

type Category = 'health' | 'mind' | 'work' | 'social' | 'finance' | 'other';

interface CategoryOption {
  value: Category;
  label: string;
  icon: string;
}

const CATEGORIES: CategoryOption[] = [
  { value: 'health', label: 'Health', icon: '💪' },
  { value: 'mind', label: 'Mind', icon: '🧠' },
  { value: 'work', label: 'Work', icon: '💼' },
  { value: 'social', label: 'Social', icon: '👥' },
  { value: 'finance', label: 'Finance', icon: '💰' },
  { value: 'other', label: 'Other', icon: '📌' },
];

interface CategorySelectorProps {
  value: Category | undefined;
  onChange: (category: Category) => void;
}

export default function CategorySelector({
  value,
  onChange,
}: CategorySelectorProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Category</Text>
      <View style={styles.grid}>
        {CATEGORIES.map((category) => (
          <TouchableOpacity
            key={category.value}
            style={[
              styles.categoryButton,
              value === category.value && styles.categoryButtonSelected,
            ]}
            onPress={() => onChange(category.value)}
            activeOpacity={0.7}
          >
            <Text style={styles.categoryIcon}>{category.icon}</Text>
            <Text
              style={[
                styles.categoryLabel,
                value === category.value && styles.categoryLabelSelected,
              ]}
            >
              {category.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  categoryButton: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '30%',
    aspectRatio: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  categoryButtonSelected: {
    backgroundColor: '#EEF2FF',
    borderColor: '#6366F1',
  },
  categoryIcon: {
    fontSize: 32,
    marginBottom: 4,
  },
  categoryLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6B7280',
  },
  categoryLabelSelected: {
    color: '#6366F1',
    fontWeight: '600',
  },
});
