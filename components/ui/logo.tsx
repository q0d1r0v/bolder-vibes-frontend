import Link from "next/link";
import { Sparkles } from "lucide-react";

interface LogoProps {
  size?: "sm" | "md";
}

export function Logo({ size = "md" }: LogoProps) {
  const iconSize = size === "sm" ? "h-7 w-7 rounded-lg" : "h-8 w-8 rounded-xl";
  const sparkleSize = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";
  const textSize = size === "sm" ? "text-sm" : "text-lg";

  return (
    <Link href="/" className="flex items-center gap-2.5">
      <div
        className={`${iconSize} bg-gradient-to-br from-[#7C3AED] to-[#6D28D9] flex items-center justify-center`}
      >
        <Sparkles className={`${sparkleSize} text-white`} />
      </div>
      <span
        className={`${textSize} font-semibold tracking-tight text-text-primary`}
      >
        Bolder Vibes
      </span>
    </Link>
  );
}
