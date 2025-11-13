import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { Colors } from '@/constants';

interface CheckboxProps {
  checked: boolean;
  size?: number;
}

export default function Checkbox({ checked, size = 24 }: CheckboxProps) {
  const scaleAnim = useRef(new Animated.Value(checked ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: checked ? 1 : 0,
      useNativeDriver: true,
      damping: 15,
      stiffness: 200,
    }).start();
  }, [checked]);

  return (
    <View style={[styles.container, { width: size, height: size, borderRadius: size / 2 }]}>
      {checked && (
        <Animated.View
          style={[
            styles.checked,
            {
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <View style={styles.checkmark}>
            <View style={styles.checkmarkStem} />
            <View style={styles.checkmarkKick} />
          </View>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 2,
    borderColor: Colors.primary.main,
    backgroundColor: Colors.background.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checked: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.primary.main,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    width: 14,
    height: 14,
    position: 'relative',
  },
  checkmarkStem: {
    position: 'absolute',
    width: 2,
    height: 10,
    backgroundColor: Colors.neutral.white,
    left: 8,
    top: 2,
    transform: [{ rotate: '45deg' }],
  },
  checkmarkKick: {
    position: 'absolute',
    width: 2,
    height: 5,
    backgroundColor: Colors.neutral.white,
    left: 4,
    top: 7,
    transform: [{ rotate: '-45deg' }],
  },
});
