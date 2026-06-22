import { cn } from "@/shared/lib/utils";

import type { CreatorCountryTag } from "../model/types";

const FLAG_CLASS = "h-4 w-6 shrink-0 rounded-[2px] ring-1 ring-black/10";

const JapanFlag = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 36 24"
    className={className}
    aria-hidden="true"
    preserveAspectRatio="xMidYMid meet"
  >
    <rect width="36" height="24" fill="#ffffff" />
    <circle cx="18" cy="12" r="7.2" fill="#bc002d" />
  </svg>
);

const KoreaFlag = ({ className }: { className?: string }) => (
  <svg
    viewBox="-72 -48 144 96"
    className={className}
    aria-hidden="true"
    preserveAspectRatio="xMidYMid meet"
  >
    <path fill="#fff" d="M-72-48v96H72v-96z" />
    <g stroke="#000" strokeWidth="4">
      <path
        transform="rotate(33.69006752598)"
        d="M-50-12v24m6 0v-24m6 0v24m76 0V1m0-2v-11m6 0v11m0 2v11m6 0V1m0-2v-11"
      />
      <path
        transform="rotate(-33.69006752598)"
        d="M-50-12v24m6 0V1m0-2v-11m6 0v24m76 0V1m0-2v-11m6 0v24m6 0V1m0-2v-11"
      />
    </g>
    <g transform="rotate(33.69006752598)">
      <path fill="#cd2e3a" d="M12 0a18 18 0 11-36 0 24 24 0 1148 0" />
      <path
        fill="#0047a0"
        d="M0 0a12 12 0 1124 0 24 24 0 11-48 0 12 12 0 1024 0"
      />
    </g>
  </svg>
);

const UsaFlag = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 640 480"
    className={className}
    aria-hidden="true"
    preserveAspectRatio="xMidYMid slice"
  >
    <path fill="#bd3d44" d="M0 0h640v480H0" />
    <path
      stroke="#fff"
      strokeWidth="37"
      d="M0 55.3h640M0 129h640M0 203h640M0 277h640M0 351h640M0 425h640"
    />
    <path fill="#192f5d" d="M0 0h364.8v258.5H0" />
    <marker id="us-star" markerHeight="30" markerWidth="30">
      <path fill="#fff" d="m14 0 9 27L0 10h28L5 27z" />
    </marker>
    <path
      fill="none"
      markerMid="url(#us-star)"
      d="m0 0 16 11h61 61 61 61 60L47 37h61 61 60 61L16 63h61 61 61 61 60L47 89h61 61 60 61L16 115h61 61 61 61 60L47 141h61 61 60 61L16 166h61 61 61 61 60L47 192h61 61 60 61L16 218h61 61 61 61 60z"
    />
  </svg>
);

type CountryFlagGlyphProps = {
  tag?: CreatorCountryTag | null;
  className?: string;
};

const FLAG_EMOJI = {
  KR: "🇰🇷",
  JP: "🇯🇵",
  US: "🇺🇸",
} as const;

const FlagSvg = ({
  tag,
  className,
}: {
  tag: "KR" | "JP" | "US";
  className?: string;
}) => {
  if (tag === "JP") return <JapanFlag className={cn(FLAG_CLASS, className)} />;
  if (tag === "KR") return <KoreaFlag className={cn(FLAG_CLASS, className)} />;
  return <UsaFlag className={cn(FLAG_CLASS, className)} />;
};

export const CountryFlagGlyph = ({ tag, className }: CountryFlagGlyphProps) => {
  if (tag === "OTHER") {
    return <span className={cn("text-base leading-none", className)}>🌐</span>;
  }
  if (tag === "KR" || tag === "JP" || tag === "US") {
    return (
      <>
        <span className="country-flag-svg">
          <FlagSvg tag={tag} className={className} />
        </span>
        <span
          aria-hidden="true"
          className={cn("country-flag-emoji text-base leading-none", className)}
        >
          {FLAG_EMOJI[tag]}
        </span>
      </>
    );
  }
  return null;
};
