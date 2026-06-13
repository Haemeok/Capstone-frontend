import { forwardRef } from "react";

import "./card-fonts.css";

type ThumbnailCardProps = {
  imageUrl: string;
  hooking: string;
};

const CARD = 1080;

const BrandLogo = ({ color = "#fff" }: { color?: string }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
    <img
      src="/favicon-96x96.png"
      alt=""
      style={{ width: 36, height: 36, borderRadius: "50%" }}
    />
    <span
      style={{
        fontFamily: "Jalnan2, sans-serif",
        fontSize: 28,
        color,
        textShadow: "0 1px 4px rgba(0,0,0,0.4)",
      }}
    >
      레시피오
    </span>
  </div>
);

export const ThumbnailCard = forwardRef<HTMLDivElement, ThumbnailCardProps>(
  ({ imageUrl, hooking }, ref) => (
    <div
      ref={ref}
      style={{
        width: CARD,
        height: CARD,
        position: "relative",
        overflow: "hidden",
        backgroundColor: "#000",
      }}
    >
      <img src={imageUrl} alt="" crossOrigin="anonymous" style={imgStyle} />
      <div
        style={{
          ...abs,
          bottom: 0,
          height: "60%",
          background:
            "linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 100%)",
        }}
      />
      <div
        style={{
          ...abs,
          bottom: 0,
          padding: "0 60px 140px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <p
          style={{
            ...hookStyle,
            color: "#fff",
            textShadow: "0 2px 12px rgba(0,0,0,0.5)",
          }}
        >
          {hooking}
        </p>
      </div>
      <div
        style={{
          ...abs,
          bottom: 40,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <BrandLogo />
      </div>
    </div>
  )
);

ThumbnailCard.displayName = "ThumbnailCard";

const abs: React.CSSProperties = { position: "absolute", left: 0, right: 0 };
const imgStyle: React.CSSProperties = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
  position: "absolute",
  top: 0,
  left: 0,
};
const hookStyle: React.CSSProperties = {
  fontFamily: "Jalnan2, sans-serif",
  fontSize: 58,
  lineHeight: 1.3,
  margin: 0,
  wordBreak: "keep-all",
};
