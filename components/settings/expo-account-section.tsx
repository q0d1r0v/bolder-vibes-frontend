"use client";

import { useState } from "react";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Cloud,
  ExternalLink,
  KeyRound,
  Trash2,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  clearExpoToken,
  getExpoTokenStatus,
  setExpoToken,
} from "@/lib/api/expo-account.api";

const EXPO_TOKEN_KEY = ["expo-token-status"];

export function ExpoAccountSection() {
  const queryClient = useQueryClient();
  const [tokenInput, setTokenInput] = useState("");
  const [tokenError, setTokenError] = useState<string | null>(null);

  const { data: status, isLoading } = useQuery({
    queryKey: EXPO_TOKEN_KEY,
    queryFn: getExpoTokenStatus,
    staleTime: 30_000,
  });

  const save = useMutation({
    mutationFn: (token: string) => setExpoToken(token),
    onSuccess: (data) => {
      queryClient.setQueryData(EXPO_TOKEN_KEY, data);
      setTokenInput("");
      setTokenError(null);
      toast.success("Expo token saved");
    },
    onError: (err: unknown) => {
      const message = (err as { response?: { data?: { message?: string | string[] } } })
        ?.response?.data?.message;
      const text = Array.isArray(message) ? message.join(", ") : message;
      setTokenError(text ?? "Failed to save token");
    },
  });

  const clear = useMutation({
    mutationFn: () => clearExpoToken(),
    onSuccess: () => {
      queryClient.setQueryData(EXPO_TOKEN_KEY, { set: false });
      toast.success("Expo token removed");
    },
    onError: () => toast.error("Failed to remove token"),
  });

  const handleSave = () => {
    const trimmed = tokenInput.trim();
    if (trimmed.length < 16) {
      setTokenError("Token looks too short (expected 16+ chars).");
      return;
    }
    save.mutate(trimmed);
  };

  return (
    <section className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-5">
      <div className="flex items-center gap-2 mb-1">
        <Cloud className="h-4 w-4 text-text-secondary" />
        <h2 className="text-base font-medium text-text-primary">
          Expo account
        </h2>
        {status?.set && (
          <span className="ml-auto inline-flex items-center gap-1 text-[11px] text-emerald-400">
            <ShieldCheck className="h-3 w-3" />
            Connected
          </span>
        )}
      </div>
      <p className="text-xs text-text-muted leading-relaxed mb-4">
        Paste your Expo personal access token so Bolder Vibes can submit
        cloud builds (EAS) on your behalf. Tokens are stored encrypted with
        AES-256-GCM and only used for{" "}
        <code className="text-text-secondary">eas build</code>.{" "}
        <a
          href="https://expo.dev/settings/access-tokens"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-0.5 text-accent hover:underline"
        >
          Generate token
          <ExternalLink className="h-2.5 w-2.5" />
        </a>
      </p>

      {isLoading ? (
        <p className="text-xs text-text-muted">Loading…</p>
      ) : status?.set ? (
        <div className="flex items-center gap-3">
          <KeyRound className="h-4 w-4 text-text-secondary" />
          <div className="flex-1">
            <p className="text-sm text-text-primary">
              Token saved{" "}
              <span className="text-text-muted font-mono text-[11px]">
                {status.hint ?? ""}
              </span>
            </p>
            {status.setAt && (
              <p className="text-[11px] text-text-muted mt-0.5">
                Connected {new Date(status.setAt).toLocaleString()}
              </p>
            )}
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => clear.mutate()}
            loading={clear.isPending}
            disabled={clear.isPending}
          >
            <Trash2 className="h-3 w-3" />
            Remove
          </Button>
        </div>
      ) : (
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
                setTokenError(null);
              }}
              error={tokenError ?? undefined}
            />
          </div>
          <Button
            size="sm"
            onClick={handleSave}
            loading={save.isPending}
            disabled={save.isPending || tokenInput.trim() === ""}
          >
            Save
          </Button>
        </div>
      )}
    </section>
  );
}
