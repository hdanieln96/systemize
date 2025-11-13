import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { initDatabase } from './src/services/database';
import MainNavigator from './src/navigation/MainNavigator';
import { TaskModalProvider } from './src/contexts/TaskModalContext';
import { TodoModalProvider } from './src/contexts/TodoModalContext';
import { HabitModalProvider } from './src/contexts/HabitModalContext';
import { Colors } from './src/constants';

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function prepare() {
      try {
        // Initialize the database
        await initDatabase();
        setIsReady(true);
      } catch (e) {
        setError(e as Error);
        console.error('Database initialization error:', e);
        // Still set ready to true so we can show error screen
        setIsReady(true);
      }
    }

    prepare();
  }, []);

  if (!isReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary.main} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <View style={styles.errorContent}>
          <View style={styles.errorIcon} />
          <Text style={styles.errorTitle}>Failed to Initialize</Text>
          <Text style={styles.errorMessage}>{error.message}</Text>
        </View>
      </View>
    );
  }

  return (
    <TaskModalProvider>
      <TodoModalProvider>
        <HabitModalProvider>
          <NavigationContainer>
            <StatusBar style="dark" />
            <MainNavigator />
          </NavigationContainer>
        </HabitModalProvider>
      </TodoModalProvider>
    </TaskModalProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background.secondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background.secondary,
    padding: 24,
  },
  errorContent: {
    alignItems: 'center',
  },
  errorIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.error,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 14,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
});
