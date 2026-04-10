import * as SecureStore from 'expo-secure-store';

export const storage = {
  async setSecure(key: string, value: string): Promise<void> {
    await SecureStore.setItemAsync(key, value);
  },

  async getSecure(key: string): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(key);
    } catch {
      return null;
    }
  },

  async removeSecure(key: string): Promise<void> {
    await SecureStore.deleteItemAsync(key);
  },

  setLocal(key: string, value: any): void {
    globalThis.localStorage?.setItem(key, JSON.stringify(value));
  },

  getLocal<T>(key: string): T | null {
    try {
      const value = globalThis.localStorage?.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch {
      return null;
    }
  },

  removeLocal(key: string): void {
    globalThis.localStorage?.removeItem(key);
  },
};