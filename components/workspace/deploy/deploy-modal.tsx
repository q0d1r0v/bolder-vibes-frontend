"use client";

import { useState } from "react";
import {
  X,
  Rocket,
  Download,
  Train,
  Triangle,
  ExternalLink,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";
import { IconButton } from "@/components/ui/icon-button";
import { Button } from "@/components/ui/button";
import { useDeployProject, useDownloadProject } from "@/hooks/queries/use-deploy";
import type { DeployProvider } from "@/lib/api/deploy.api";

interface DeployModalProps {
  projectId: string;
  projectName: string;
  onClose: () => void;
}

type DeployStep = "choose" | "provider-config" | "deploying" | "success" | "error";

export function DeployModal({ projectId, projectName, onClose }: DeployModalProps) {
  const [step, setStep] = useState<DeployStep>("choose");
  const [selectedProvider, setSelectedProvider] = useState<DeployProvider>("vercel");
  const [token, setToken] = useState("");
  const [deployUrl, setDeployUrl] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const deployMutation = useDeployProject(projectId);
  const downloadMutation = useDownloadProject(projectId);

  const handleDownload = () => {
    downloadMutation.mutate(undefined, {
      onSuccess: () => toast.success("Project downloaded!"),
      onError: () => toast.error("Failed to download project"),
    });
  };

  const handleDeploy = () => {
    if (!token.trim()) {
      toast.error(`${selectedProvider === "vercel" ? "Vercel" : "Railway"} token is required`);
      return;
    }

    setStep("deploying");
    deployMutation.mutate(
      {
        provider: selectedProvider,
        token: token.trim(),
        projectName,
      },
      {
        onSuccess: (res) => {
          setDeployUrl(res.url || "");
          setStep("success");
        },
        onError: (err) => {
          setErrorMsg(err instanceof Error ? err.message : "Deployment failed");
          setStep("error");
        },
      },
    );
  };

  const selectProvider = (provider: DeployProvider) => {
    setSelectedProvider(provider);
    setToken("");
    setStep("provider-config");
  };

  const providerLabel = selectedProvider === "vercel" ? "Vercel" : "Railway";

  const tokenHelpUrl =
    selectedProvider === "vercel"
      ? "https://vercel.com/account/tokens"
      : "https://railway.app/account/tokens";

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border-subtle bg-gray-50">
          <div className="flex items-center gap-2">
            <Rocket className="h-4 w-4 text-accent" />
            <span className="text-sm font-semibold text-text-primary">
              Deploy Project
            </span>
          </div>
          <IconButton size="sm" aria-label="Close" onClick={onClose}>
            <X className="h-4 w-4" />
          </IconButton>
        </div>

        <div className="p-5">
          {step === "choose" && (
            <div className="space-y-3">
              <p className="text-sm text-text-secondary mb-4">
                Choose how to deploy{" "}
                <span className="font-medium text-text-primary">{projectName}</span>
              </p>

              <button
                onClick={() => selectProvider("vercel")}
                className="w-full flex items-center gap-4 p-4 rounded-xl border border-border-subtle hover:border-accent/30 hover:bg-accent-soft/10 transition-all text-left group"
              >
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-black to-gray-700 flex items-center justify-center shrink-0">
                  <Triangle className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-text-primary group-hover:text-accent transition-colors">
                      Deploy to Vercel
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-700 uppercase">
                      Free
                    </span>
                  </div>
                  <p className="text-xs text-text-muted mt-0.5">
                    Best for frontend apps — Next.js, React, Vue, static sites
                  </p>
                </div>
              </button>

              <button
                onClick={() => selectProvider("railway")}
                className="w-full flex items-center gap-4 p-4 rounded-xl border border-border-subtle hover:border-accent/30 hover:bg-accent-soft/10 transition-all text-left group"
              >
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shrink-0">
                  <Train className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-text-primary group-hover:text-accent transition-colors">
                      Deploy to Railway
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700 uppercase">
                      Full-Stack
                    </span>
                  </div>
                  <p className="text-xs text-text-muted mt-0.5">
                    For full-stack apps with backend, databases, and APIs
                  </p>
                </div>
              </button>

              <button
                onClick={handleDownload}
                disabled={downloadMutation.isPending}
                className="w-full flex items-center gap-4 p-4 rounded-xl border border-border-subtle hover:border-accent/30 hover:bg-accent-soft/10 transition-all text-left group"
              >
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shrink-0">
                  {downloadMutation.isPending ? (
                    <Loader2 className="h-5 w-5 text-white animate-spin" />
                  ) : (
                    <Download className="h-5 w-5 text-white" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-text-primary group-hover:text-accent transition-colors">
                    Download Source Code
                  </div>
                  <p className="text-xs text-text-muted mt-0.5">
                    Get a ZIP file to deploy anywhere you want
                  </p>
                </div>
              </button>
            </div>
          )}

          {step === "provider-config" && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1.5">
                  {providerLabel} API Token
                </label>
                <input
                  type="password"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && token.trim()) handleDeploy();
                  }}
                  placeholder={
                    selectedProvider === "vercel"
                      ? "Enter your Vercel token..."
                      : "railway_token_xxxxxxxx"
                  }
                  autoFocus
                  className="w-full px-3 py-2 rounded-lg border border-border-subtle text-sm focus:border-accent focus:ring-2 focus:ring-accent/10 outline-none transition-all"
                />
                <p className="text-xs text-text-muted mt-1.5">
                  Get your token from{" "}
                  <a
                    href={tokenHelpUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:underline"
                  >
                    {tokenHelpUrl.replace("https://", "")}
                    <ExternalLink className="inline h-3 w-3 ml-0.5" />
                  </a>
                </p>
              </div>

              {selectedProvider === "vercel" && (
                <div className="bg-blue-50 rounded-lg p-3">
                  <p className="text-xs text-blue-700 leading-relaxed">
                    <strong>Vercel Hobby plan:</strong> Unlimited deployments, auto SSL,
                    global CDN — all free. Create a token at Vercel Settings &rarr; Tokens &rarr; Create.
                  </p>
                </div>
              )}

              <div className="flex gap-2 justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setStep("choose")}
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Back
                </Button>
                <Button size="sm" onClick={handleDeploy} disabled={!token.trim()}>
                  <Rocket className="h-3.5 w-3.5" />
                  Deploy to {providerLabel}
                </Button>
              </div>
            </div>
          )}

          {step === "deploying" && (
            <div className="text-center py-8">
              <Loader2 className="h-10 w-10 text-accent animate-spin mx-auto mb-4" />
              <p className="text-sm font-medium text-text-primary">
                Deploying to {providerLabel}...
              </p>
              <p className="text-xs text-text-muted mt-1">This may take a minute</p>
            </div>
          )}

          {step === "success" && (
            <div className="text-center py-6">
              <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <p className="text-sm font-semibold text-text-primary mb-2">
                Deployed Successfully!
              </p>
              {deployUrl && (
                <a
                  href={deployUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-accent hover:underline break-all"
                >
                  {deployUrl}
                  <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                </a>
              )}
              <div className="mt-4">
                <Button size="sm" variant="secondary" onClick={onClose}>
                  Done
                </Button>
              </div>
            </div>
          )}

          {step === "error" && (
            <div className="text-center py-6">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <p className="text-sm font-semibold text-text-primary mb-1">
                Deployment Failed
              </p>
              <p className="text-xs text-text-muted mb-4 max-w-sm mx-auto">{errorMsg}</p>
              <div className="flex gap-2 justify-center">
                <Button size="sm" variant="ghost" onClick={onClose}>
                  Close
                </Button>
                <Button size="sm" onClick={() => setStep("provider-config")}>
                  Try Again
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
