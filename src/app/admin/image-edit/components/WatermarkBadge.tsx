import { backdropCopyStyle, type WatermarkPosition } from "../lib/watermark";

import "./watermark-fonts.css";

type Props = {
  imageUrl: string;
  naturalWidth: number;
  naturalHeight: number;
  position: WatermarkPosition;
  paddingPx: number;
  logoPx: number;
  opacity: number;
  tint: number;
  blur: number;
};

const TEXT_OPTICAL_NUDGE = 0.0825;

export const WatermarkBadge = ({
  imageUrl,
  naturalWidth,
  naturalHeight,
  position,
  paddingPx,
  logoPx,
  opacity,
  tint,
  blur,
}: Props) => (
  <div
    style={{
      position: "relative",
      overflow: "hidden",
      display: "inline-flex",
      borderRadius: logoPx * 2,
      border: `${Math.max(1, logoPx * 0.025)}px solid rgba(255, 255, 255, 0.35)`,
      boxShadow: `0 ${logoPx * 0.1}px ${logoPx * 0.22}px rgba(0,0,0,0.22)`,
      opacity,
    }}
  >
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img
      src={imageUrl}
      alt=""
      crossOrigin="anonymous"
      style={{
        ...backdropCopyStyle(position, paddingPx, naturalWidth, naturalHeight),
        filter: `blur(${logoPx * blur}px)`,
      }}
    />
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: `linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0) 100%), rgba(0, 0, 0, ${tint})`,
      }}
    />
    <div
      style={{
        position: "relative",
        zIndex: 1,
        display: "flex",
        alignItems: "center",
        gap: logoPx * 0.33,
        padding: `${logoPx * 0.4}px ${logoPx * 0.62}px`,
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/favicon-96x96.png"
        alt=""
        crossOrigin="anonymous"
        style={{
          width: logoPx,
          height: logoPx,
          borderRadius: "50%",
          flex: "none",
        }}
      />
      <span
        style={{
          fontFamily: "Jalnan2, sans-serif",
          fontSize: logoPx * 0.78,
          color: "#fff",
          textShadow: "0 1px 5px rgba(0,0,0,0.5)",
          whiteSpace: "nowrap",
          transform: `translateY(${logoPx * TEXT_OPTICAL_NUDGE}px)`,
        }}
      >
        레시피오
      </span>
    </div>
  </div>
);
