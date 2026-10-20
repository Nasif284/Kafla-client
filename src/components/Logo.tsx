/**
 * Kafla brand logo.
 *
 * Single source of truth for the logo mark and wordmark. To change the mark,
 * edit `LogoMark` here and keep `src/app/icon.svg` (favicon) in sync.
 */

const BRAND_GREEN = "#005440";

interface LogoMarkProps {
  size?: number;
  className?: string;
}

/** Rounded green tile with a "K" letter mark. */
export function LogoMark({ size = 40, className = "" }: LogoMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={`shrink-0 ${className}`}
    >
      <rect width="32" height="32" rx="9" fill={BRAND_GREEN} />
      <path
        d="M11.5 9v14M21 9l-7.5 7M15.5 14.8L21.5 23"
        stroke="#ffffff"
        strokeWidth="3.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

interface LogoProps {
  /** Size of the mark in pixels. The wordmark scales with it. */
  size?: number;
  /** "default" for light backgrounds, "inverse" for dark or photo backgrounds. */
  tone?: "default" | "inverse";
  /** Hide the "Kafla" wordmark and render only the mark. */
  showText?: boolean;
  /** Optional small caption under the wordmark (e.g. "Group Travel"). */
  tagline?: string;
  className?: string;
}

export default function Logo({
  size = 40,
  tone = "default",
  showText = true,
  tagline,
  className = "",
}: LogoProps) {
  const textColor = tone === "inverse" ? "text-white" : "text-[#181d1a]";
  const taglineColor = tone === "inverse" ? "text-white/80" : "text-[#0f6e56]";
  const fontSize = Math.round(size * 0.58);

  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <LogoMark size={size} />
      {showText && (
        <span className="flex flex-col">
          <span
            className={`font-headline font-black tracking-tight leading-none ${textColor}`}
            style={{ fontSize }}
          >
            Kafla
          </span>
          {tagline && (
            <span className={`text-[10px] font-bold uppercase tracking-wider mt-1 ${taglineColor}`}>
              {tagline}
            </span>
          )}
        </span>
      )}
    </span>
  );
}
