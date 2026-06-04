import { forwardRef } from "react";

import type { CardTheme } from "./themes";

import "./card-fonts.css";

type RecipeCardProps = {
  imageUrl: string;
  title: string;
  summary: string;
  boxPosition: "top" | "bottom";
  index: number;
  theme?: CardTheme;
};

const CARD = 1080;

/* ─── Badge components ─── */

const SquareBadge = ({
  index,
  bg,
  color,
}: {
  index: number;
  bg: string;
  color: string;
}) => (
  <div
    style={{
      width: 48,
      height: 48,
      borderRadius: 14,
      backgroundColor: bg,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    }}
  >
    <span
      style={{
        fontFamily: "Jalnan2, sans-serif",
        fontSize: 26,
        color,
        lineHeight: 1,
      }}
    >
      {index}
    </span>
  </div>
);

const CircleBadge = ({
  index,
  bg,
  color,
}: {
  index: number;
  bg: string;
  color: string;
}) => (
  <div
    style={{
      width: 52,
      height: 52,
      borderRadius: "50%",
      backgroundColor: bg,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    }}
  >
    <span
      style={{
        fontFamily: "Jalnan2, sans-serif",
        fontSize: 26,
        color,
        lineHeight: 1,
      }}
    >
      {index}
    </span>
  </div>
);

/* ─── Classic: 오늘의집 톤 솔리드 카드 ─── */
const ClassicRecipe = ({
  imageUrl,
  title,
  summary,
  boxPosition,
  index,
}: RecipeCardProps) => (
  <>
    <img src={imageUrl} alt="" crossOrigin="anonymous" style={imgFull} />
    <div
      style={{
        ...abs,
        [boxPosition === "top" ? "top" : "bottom"]: 0,
        height: "48%",
        background:
          boxPosition === "top"
            ? "linear-gradient(to bottom, rgba(0,0,0,0.32) 0%, transparent 100%)"
            : "linear-gradient(to top, rgba(0,0,0,0.32) 0%, transparent 100%)",
      }}
    />
    <div style={{ ...abs, [boxPosition === "top" ? "top" : "bottom"]: 0 }}>
      <div style={classicBox}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            marginBottom: 22,
          }}
        >
          <span style={classicBadge}>{index}</span>
          <p style={classicTitle}>{title}</p>
        </div>
        <div style={classicDivider} />
        <p style={classicSummary}>{summary}</p>
      </div>
    </div>
  </>
);

/* ─── Glass: 캡처-안전 글래스모피즘 (사진 사본 blur + sheen) ─── */
const GlassRecipe = ({
  imageUrl,
  title,
  summary,
  boxPosition,
  index,
}: RecipeCardProps) => {
  const M = 44;
  const anchor = boxPosition === "top" ? "top" : "bottom";
  return (
    <>
      <img src={imageUrl} alt="" crossOrigin="anonymous" style={imgFull} />
      <div
        style={{
          ...abs,
          [anchor]: 0,
          height: "50%",
          background:
            anchor === "top"
              ? "linear-gradient(to bottom, rgba(0,0,0,0.22) 0%, transparent 100%)"
              : "linear-gradient(to top, rgba(0,0,0,0.22) 0%, transparent 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: M,
          right: M,
          [anchor]: M,
          borderRadius: 36,
          overflow: "hidden",
          border: "1.5px solid rgba(255,255,255,0.45)",
          boxShadow: "0 20px 50px rgba(0,0,0,0.35)",
        }}
      >
        {/* 뒤 사진의 blur 사본 — backdrop-filter 대체 (html-to-image 캡처 가능) */}
        <img
          src={imageUrl}
          alt=""
          crossOrigin="anonymous"
          aria-hidden
          style={{
            position: "absolute",
            width: CARD + 80,
            height: CARD + 80,
            objectFit: "cover",
            left: -M - 40,
            [anchor]: -M - 40,
            filter: "blur(30px)",
          }}
        />
        {/* 유리 sheen + 살짝 어두운 tint */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.34) 0%, rgba(255,255,255,0.1) 45%, rgba(255,255,255,0.04) 100%), rgba(20,18,15,0.28)",
          }}
        />
        <div
          style={{ position: "relative", zIndex: 1, padding: "38px 46px 44px" }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 18,
              marginBottom: 22,
            }}
          >
            <span style={glassBadge}>{index}</span>
            <p style={glassTitle}>{title}</p>
          </div>
          <p style={glassSummary}>{summary}</p>
        </div>
      </div>
    </>
  );
};

/* ─── Bold: 노란 하이라이트 제목 + 원형 뱃지 ─── */
const BoldRecipe = ({
  imageUrl,
  title,
  summary,
  boxPosition,
  index,
}: RecipeCardProps) => (
  <>
    <img src={imageUrl} alt="" crossOrigin="anonymous" style={imgFull} />
    <div
      style={{
        ...abs,
        [boxPosition === "top" ? "top" : "bottom"]: 0,
        height: "45%",
        background:
          boxPosition === "top"
            ? "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 100%)"
            : "linear-gradient(to top, rgba(0,0,0,0.3) 0%, transparent 100%)",
      }}
    />
    <div style={{ ...abs, [boxPosition === "top" ? "top" : "bottom"]: 0 }}>
      <div style={{ ...whiteBox }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 16,
          }}
        >
          <CircleBadge index={index} bg="#58C16A" color="#fff" />
          <span
            style={{
              ...titleStyle,
              color: "#111",
              backgroundColor: "#F2C94C",
              padding: "2px 14px",
              borderRadius: 6,
              display: "inline",
            }}
          >
            {title}
          </span>
        </div>
        <p style={{ ...summaryStyle, color: "#4a4a4a" }}>{summary}</p>
      </div>
    </div>
  </>
);

/* ─── Frame: 흰 프레임 + 하단 텍스트 ─── */
const FrameRecipe = ({ imageUrl, title, summary, index }: RecipeCardProps) => {
  const border = 48;
  const textH = 340;
  return (
    <>
      <div style={{ ...abs, inset: 0, backgroundColor: "#fff" }} />
      <img
        src={imageUrl}
        alt=""
        crossOrigin="anonymous"
        style={{
          position: "absolute",
          top: border,
          left: border,
          width: CARD - border * 2,
          height: CARD - border - textH,
          objectFit: "cover",
          borderRadius: 12,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: textH,
          padding: `20px ${border + 8}px ${border}px`,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 14,
          }}
        >
          <SquareBadge index={index} bg="#58C16A" color="#fff" />
          <p style={{ ...titleStyle, color: "#1a1a1a" }}>{title}</p>
        </div>
        <p style={{ ...summaryStyle, color: "#555", fontSize: 26 }}>
          {summary}
        </p>
      </div>
    </>
  );
};

/* ─── Split: 상단 사진 + 하단 크림 영역 ─── */
const SplitRecipe = ({ imageUrl, title, summary, index }: RecipeCardProps) => {
  const splitAt = CARD * 0.5;
  return (
    <>
      <img
        src={imageUrl}
        alt=""
        crossOrigin="anonymous"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: CARD,
          height: splitAt,
          objectFit: "cover",
        }}
      />
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
      <div
        style={{
          position: "absolute",
          top: splitAt - 1,
          left: 50,
          right: 50,
          height: 3,
          backgroundColor: "#E8D5C0",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: splitAt,
          left: 0,
          right: 0,
          bottom: 0,
          padding: "32px 56px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 16,
          }}
        >
          <SquareBadge index={index} bg="#C4813A" color="#fff" />
          <p style={{ ...titleStyle, color: "#3E2712" }}>{title}</p>
        </div>
        <p style={{ ...summaryStyle, color: "#6B4C30" }}>{summary}</p>
      </div>
    </>
  );
};

/* ─── Dark: 어두운 박스 + 흰 텍스트 ─── */
const DarkRecipe = ({
  imageUrl,
  title,
  summary,
  boxPosition,
  index,
}: RecipeCardProps) => (
  <>
    <img src={imageUrl} alt="" crossOrigin="anonymous" style={imgFull} />
    <div
      style={{
        ...abs,
        [boxPosition === "top" ? "top" : "bottom"]: 0,
        height: "50%",
        background:
          boxPosition === "top"
            ? "linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, transparent 100%)"
            : "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 100%)",
      }}
    />
    <div style={{ ...abs, [boxPosition === "top" ? "top" : "bottom"]: 0 }}>
      <div
        style={{
          backgroundColor: "rgba(18,18,18,0.92)",
          borderRadius: 24,
          padding: "24px 40px 36px",
          margin: "32px 32px",
          boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 16,
          }}
        >
          <SquareBadge index={index} bg="#fff" color="#111" />
          <p style={{ ...titleStyle, color: "#fff" }}>{title}</p>
        </div>
        <p style={{ ...summaryStyle, color: "#b0b0b0" }}>{summary}</p>
      </div>
    </div>
  </>
);

const RECIPE_MAP: Record<CardTheme, React.FC<RecipeCardProps>> = {
  classic: ClassicRecipe,
  glass: GlassRecipe,
  bold: BoldRecipe,
  frame: FrameRecipe,
  split: SplitRecipe,
  dark: DarkRecipe,
};

export const RecipeCard = forwardRef<HTMLDivElement, RecipeCardProps>(
  (props, ref) => {
    const Renderer = RECIPE_MAP[props.theme ?? "classic"];
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
  }
);

RecipeCard.displayName = "RecipeCard";

/* ─── shared style helpers ─── */
const abs: React.CSSProperties = { position: "absolute", left: 0, right: 0 };
const imgFull: React.CSSProperties = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
  position: "absolute",
  top: 0,
  left: 0,
};
const whiteBox: React.CSSProperties = {
  backgroundColor: "rgba(255,255,255,0.95)",
  borderRadius: 24,
  padding: "24px 40px 36px",
  margin: "32px 32px",
  boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
};
/* ─── Classic 전용: 오늘의집 톤 ─── */
const classicBox: React.CSSProperties = {
  backgroundColor: "#FFFFFF",
  borderRadius: 32,
  padding: "38px 46px 44px",
  margin: "44px 44px",
  boxShadow: "0 18px 44px rgba(40,30,15,0.18)",
};
const classicBadge: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: 56,
  height: 56,
  borderRadius: 16,
  backgroundColor: "#526c04",
  color: "#fff",
  fontFamily: "Jalnan2, sans-serif",
  fontSize: 28,
  lineHeight: 1,
  flexShrink: 0,
};
const classicTitle: React.CSSProperties = {
  fontFamily: "Pretendard, sans-serif",
  fontSize: 40,
  fontWeight: 700,
  color: "#2A2622",
  margin: 0,
  lineHeight: 1.25,
  letterSpacing: "-0.02em",
};
const classicDivider: React.CSSProperties = {
  height: 1,
  backgroundColor: "#EFEAE2",
  margin: "0 0 24px",
};
const classicSummary: React.CSSProperties = {
  fontFamily: "Pretendard, sans-serif",
  fontSize: 29,
  fontWeight: 400,
  color: "#5C554E",
  margin: 0,
  lineHeight: 1.7,
  letterSpacing: "-0.01em",
  whiteSpace: "pre-line",
};
/* ─── Glass 전용 ─── */
const glassBadge: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: 56,
  height: 56,
  borderRadius: 16,
  backgroundColor: "rgba(255,255,255,0.18)",
  border: "1.5px solid rgba(255,255,255,0.55)",
  color: "#fff",
  fontFamily: "Jalnan2, sans-serif",
  fontSize: 28,
  lineHeight: 1,
  flexShrink: 0,
};
const glassTitle: React.CSSProperties = {
  fontFamily: "Pretendard, sans-serif",
  fontSize: 40,
  fontWeight: 700,
  color: "#fff",
  margin: 0,
  lineHeight: 1.25,
  letterSpacing: "-0.02em",
  textShadow: "0 2px 10px rgba(0,0,0,0.35)",
};
const glassSummary: React.CSSProperties = {
  fontFamily: "Pretendard, sans-serif",
  fontSize: 29,
  fontWeight: 400,
  color: "rgba(255,255,255,0.9)",
  margin: 0,
  lineHeight: 1.7,
  letterSpacing: "-0.01em",
  whiteSpace: "pre-line",
  textShadow: "0 1px 6px rgba(0,0,0,0.3)",
};
const titleStyle: React.CSSProperties = {
  fontFamily: "Pretendard, sans-serif",
  fontSize: 36,
  fontWeight: 700,
  margin: 0,
  lineHeight: 1.3,
};
const summaryStyle: React.CSSProperties = {
  fontFamily: "Pretendard, sans-serif",
  fontSize: 28,
  fontWeight: 400,
  margin: 0,
  lineHeight: 1.6,
  whiteSpace: "pre-line",
};
