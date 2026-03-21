import type { IUser } from '../types/auth';

const USER_STORAGE_KEY = 'chat_user';

export function saveUser(user: IUser) {
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
}

export function getUser(): IUser | null {
  const raw = localStorage.getItem(USER_STORAGE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as IUser;
  } catch {
    localStorage.removeItem(USER_STORAGE_KEY);
    return null;
  }
}

export function clearUser() {
  localStorage.removeItem(USER_STORAGE_KEY);
}