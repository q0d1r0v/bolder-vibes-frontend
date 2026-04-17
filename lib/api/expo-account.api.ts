import api from './axios';

export interface ExpoTokenStatus {
  set: boolean;
  hint?: string;
  setAt?: string;
}

export async function getExpoTokenStatus(): Promise<ExpoTokenStatus> {
  const res = await api.get<ExpoTokenStatus>('/users/me/expo-token');
  return res.data;
}

export async function setExpoToken(token: string): Promise<ExpoTokenStatus> {
  const res = await api.put<ExpoTokenStatus>('/users/me/expo-token', { token });
  return res.data;
}

export async function clearExpoToken(): Promise<void> {
  await api.delete('/users/me/expo-token');
}
