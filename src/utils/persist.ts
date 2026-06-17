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

export const saveToStorage = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // If storage is unavailable, the app can still work during the current session.
  }
};

export const removeFromStorage = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch {
    // If storage is unavailable, there is nothing persisted to remove.
  }
};
