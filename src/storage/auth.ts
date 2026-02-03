import type { AuthUser } from '../types/auth';

const AUTH_STORAGE_KEY = '@coffee-delivery:auth-user';

export const saveAuthUser = (user: AuthUser) => {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
};

export const getAuthUser = (): AuthUser | null => {
  const storedUser = localStorage.getItem(AUTH_STORAGE_KEY);

  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser) as AuthUser;
  } catch {
    return null;
  }
};

export const clearAuthUser = () => {
  localStorage.removeItem(AUTH_STORAGE_KEY);
};
