import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors } from '@/constants';

/**
 * ModalHandle - Draggable handle for the Daily Modal
 * A simple visual indicator that the modal can be dragged up/down
 */
export default function ModalHandle() {
  return (
    <View style={styles.container}>
      <View style={styles.handle} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.modal.handle,
  },
});
