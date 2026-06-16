// Loads data from localStorage. Returns the parsed value, or the fallback if nothing is saved.
export const loadFromStorage = <T>(key: string, fallback: T): T => {
  try {
    const saved = localStorage.getItem(key);
    if (saved === null) {
      return fallback;
    }
    return JSON.parse(saved) as T;
  } catch {
    return fallback;
  }
};

// Saves data to localStorage as a JSON string.
export const saveToStorage = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // If storage is unavailable, the app can still work during the current session.
  }
};

// Removes a key from localStorage.
export const removeFromStorage = (key: string): void => {
    localStorage.removeItem(key);
};
