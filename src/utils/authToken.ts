const AUTH_TOKEN_KEY = "taskforge_token";

export const getAuthToken = (): string | null => {
  try {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  } catch {
    return null;
  }
};

export const saveAuthToken = (token: string): void => {
  try {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  } catch {
    // If storage is unavailable, the authenticated session cannot persist.
  }
};

export const removeAuthToken = (): void => {
  try {
    localStorage.removeItem(AUTH_TOKEN_KEY);
  } catch {
    // If storage is unavailable, there is nothing persisted to remove.
  }
};
