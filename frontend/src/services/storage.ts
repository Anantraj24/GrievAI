/**
 * Reactive LocalStorage manager with change notifications and default fallback values.
 */

type StorageChangeListener = (key: string, newValue: any) => void;

class StorageManager {
  private listeners: Set<StorageChangeListener> = new Set();

  constructor() {
    window.addEventListener('storage', (event) => {
      if (event.key) {
        try {
          const parsed = event.newValue ? JSON.parse(event.newValue) : null;
          this.notify(event.key, parsed);
        } catch {
          this.notify(event.key, event.newValue);
        }
      }
    });
  }

  public get<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(key);
      if (item === null) {
        this.set(key, defaultValue);
        return defaultValue;
      }
      return JSON.parse(item) as T;
    } catch (e) {
      console.warn(`Error reading localStorage key "${key}":`, e);
      return defaultValue;
    }
  }

  public set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      this.notify(key, value);
    } catch (e) {
      console.error(`Error writing localStorage key "${key}":`, e);
    }
  }

  public remove(key: string): void {
    try {
      localStorage.removeItem(key);
      this.notify(key, null);
    } catch (e) {
      console.error(`Error removing localStorage key "${key}":`, e);
    }
  }

  public subscribe(listener: StorageChangeListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(key: string, newValue: any): void {
    this.listeners.forEach((listener) => {
      try {
        listener(key, newValue);
      } catch (err) {
        console.error('Error in storage listener', err);
      }
    });
  }
}

export const storage = new StorageManager();
