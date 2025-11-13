import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Colors, Typography, Spacing } from '@/constants';

interface DeleteActionProps {
  onPress: () => void;
  dragX: Animated.AnimatedInterpolation<number>;
}

export default function DeleteAction({ onPress, dragX }: DeleteActionProps) {
  return (
    <Animated.View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={onPress} activeOpacity={0.7}>
        <Text style={styles.icon}>🗑️</Text>
        <Text style={styles.text}>Delete</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  button: {
    backgroundColor: Colors.error,
    width: 80,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
  },
  icon: {
    fontSize: 24,
    marginBottom: Spacing.xs,
  },
  text: {
    ...Typography.caption,
    fontSize: 12,
    fontWeight: '600',
    color: Colors.neutral.white,
  },
});
