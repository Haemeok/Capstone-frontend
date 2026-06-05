import { forwardRef } from "react";

import { positionToStyle, type WatermarkPosition } from "../lib/watermark";
import { WatermarkBadge } from "./WatermarkBadge";

const LOGO_RATIO = 0.045;

type Props = {
  imageUrl: string;
  naturalWidth: number;
  naturalHeight: number;
  position: WatermarkPosition;
  scale: number;
  paddingPct: number;
  opacity: number;
  tint: number;
  blur: number;
};

/** natural 픽셀 크기로 렌더되는 캡처 대상 노드 */
export const WatermarkCanvas = forwardRef<HTMLDivElement, Props>(
  (
    {
      imageUrl,
      naturalWidth,
      naturalHeight,
      position,
      scale,
      paddingPct,
      opacity,
      tint,
      blur,
    },
    ref
  ) => {
    const logoPx = Math.round(naturalWidth * LOGO_RATIO * scale);
    const paddingPx = Math.round((naturalWidth * paddingPct) / 100);

    return (
      <div
        ref={ref}
        style={{
          position: "relative",
          width: naturalWidth,
          height: naturalHeight,
          overflow: "hidden",
        }}
      >
        <img
          src={imageUrl}
          alt=""
          crossOrigin="anonymous"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
        <div style={positionToStyle(position, paddingPx)}>
          <WatermarkBadge
            imageUrl={imageUrl}
            naturalWidth={naturalWidth}
            naturalHeight={naturalHeight}
            position={position}
            paddingPx={paddingPx}
            logoPx={logoPx}
            opacity={opacity}
            tint={tint}
            blur={blur}
          />
        </div>
      </div>
    );
  }
);

WatermarkCanvas.displayName = "WatermarkCanvas";
