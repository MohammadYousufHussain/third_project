// src/hooks/useLocalStorage.ts
import { useState, useEffect } from 'react';

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  saveFunction: (value: T) => void,
  loadFunction: () => T
): [T, (value: T | ((prev: T) => T)) => void] {
  // Initialize state with loaded value or initial value
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = loadFunction();
      return item || initialValue;
    } catch (error) {
      console.error(`Error loading ${key}:`, error);
      return initialValue;
    }
  });

  // Update localStorage when state changes
  useEffect(() => {
    try {
      saveFunction(storedValue);
    } catch (error) {
      console.error(`Error saving ${key}:`, error);
    }
  }, [storedValue, key, saveFunction]);

  const setValue = (value: T | ((prev: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
    } catch (error) {
      console.error(`Error setting value for ${key}:`, error);
    }
  };

  return [storedValue, setValue];
}
