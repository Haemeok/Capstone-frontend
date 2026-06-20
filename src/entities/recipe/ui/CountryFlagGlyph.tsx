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

const US_STAR_X = [2, 4.6, 7.2, 9.8, 12.4];
const US_STAR_Y = [2.2, 5, 7.8, 10.6];

const UsaFlag = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 36 24"
    className={className}
    aria-hidden="true"
    preserveAspectRatio="xMidYMid meet"
  >
    <rect width="36" height="24" fill="#b22234" />
    <g fill="#fff">
      <rect y="2" width="36" height="2" />
      <rect y="6" width="36" height="2" />
      <rect y="10" width="36" height="2" />
      <rect y="14" width="36" height="2" />
      <rect y="18" width="36" height="2" />
      <rect y="22" width="36" height="2" />
    </g>
    <rect width="15" height="13" fill="#3c3b6e" />
    <g fill="#fff">
      {US_STAR_Y.flatMap((cy) =>
        US_STAR_X.map((cx) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="0.7" />
        ))
      )}
    </g>
  </svg>
);

type CountryFlagGlyphProps = {
  tag?: CreatorCountryTag | null;
  className?: string;
};

export const CountryFlagGlyph = ({ tag, className }: CountryFlagGlyphProps) => {
  if (tag === "JP") return <JapanFlag className={cn(FLAG_CLASS, className)} />;
  if (tag === "KR") return <KoreaFlag className={cn(FLAG_CLASS, className)} />;
  if (tag === "US") return <UsaFlag className={cn(FLAG_CLASS, className)} />;
  if (tag === "OTHER") {
    return <span className={cn("text-base leading-none", className)}>🌐</span>;
  }
  return null;
};
