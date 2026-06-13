import { forwardRef } from "react";

import "./card-fonts.css";

type RecipeCardProps = {
  imageUrl: string;
  title: string;
  summary: string;
  boxPosition: "top" | "bottom";
  index: number;
};

const CARD = 1080;

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

export const RecipeCard = forwardRef<HTMLDivElement, RecipeCardProps>(
  (props, ref) => (
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
      <GlassRecipe {...props} />
    </div>
  )
);

RecipeCard.displayName = "RecipeCard";

const abs: React.CSSProperties = { position: "absolute", left: 0, right: 0 };
const imgFull: React.CSSProperties = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
  position: "absolute",
  top: 0,
  left: 0,
};
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
