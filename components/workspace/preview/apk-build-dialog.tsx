"use client";

import { useEffect, useRef, useState } from "react";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Download,
  Package,
  AlertCircle,
  Trash2,
  KeyRound,
  ExternalLink,
  Smartphone,
  Apple,
  Boxes,
} from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Input } from "@/components/ui/input";
import { useApkBuild } from "@/hooks/use-apk-build";
import type {
  AndroidBuildType,
  ApkBuildPlatform,
} from "@/lib/api/apk-build.api";
import {
  clearExpoToken,
  getExpoTokenStatus,
  setExpoToken,
} from "@/lib/api/expo-account.api";
import { cn } from "@/lib/utils";

interface ApkBuildDialogProps {
  open: boolean;
  onClose: () => void;
  projectId: string;
}

function formatBytes(bytes: number | undefined): string {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

const EXPO_TOKEN_KEY = ["expo-token-status"];

export function ApkBuildDialog({
  open,
  onClose,
  projectId,
}: ApkBuildDialogProps) {
  const { status, state, logs, build, isBuilding, download } =
    useApkBuild(projectId);
  const queryClient = useQueryClient();

  const logRef = useRef<HTMLPreElement>(null);
  // Every build runs on Expo EAS now — local Docker builds were pulled
  // because they exhaust the backend host's CPU / disk when multiple
  // users build at once. Cloud builds queue on Expo's infrastructure
  // and cost us nothing at runtime.
  const [platform, setPlatform] = useState<ApkBuildPlatform>("android");
  const [buildType, setBuildType] = useState<AndroidBuildType>("apk");
  const [tokenInput, setTokenInput] = useState("");
  const [tokenInputError, setTokenInputError] = useState<string | null>(null);

  const { data: expoStatus } = useQuery({
    queryKey: EXPO_TOKEN_KEY,
    queryFn: getExpoTokenStatus,
    enabled: open,
    staleTime: 30_000,
  });

  const saveToken = useMutation({
    mutationFn: (token: string) => setExpoToken(token),
    onSuccess: (data) => {
      queryClient.setQueryData(EXPO_TOKEN_KEY, data);
      setTokenInput("");
      setTokenInputError(null);
      toast.success("Expo token saved");
    },
    onError: (err: unknown) => {
      const message =
        (err as { response?: { data?: { message?: string | string[] } } })
          ?.response?.data?.message;
      const text = Array.isArray(message) ? message.join(", ") : message;
      setTokenInputError(text ?? "Failed to save token");
    },
  });

  const clearToken = useMutation({
    mutationFn: () => clearExpoToken(),
    onSuccess: () => {
      queryClient.setQueryData(EXPO_TOKEN_KEY, { set: false });
      toast.success("Expo token removed");
    },
    onError: () => toast.error("Failed to remove token"),
  });

  // Autoscroll logs to the bottom as new lines arrive.
  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [logs]);

  const tokenSet = expoStatus?.set === true;
  const canStartCloud = tokenSet;

  const handleSaveToken = () => {
    const trimmed = tokenInput.trim();
    if (trimmed.length < 16) {
      setTokenInputError("Token looks too short (expected 16+ chars).");
      return;
    }
    saveToken.mutate(trimmed);
  };

  const handleStartBuild = () => {
    if (!canStartCloud) {
      setTokenInputError("Save your Expo token first to build in the cloud.");
      return;
    }
    build({ mode: "cloud", platform, buildType });
  };

  const title =
    platform === "ios"
      ? "iOS Simulator Build"
      : buildType === "aab"
        ? "Android App Bundle (AAB)"
        : "Android APK Build";
  const description =
    platform === "ios"
      ? "Build a simulator-compatible .tar.gz runnable in the iPhone Simulator."
      : buildType === "aab"
        ? "Build a Play Store-ready Android App Bundle."
        : "Build a debug APK you can install directly on an Android phone.";

  // The completed build's artifact kind may differ from the current
  // form selection (e.g. user switched after a build completed). Prefer
  // the stored state, fall back to the form for builds in progress.
  const effectivePlatform = state?.platform ?? platform;
  const effectiveBuildType = state?.buildType ?? buildType;
  const artifactLabel =
    effectivePlatform === "ios"
      ? "iOS simulator archive"
      : effectiveBuildType === "aab"
        ? "AAB"
        : "APK";

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={title}
      description={description}
      className="max-w-lg"
    >
      <div className="space-y-4">
        {/* Platform toggle */}
        {status !== "building" && (
          <div>
            <p className="text-xs text-text-muted mb-1.5">Platform</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPlatform("android")}
                className={cn(
                  "flex items-start gap-2 rounded-lg border p-3 text-left transition-colors",
                  platform === "android"
                    ? "border-accent bg-accent/10"
                    : "border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06]",
                )}
              >
                <Smartphone className="h-4 w-4 mt-0.5 text-text-secondary" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-primary">
                    Android
                  </p>
                  <p className="text-[11px] text-text-muted mt-0.5">
                    APK or AAB (Play Store bundle)
                  </p>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setPlatform("ios")}
                className={cn(
                  "flex items-start gap-2 rounded-lg border p-3 text-left transition-colors",
                  platform === "ios"
                    ? "border-accent bg-accent/10"
                    : "border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06]",
                )}
              >
                <Apple className="h-4 w-4 mt-0.5 text-text-secondary" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-primary">
                    iOS Simulator
                  </p>
                  <p className="text-[11px] text-text-muted mt-0.5">
                    Cloud only. No Apple account needed.
                  </p>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Android artifact type (APK vs AAB) — only when Android selected */}
        {status !== "building" && platform === "android" && (
          <div>
            <p className="text-xs text-text-muted mb-1.5">Artifact</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setBuildType("apk")}
                className={cn(
                  "flex items-start gap-2 rounded-lg border p-3 text-left transition-colors",
                  buildType === "apk"
                    ? "border-accent bg-accent/10"
                    : "border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06]",
                )}
              >
                <Package className="h-4 w-4 mt-0.5 text-text-secondary" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-primary">
                    APK (install on phone)
                  </p>
                  <p className="text-[11px] text-text-muted mt-0.5">
                    Directly installable via sideload.
                  </p>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setBuildType("aab")}
                className={cn(
                  "flex items-start gap-2 rounded-lg border p-3 text-left transition-colors",
                  buildType === "aab"
                    ? "border-accent bg-accent/10"
                    : "border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06]",
                )}
              >
                <Boxes className="h-4 w-4 mt-0.5 text-text-secondary" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-primary">
                    AAB (Play Store)
                  </p>
                  <p className="text-[11px] text-text-muted mt-0.5">
                    Google Play upload format. Cloud only.
                  </p>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Expo token management — always shown (cloud builds only) */}
        {status !== "building" && (
          <div className="rounded-lg border border-white/[0.08] bg-white/[0.02] p-3 space-y-2">
            <div className="flex items-center gap-2">
              <KeyRound className="h-3.5 w-3.5 text-text-secondary" />
              <p className="text-xs font-medium text-text-primary">
                Expo access token
              </p>
              {tokenSet && (
                <span className="ml-auto text-[11px] text-emerald-400">
                  {expoStatus?.hint ?? "saved"}
                </span>
              )}
            </div>
            <p className="text-[11px] text-text-muted leading-relaxed">
              Create a token in your Expo account, then paste it below. It
              is stored encrypted at rest and only used to run{" "}
              <code className="text-text-secondary">eas build</code> on your
              behalf.{" "}
              <a
                href="https://expo.dev/accounts/[account]/settings/access-tokens"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-0.5 text-accent hover:underline"
              >
                Generate token
                <ExternalLink className="h-2.5 w-2.5" />
              </a>
            </p>
            {!tokenSet ? (
              <div className="flex items-start gap-2">
                <div className="flex-1">
                  <Input
                    type="password"
                    autoComplete="off"
                    spellCheck={false}
                    placeholder="expo_••••••••••••••••"
                    value={tokenInput}
                    onChange={(e) => {
                      setTokenInput(e.target.value);
                      setTokenInputError(null);
                    }}
                    error={tokenInputError ?? undefined}
                    className="h-9"
                  />
                </div>
                <Button
                  size="sm"
                  onClick={handleSaveToken}
                  loading={saveToken.isPending}
                  disabled={saveToken.isPending || tokenInput.trim() === ""}
                >
                  Save
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => clearToken.mutate()}
                  loading={clearToken.isPending}
                  disabled={clearToken.isPending}
                >
                  <Trash2 className="h-3 w-3" />
                  Remove
                </Button>
                <span className="text-[11px] text-text-muted">
                  {expoStatus?.setAt
                    ? `Saved ${new Date(expoStatus.setAt).toLocaleString()}`
                    : null}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Status banner */}
        <div className="rounded-lg border border-white/[0.08] bg-white/[0.03] p-4">
          {status === "idle" && (
            <div className="flex items-center gap-3">
              <Package className="h-5 w-5 text-text-muted" />
              <div className="flex-1">
                <p className="text-sm text-text-primary font-medium">
                  Ready to build
                </p>
                <p className="text-xs text-text-muted mt-0.5">
                  The build will run on Expo EAS and can be monitored below.
                </p>
              </div>
            </div>
          )}

          {status === "building" && (
            <div className="flex items-center gap-3">
              <Spinner size="sm" />
              <div className="flex-1">
                <p className="text-sm text-accent font-medium">
                  Building {artifactLabel}…
                </p>
                <p className="text-xs text-text-muted mt-0.5">
                  Submitted to Expo EAS. This includes queue + compile time.
                </p>
              </div>
            </div>
          )}

          {status === "ready" && (
            <div className="flex items-center gap-3">
              <Download className="h-5 w-5 text-emerald-400" />
              <div className="flex-1">
                <p className="text-sm text-emerald-400 font-medium">
                  {artifactLabel} ready
                </p>
                <p className="text-xs text-text-muted mt-0.5">
                  Size: {formatBytes(state?.sizeBytes)}
                  {state?.filename ? ` · ${state.filename}` : null}
                </p>
              </div>
            </div>
          )}

          {status === "error" && (
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-danger shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-danger font-medium">Build failed</p>
                <p className="text-xs text-text-muted mt-0.5 break-words">
                  {state?.error ?? "An error occurred."}
                </p>
                {state?.easBuildUrl && (
                  <a
                    href={state.easBuildUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-0.5 text-[11px] text-accent hover:underline mt-1.5"
                  >
                    Open build on Expo dashboard
                    <ExternalLink className="h-2.5 w-2.5" />
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Logs */}
        {logs.length > 0 && (
          <div>
            <p className="text-xs text-text-muted mb-1">Build log</p>
            <pre
              ref={logRef}
              className="h-48 overflow-auto rounded-md border border-white/[0.08] bg-black/40 p-3 text-[11px] leading-snug font-mono text-text-secondary whitespace-pre-wrap"
            >
              {logs.join("\n")}
            </pre>
          </div>
        )}

        {/* Install / upload instructions — phrased per artifact type */}
        {status === "ready" && effectivePlatform === "android" && effectiveBuildType === "apk" && (
          <div className="rounded-lg border border-white/[0.08] bg-white/[0.02] p-3 text-[11px] leading-relaxed text-text-muted">
            <p className="font-medium text-text-secondary mb-1">
              How to install on your phone
            </p>
            <ol className="list-decimal list-inside space-y-0.5">
              <li>Download the APK using the button below.</li>
              <li>
                On your Android phone, open the file (you may need to enable
                &ldquo;Install from unknown sources&rdquo;).
              </li>
              <li>Tap &ldquo;Install&rdquo; when prompted.</li>
            </ol>
          </div>
        )}

        {status === "ready" && effectivePlatform === "android" && effectiveBuildType === "aab" && (
          <div className="rounded-lg border border-white/[0.08] bg-white/[0.02] p-3 text-[11px] leading-relaxed text-text-muted">
            <p className="font-medium text-text-secondary mb-1">
              How to upload to Google Play
            </p>
            <ol className="list-decimal list-inside space-y-0.5">
              <li>Download the .aab file using the button below.</li>
              <li>Open Google Play Console → your app → Internal testing or Production.</li>
              <li>Create a release and drop the .aab in the &ldquo;App bundles&rdquo; area.</li>
              <li>Play will process it and roll out to testers / production.</li>
            </ol>
          </div>
        )}

        {status === "ready" && effectivePlatform === "ios" && (
          <div className="rounded-lg border border-white/[0.08] bg-white/[0.02] p-3 text-[11px] leading-relaxed text-text-muted">
            <p className="font-medium text-text-secondary mb-1">
              How to run in the iOS Simulator
            </p>
            <ol className="list-decimal list-inside space-y-0.5">
              <li>Download the .tar.gz file.</li>
              <li>Extract it — you&apos;ll get an <code>.app</code> bundle.</li>
              <li>Open Simulator, then drag the <code>.app</code> onto a running device window.</li>
              <li>The app installs and launches automatically.</li>
            </ol>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-2">
          {status === "ready" ? (
            <>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleStartBuild}
                disabled={!canStartCloud}
              >
                Rebuild
              </Button>
              <Button size="sm" onClick={download}>
                <Download className="h-3.5 w-3.5" />
                Download
              </Button>
            </>
          ) : (
            <Button
              size="sm"
              onClick={handleStartBuild}
              loading={isBuilding}
              disabled={isBuilding || !canStartCloud}
            >
              <Package className="h-3.5 w-3.5" />
              {status === "error" ? "Retry build" : "Start build"}
            </Button>
          )}
        </div>
      </div>
    </Dialog>
  );
}
