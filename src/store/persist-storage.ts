import AsyncStorage from '@react-native-async-storage/async-storage';
import { createJSONStorage } from 'zustand/middleware';
import { reportRecoverableError } from '@/utils/recoverable-error';

function reportPersistenceError(storeName: string, operation: string, error: unknown) {
  reportRecoverableError({
    kind: 'persistence',
    messageKey: 'errors.persistence',
    retryLabelKey: 'common.tryAgain',
    source: `${storeName}.${operation}`,
    error,
  });
}

export function createSafeJsonStorage<T>(storeName: string) {
  return createJSONStorage<T>(() => ({
    getItem: async (name) => {
      try {
        return await AsyncStorage.getItem(name);
      } catch (error) {
        reportPersistenceError(storeName, `getItem:${name}`, error);
        return null;
      }
    },
    setItem: async (name, value) => {
      try {
        await AsyncStorage.setItem(name, value);
      } catch (error) {
        reportPersistenceError(storeName, `setItem:${name}`, error);
      }
    },
    removeItem: async (name) => {
      try {
        await AsyncStorage.removeItem(name);
      } catch (error) {
        reportPersistenceError(storeName, `removeItem:${name}`, error);
      }
    },
  }));
}
