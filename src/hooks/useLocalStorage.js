import { useState } from 'react';

/**
 * Generic hook for persisting state in localStorage.
 * @param {string} key - The localStorage key
 * @param {*} initialValue - Default value if key doesn't exist
 */
function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`useLocalStorage: error reading key "${key}"`, error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      // Allow functional updates (same API as useState)
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.warn(`useLocalStorage: error writing key "${key}"`, error);
    }
  };

  const removeValue = () => {
    try {
      setStoredValue(initialValue);
      window.localStorage.removeItem(key);
    } catch (error) {
      console.warn(`useLocalStorage: error removing key "${key}"`, error);
    }
  };

  return [storedValue, setValue, removeValue];
}

export default useLocalStorage;
