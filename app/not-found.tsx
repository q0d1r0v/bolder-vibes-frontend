import Link from "next/link";
import { FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-accent-soft mb-6">
          <FileQuestion className="h-10 w-10 text-accent" />
        </div>

        <h1 className="text-4xl font-bold text-text-primary">404</h1>
        <p className="text-lg text-text-secondary mt-2">Page not found</p>
        <p className="text-sm text-text-muted mt-1 max-w-sm mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        <div className="mt-8">
          <Link href="/">
            <Button>Go Home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
