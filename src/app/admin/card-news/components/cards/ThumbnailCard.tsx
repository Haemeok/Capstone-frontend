import { forwardRef } from "react";

import type { CardTheme } from "./themes";

import "./card-fonts.css";

type ThumbnailCardProps = {
  imageUrl: string;
  hooking: string;
  subject: string;
  theme?: CardTheme;
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

/** Classic: 풀블리드 + 하단 그라데이션 + 좌하단 텍스트 */
const ClassicThumb = ({ imageUrl, hooking, subject }: ThumbnailCardProps) => (
  <>
    <img src={imageUrl} alt="" crossOrigin="anonymous" style={imgStyle} />
    <div
      style={{
        ...abs,
        bottom: 0,
        height: "60%",
        background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 100%)",
      }}
    />
    <div style={{ ...abs, bottom: 0, padding: "0 60px 140px", display: "flex", flexDirection: "column" }}>
      <p style={{ ...hookStyle, color: "#fff", textShadow: "0 2px 12px rgba(0,0,0,0.5)" }}>{hooking}</p>
      <p style={{ ...subStyle, color: "#fff", textShadow: "0 2px 12px rgba(0,0,0,0.5)", opacity: 0.95 }}>{subject}</p>
    </div>
    <div style={{ ...abs, bottom: 40, display: "flex", justifyContent: "center" }}>
      <BrandLogo />
    </div>
  </>
);

/** Bold: 후킹에 노란 하이라이트 박스 */
const BoldThumb = ({ imageUrl, hooking, subject }: ThumbnailCardProps) => (
  <>
    <img src={imageUrl} alt="" crossOrigin="anonymous" style={imgStyle} />
    <div
      style={{
        ...abs,
        bottom: 0,
        height: "60%",
        background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)",
      }}
    />
    <div style={{ ...abs, bottom: 0, padding: "0 60px 140px", display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
      <span
        style={{
          fontFamily: "Jalnan2, sans-serif",
          fontSize: 58,
          color: "#111",
          lineHeight: 1.4,
          wordBreak: "keep-all",
          backgroundColor: "#F2C94C",
          padding: "4px 20px",
          borderRadius: 8,
          display: "inline",
          boxDecorationBreak: "clone" as const,
        }}
      >
        {hooking}
      </span>
      <p style={{ ...subStyle, color: "#fff", textShadow: "0 2px 12px rgba(0,0,0,0.6)", marginTop: 20 }}>{subject}</p>
    </div>
    <div style={{ ...abs, bottom: 40, display: "flex", justifyContent: "center" }}>
      <BrandLogo />
    </div>
  </>
);

/** Frame: 흰색 두꺼운 프레임 + 하단 텍스트 영역 */
const FrameThumb = ({ imageUrl, hooking, subject }: ThumbnailCardProps) => {
  const border = 56;
  const photoSize = CARD - border * 2;
  const bottomArea = 280;

  return (
    <>
      {/* 흰 배경 */}
      <div style={{ ...abs, inset: 0, backgroundColor: "#fff" }} />
      {/* 프레임 안 사진 */}
      <img
        src={imageUrl}
        alt=""
        crossOrigin="anonymous"
        style={{
          position: "absolute",
          top: border,
          left: border,
          width: photoSize,
          height: CARD - border - bottomArea,
          objectFit: "cover",
          borderRadius: 12,
        }}
      />
      {/* 하단 텍스트 영역 */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: bottomArea,
          padding: `24px ${border + 12}px ${border}px`,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <p style={{ ...hookStyle, color: "#1a1a1a", fontSize: 52, textShadow: "none" }}>{hooking}</p>
        <p style={{ ...subStyle, color: "#666", fontSize: 38, textShadow: "none", marginTop: 12 }}>{subject}</p>
        <div style={{ marginTop: 20 }}>
          <BrandLogo color="#333" />
        </div>
      </div>
    </>
  );
};

/** Split: 상단 60% 사진 + 하단 40% 크림 영역 */
const SplitThumb = ({ imageUrl, hooking, subject }: ThumbnailCardProps) => {
  const splitAt = CARD * 0.58;

  return (
    <>
      {/* 상단 사진 */}
      <img
        src={imageUrl}
        alt=""
        crossOrigin="anonymous"
        style={{ position: "absolute", top: 0, left: 0, width: CARD, height: splitAt, objectFit: "cover" }}
      />
      {/* 하단 솔리드 */}
      <div
        style={{
          position: "absolute",
          top: splitAt,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "#FFF8F0",
        }}
      />
      {/* 구분선 */}
      <div style={{ position: "absolute", top: splitAt - 1, left: 60, right: 60, height: 3, backgroundColor: "#E8D5C0" }} />
      {/* 텍스트 */}
      <div
        style={{
          position: "absolute",
          top: splitAt,
          left: 0,
          right: 0,
          bottom: 0,
          padding: "40px 60px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <p style={{ ...hookStyle, color: "#3E2712", fontSize: 54, textShadow: "none" }}>{hooking}</p>
        <p style={{ ...subStyle, color: "#8B6D50", fontSize: 40, textShadow: "none", marginTop: 14 }}>{subject}</p>
        <div style={{ marginTop: 24 }}>
          <BrandLogo color="#6B4C30" />
        </div>
      </div>
    </>
  );
};

/** Dark: 강한 비네팅 + 글로우 텍스트 */
const DarkThumb = ({ imageUrl, hooking, subject }: ThumbnailCardProps) => (
  <>
    <img src={imageUrl} alt="" crossOrigin="anonymous" style={imgStyle} />
    {/* 비네팅 (사방) */}
    <div
      style={{
        ...abs,
        inset: 0,
        background: "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.7) 100%)",
      }}
    />
    <div
      style={{
        ...abs,
        bottom: 0,
        height: "65%",
        background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)",
      }}
    />
    <div style={{ ...abs, bottom: 0, padding: "0 60px 140px", display: "flex", flexDirection: "column" }}>
      <p
        style={{
          ...hookStyle,
          color: "#fff",
          textShadow: "0 0 40px rgba(255,255,255,0.12), 0 2px 12px rgba(0,0,0,0.8)",
        }}
      >
        {hooking}
      </p>
      <p
        style={{
          ...subStyle,
          color: "rgba(255,255,255,0.75)",
          textShadow: "0 2px 12px rgba(0,0,0,0.8)",
        }}
      >
        {subject}
      </p>
    </div>
    <div style={{ ...abs, bottom: 40, display: "flex", justifyContent: "center" }}>
      <BrandLogo color="#D4A853" />
    </div>
  </>
);

const THUMB_MAP: Record<CardTheme, React.FC<ThumbnailCardProps>> = {
  classic: ClassicThumb,
  bold: BoldThumb,
  frame: FrameThumb,
  split: SplitThumb,
  dark: DarkThumb,
};

export const ThumbnailCard = forwardRef<HTMLDivElement, ThumbnailCardProps>(
  (props, ref) => {
    const Renderer = THUMB_MAP[props.theme ?? "classic"];
    return (
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
        <Renderer {...props} />
      </div>
    );
  },
);

ThumbnailCard.displayName = "ThumbnailCard";

/* ─── shared style helpers ─── */
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
const subStyle: React.CSSProperties = {
  fontFamily: "Jalnan2, sans-serif",
  fontSize: 46,
  lineHeight: 1.3,
  margin: "16px 0 0",
  wordBreak: "keep-all",
};
