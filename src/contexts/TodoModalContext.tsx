import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Task } from '@/types';

interface TodoModalContextType {
  isVisible: boolean;
  editingTodo: Task | undefined;
  openModal: (todo?: Task) => void;
  closeModal: () => void;
}

const TodoModalContext = createContext<TodoModalContextType | undefined>(undefined);

export function TodoModalProvider({ children }: { children: ReactNode }) {
  const [isVisible, setIsVisible] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Task | undefined>(undefined);

  const openModal = (todo?: Task) => {
    setEditingTodo(todo);
    setIsVisible(true);
  };

  const closeModal = () => {
    setIsVisible(false);
    setEditingTodo(undefined);
  };

  return (
    <TodoModalContext.Provider value={{ isVisible, editingTodo, openModal, closeModal }}>
      {children}
    </TodoModalContext.Provider>
  );
}

export function useTodoModal() {
  const context = useContext(TodoModalContext);
  if (!context) {
    throw new Error('useTodoModal must be used within TodoModalProvider');
  }
  return context;
}
