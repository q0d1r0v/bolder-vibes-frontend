"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.error(error);
    }
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-50 mb-6">
          <AlertTriangle className="h-10 w-10 text-danger" />
        </div>

        <h1 className="text-2xl font-bold text-text-primary">
          Something went wrong
        </h1>
        <p className="text-sm text-text-secondary mt-2 max-w-sm mx-auto">
          An unexpected error occurred. Please try again.
        </p>

        <div className="mt-8">
          <Button onClick={reset}>Try Again</Button>
        </div>
      </div>
    </div>
  );
}
