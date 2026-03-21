import { api } from './api';
import type { ILoginPayload, IUser } from '../types/auth';

export async function login(payload: ILoginPayload): Promise<IUser> {
  const { data } = await api.post<IUser>('/auth/login', payload);
  return data;
}