import api from './axios';
import { API_BASE_URL } from '@/lib/constants';
import { getAccessToken } from '@/lib/auth-tokens';

export type ApkBuildStatus = 'idle' | 'building' | 'ready' | 'error';
export type ApkBuildMode = 'local' | 'cloud';
export type ApkBuildPlatform = 'android' | 'ios';
export type AndroidBuildType = 'apk' | 'aab';

export interface ApkBuildState {
  projectId: string;
  status: ApkBuildStatus;
  mode?: ApkBuildMode;
  platform?: ApkBuildPlatform;
  buildType?: AndroidBuildType | 'simulator' | 'archive';
  downloadUrl?: string;
  sizeBytes?: number;
  error?: string;
  builtAt?: string;
  /** Cloud (EAS) builds only: URL to the Expo dashboard page for this
   *  build — gives the user a clickable link to full build logs. */
  easBuildUrl?: string;
  filename?: string;
}

export interface StartApkBuildOptions {
  mode?: ApkBuildMode;
  platform?: ApkBuildPlatform;
  buildType?: AndroidBuildType;
}

export async function startApkBuild(
  projectId: string,
  opts: StartApkBuildOptions = {},
): Promise<ApkBuildState> {
  const res = await api.post<ApkBuildState>(
    `/projects/${projectId}/apk/build`,
    {
      mode: opts.mode ?? 'local',
      platform: opts.platform ?? 'android',
      buildType: opts.buildType ?? 'apk',
    },
  );
  return res.data;
}

export async function getApkStatus(projectId: string): Promise<ApkBuildState> {
  const res = await api.get<ApkBuildState>(`/projects/${projectId}/apk/status`);
  return res.data;
}

/**
 * Download the compiled build artifact (APK / AAB / iOS simulator
 * archive). Auth-aware fetch → blob → programmatic `<a download>`.
 *
 * The filename is derived in priority order:
 *   1. `filenameHint` passed by the caller (from build state).
 *   2. The server's `Content-Disposition` header (authoritative — it
 *      knows the correct extension for the actual artifact type).
 *   3. A last-ditch `app-<projectId>.bin` fallback so we never lie
 *      about the extension.
 */
export async function downloadApk(
  projectId: string,
  filenameHint?: string,
): Promise<void> {
  const token = getAccessToken();
  const res = await fetch(
    `${API_BASE_URL}/projects/${projectId}/apk/download`,
    { headers: token ? { Authorization: `Bearer ${token}` } : {} },
  );
  if (!res.ok) {
    throw new Error(`Download failed (${res.status})`);
  }

  const dispositionName = parseContentDisposition(
    res.headers.get('content-disposition'),
  );
  const filename =
    filenameHint ||
    dispositionName ||
    `app-${projectId.slice(0, 8)}.bin`;

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function parseContentDisposition(header: string | null): string | null {
  if (!header) return null;
  // Match `filename="foo.aab"` or `filename*=UTF-8''foo.aab` (RFC 5987).
  const m =
    header.match(/filename\*\s*=\s*(?:UTF-8'')?"?([^";]+)"?/i) ||
    header.match(/filename\s*=\s*"?([^";]+)"?/i);
  if (!m) return null;
  try {
    return decodeURIComponent(m[1]);
  } catch {
    return m[1];
  }
}
