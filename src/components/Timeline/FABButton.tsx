import React, { useRef } from 'react';
import { TouchableOpacity, Text, StyleSheet, Animated } from 'react-native';
import { Colors, Shadows } from '@/constants';

interface FABButtonProps {
  onPress: () => void;
  icon?: string;
  label?: string;
}

/**
 * FABButton - Floating Action Button
 * Animated button with press feedback
 * Default: Plus icon for adding new tasks
 */
export default function FABButton({ onPress, icon = '+', label }: FABButtonProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.9,
      useNativeDriver: true,
      damping: 15,
      stiffness: 400,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      damping: 15,
      stiffness: 400,
    }).start();
  };

  return (
    <Animated.View style={[styles.container, { transform: [{ scale: scaleAnim }] }]}>
      <TouchableOpacity
        style={styles.button}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >
        <Text style={styles.icon}>{icon}</Text>
        {label && <Text style={styles.label}>{label}</Text>}
      </TouchableOpacity>
    </Animated.View>
  );
}

const FAB_SIZE = 56;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    ...Shadows.large,
  },
  button: {
    width: FAB_SIZE,
    height: FAB_SIZE,
    borderRadius: FAB_SIZE / 2,
    backgroundColor: Colors.primary.main,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  icon: {
    fontSize: 28,
    color: Colors.neutral.white,
    fontWeight: '400',
  },
  label: {
    fontSize: 14,
    color: Colors.neutral.white,
    fontWeight: '600',
    marginLeft: 8,
  },
});
