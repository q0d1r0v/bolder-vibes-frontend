"use client";

import { useState } from "react";
import QRCode from "react-qr-code";
import {
  Smartphone,
  Square,
  Copy,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Apple,
} from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useNativePreview } from "@/hooks/use-native-preview";

interface PhonePreviewDialogProps {
  open: boolean;
  onClose: () => void;
  projectId: string;
}

export function PhonePreviewDialog({
  open,
  onClose,
  projectId,
}: PhonePreviewDialogProps) {
  const { status, expoUrl, error, isBuilding, start, stop, isStopPending } =
    useNativePreview(projectId);

  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!expoUrl) return;
    try {
      await navigator.clipboard.writeText(expoUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable — ignore */
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Preview on your phone"
      description="Scan the QR code from Expo Go to run your app on a real device."
      className="max-w-md"
    >
      <div className="space-y-4">
        {/* Status / QR body */}
        {status === "idle" && (
          <div className="rounded-lg border border-white/[0.08] bg-white/[0.03] p-4">
            <div className="flex items-start gap-3">
              <Smartphone className="h-5 w-5 text-text-muted shrink-0 mt-0.5" />
              <div className="flex-1 text-sm">
                <p className="text-text-primary font-medium">
                  Ready to launch
                </p>
                <p className="text-xs text-text-muted mt-1 leading-relaxed">
                  We&apos;ll start an Expo tunnel that routes to your app.
                  First start takes ~2-4 minutes; subsequent runs are
                  nearly instant.
                </p>
              </div>
            </div>
          </div>
        )}

        {status === "building" && (
          <div className="rounded-lg border border-accent/30 bg-accent/10 p-4 flex items-start gap-3">
            <Spinner size="sm" />
            <div className="flex-1 text-sm">
              <p className="text-accent font-medium">Starting tunnel…</p>
              <p className="text-xs text-text-muted mt-1 leading-relaxed">
                Spinning up the Metro bundler and opening a secure tunnel.
                Your device can be on any network.
              </p>
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="rounded-lg border border-danger/30 bg-danger/10 p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-danger shrink-0 mt-0.5" />
            <div className="flex-1 text-sm">
              <p className="text-danger font-medium">Failed to start</p>
              <p className="text-xs text-text-muted mt-1 break-words">
                {error ?? "Something went wrong."}
              </p>
            </div>
          </div>
        )}

        {status === "ready" && expoUrl && (
          <>
            <div className="rounded-lg border border-white/[0.08] bg-white p-5 flex items-center justify-center">
              {/* react-qr-code renders a pure-SVG matrix — pin the wrapper
                  background to white so dark-mode glass doesn't ruin the
                  quiet zone (scanners need the contrast). */}
              <QRCode
                value={expoUrl}
                size={224}
                level="M"
                bgColor="#ffffff"
                fgColor="#000000"
              />
            </div>

            <div className="rounded-lg border border-white/[0.08] bg-white/[0.03] p-3">
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[11px] uppercase tracking-wider text-text-muted">
                  Expo URL
                </span>
                <button
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1 text-[11px] text-text-secondary hover:text-text-primary transition-colors"
                >
                  {copied ? (
                    <>
                      <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" />
                      Copy
                    </>
                  )}
                </button>
              </div>
              <code className="block text-[11px] text-text-primary font-mono break-all leading-relaxed">
                {expoUrl}
              </code>
            </div>

            <div className="rounded-lg border border-white/[0.08] bg-white/[0.02] p-3 text-[11px] leading-relaxed text-text-muted">
              <p className="font-medium text-text-secondary mb-1.5">
                How to scan
              </p>
              <ol className="list-decimal list-inside space-y-0.5">
                <li>
                  Install <strong className="text-text-primary">Expo Go</strong>{" "}
                  on your phone.
                </li>
                <li>
                  Open the app and tap the <em>Scan QR code</em> button (or use
                  the camera app on iOS 13+).
                </li>
                <li>
                  Your app loads directly — every save in chat hot-reloads on
                  the phone.
                </li>
              </ol>
              <div className="flex gap-3 mt-3">
                <a
                  href="https://apps.apple.com/app/expo-go/id982107779"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-accent hover:underline"
                >
                  <Apple className="h-3 w-3" />
                  iOS App Store
                  <ExternalLink className="h-2.5 w-2.5" />
                </a>
                <a
                  href="https://play.google.com/store/apps/details?id=host.exp.exponent"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-accent hover:underline"
                >
                  <Smartphone className="h-3 w-3" />
                  Google Play
                  <ExternalLink className="h-2.5 w-2.5" />
                </a>
              </div>
            </div>
          </>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 pt-1">
          {status === "idle" && (
            <Button size="sm" onClick={() => start()} loading={isBuilding}>
              <Smartphone className="h-3.5 w-3.5" />
              Start phone preview
            </Button>
          )}
          {status === "building" && (
            <Button
              size="sm"
              variant="secondary"
              onClick={() => stop()}
              loading={isStopPending}
              disabled={isStopPending}
            >
              <Square className="h-3.5 w-3.5" />
              Cancel
            </Button>
          )}
          {status === "ready" && (
            <Button
              size="sm"
              variant="secondary"
              onClick={() => stop()}
              loading={isStopPending}
              disabled={isStopPending}
            >
              <Square className="h-3.5 w-3.5" />
              Stop
            </Button>
          )}
          {status === "error" && (
            <Button size="sm" onClick={() => start()} loading={isBuilding}>
              Try again
            </Button>
          )}
        </div>
      </div>
    </Dialog>
  );
}
