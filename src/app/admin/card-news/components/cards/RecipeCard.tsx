import { forwardRef } from "react";

import "./card-fonts.css";

type RecipeCardProps = {
  imageUrl: string;
  title: string;
  summary: string;
  boxPosition: "top" | "bottom";
};

export const RecipeCard = forwardRef<HTMLDivElement, RecipeCardProps>(
  ({ imageUrl, title, summary, boxPosition }, ref) => {
    const infoBox = (
      <div
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          borderRadius: 24,
          padding: "36px 40px",
          margin: "32px 32px",
          boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
        }}
      >
        <p
          style={{
            fontFamily: "Pretendard, sans-serif",
            fontSize: 36,
            fontWeight: 700,
            color: "#1a1a1a",
            margin: "0 0 16px",
            lineHeight: 1.3,
          }}
        >
          {title}
        </p>
        <p
          style={{
            fontFamily: "Pretendard, sans-serif",
            fontSize: 28,
            fontWeight: 400,
            color: "#4a4a4a",
            margin: 0,
            lineHeight: 1.6,
            whiteSpace: "pre-line",
          }}
        >
          {summary}
        </p>
      </div>
    );

    return (
      <div
        ref={ref}
        style={{
          width: 1080,
          height: 1350,
          position: "relative",
          overflow: "hidden",
          backgroundColor: "#000",
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
            position: "absolute",
            top: 0,
            left: 0,
          }}
        />
        <div
          style={{
            position: "absolute",
            [boxPosition === "top" ? "top" : "bottom"]: 0,
            left: 0,
            right: 0,
            height: "45%",
            background:
              boxPosition === "top"
                ? "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 100%)"
                : "linear-gradient(to top, rgba(0,0,0,0.3) 0%, transparent 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            [boxPosition === "top" ? "top" : "bottom"]: 0,
            left: 0,
            right: 0,
          }}
        >
          {infoBox}
        </div>
      </div>
    );
  }
);

RecipeCard.displayName = "RecipeCard";
