import Link from "next/link";

interface LogoProps {
  size?: "sm" | "md";
  variant?: "light" | "dark";
  className?: string;
}

/**
 * Brand mark — matches `public/favicon.svg` exactly so browser tab,
 * bookmarks and in-app header share the same identity. The shape is
 * a blue gradient rounded square with a lightning-bolt glyph.
 */
export function Logo({
  size = "md",
  variant = "light",
  className = "",
}: LogoProps) {
  const px = size === "sm" ? 28 : 32;
  const textSize = size === "sm" ? "text-sm" : "text-lg";
  const gradId = `bv-logo-grad-${size}`;

  return (
    <Link
      href="/"
      className={`flex items-center gap-2.5 shrink-0 whitespace-nowrap ${className}`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={px}
        height={px}
        viewBox="0 0 32 32"
        className="shrink-0"
        aria-hidden
      >
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2563eb" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
        </defs>
        <rect width="32" height="32" rx="8" fill={`url(#${gradId})`} />
        <path d="M17.5 5L8 16h7l-1.5 11L24 14h-7l1.5-9z" fill="white" />
      </svg>
      <span
        className={`${textSize} font-semibold tracking-tight whitespace-nowrap ${
          variant === "dark" ? "text-white" : "text-text-primary"
        }`}
      >
        Bolder Vibes
      </span>
    </Link>
  );
}
