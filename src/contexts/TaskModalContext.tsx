import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Task } from '@/types';

interface TaskModalContextType {
  isVisible: boolean;
  editingTask: Task | undefined;
  openModal: (task?: Task) => void;
  closeModal: () => void;
}

const TaskModalContext = createContext<TaskModalContextType | undefined>(undefined);

export function TaskModalProvider({ children }: { children: ReactNode }) {
  const [isVisible, setIsVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);

  const openModal = (task?: Task) => {
    setEditingTask(task);
    setIsVisible(true);
  };

  const closeModal = () => {
    setIsVisible(false);
    setEditingTask(undefined);
  };

  return (
    <TaskModalContext.Provider value={{ isVisible, editingTask, openModal, closeModal }}>
      {children}
    </TaskModalContext.Provider>
  );
}

export function useTaskModal() {
  const context = useContext(TaskModalContext);
  if (!context) {
    throw new Error('useTaskModal must be used within TaskModalProvider');
  }
  return context;
}
