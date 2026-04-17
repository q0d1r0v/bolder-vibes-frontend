import api from './axios';

export type NativePreviewStatus = 'idle' | 'building' | 'ready' | 'error';

export interface NativePreviewState {
  projectId: string;
  status: NativePreviewStatus;
  /** `exp://...` URL that opens in Expo Go on a real phone. */
  expoUrl?: string;
  error?: string;
  startedAt?: string;
}

export async function startNativePreview(
  projectId: string,
): Promise<NativePreviewState> {
  const res = await api.post<NativePreviewState>(
    `/projects/${projectId}/native-preview/start`,
  );
  return res.data;
}

export async function stopNativePreview(projectId: string): Promise<void> {
  await api.post(`/projects/${projectId}/native-preview/stop`);
}

export async function getNativePreviewStatus(
  projectId: string,
): Promise<NativePreviewState> {
  const res = await api.get<NativePreviewState>(
    `/projects/${projectId}/native-preview/status`,
  );
  return res.data;
}
