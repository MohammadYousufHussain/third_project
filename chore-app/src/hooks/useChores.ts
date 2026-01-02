// src/hooks/useChores.ts
import { useLocalStorage } from './useLocalStorage';
import type { Chore } from '../types';
import { saveChores, loadChores } from '../utils/storage';

export function useChores() {
  const [chores, setChores] = useLocalStorage<Chore[]>(
    'chores',
    [],
    saveChores,
    loadChores
  );

  const addChore = (chore: Chore) => {
    setChores((prev) => [...prev, chore]);
  };

  const updateChore = (id: string, updates: Partial<Chore>) => {
    setChores((prev) =>
      prev.map((chore) =>
        chore.id === id
          ? { ...chore, ...updates, updatedAt: new Date().toISOString() }
          : chore
      )
    );
  };

  const deleteChore = (id: string) => {
    setChores((prev) => prev.filter((chore) => chore.id !== id));
  };

  const toggleChoreComplete = (id: string) => {
    setChores((prev) =>
      prev.map((chore) =>
        chore.id === id
          ? {
              ...chore,
              isCompleted: !chore.isCompleted,
              updatedAt: new Date().toISOString()
            }
          : chore
      )
    );
  };

  const getChoreById = (id: string): Chore | undefined => {
    return chores.find((chore) => chore.id === id);
  };

  return {
    chores,
    addChore,
    updateChore,
    deleteChore,
    toggleChoreComplete,
    getChoreById
  };
}
