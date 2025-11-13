/**
 * Habit Modal Context
 * Manages the state for the habit edit/create modal
 */

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface HabitModalContextType {
  // Modal visibility
  isVisible: boolean;

  // Edit mode - if habitId is set, we're editing; otherwise creating
  habitId: string | null;

  // Modal actions
  openCreateModal: () => void;
  openEditModal: (habitId: string) => void;
  closeModal: () => void;
}

const HabitModalContext = createContext<HabitModalContextType | undefined>(
  undefined
);

interface HabitModalProviderProps {
  children: ReactNode;
}

export function HabitModalProvider({ children }: HabitModalProviderProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [habitId, setHabitId] = useState<string | null>(null);

  const openCreateModal = () => {
    setHabitId(null);
    setIsVisible(true);
  };

  const openEditModal = (id: string) => {
    setHabitId(id);
    setIsVisible(true);
  };

  const closeModal = () => {
    setIsVisible(false);
    // Keep habitId until modal animation completes
    setTimeout(() => setHabitId(null), 300);
  };

  return (
    <HabitModalContext.Provider
      value={{
        isVisible,
        habitId,
        openCreateModal,
        openEditModal,
        closeModal,
      }}
    >
      {children}
    </HabitModalContext.Provider>
  );
}

/**
 * Hook to use the habit modal context
 */
export function useHabitModal() {
  const context = useContext(HabitModalContext);
  if (context === undefined) {
    throw new Error('useHabitModal must be used within a HabitModalProvider');
  }
  return context;
}

export default HabitModalContext;
