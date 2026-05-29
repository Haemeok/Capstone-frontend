import { forwardRef } from "react";

import { gridCellPosition } from "../lib/gridLayout";
import { MAX_CAPTION, truncate, type TipItem } from "../lib/schema";

type GridTipCardProps = {
  header: string;
  imageUrl: string;
  items: TipItem[];
};

const WIDTH = 1080;

export const GridTipCard = forwardRef<HTMLDivElement, GridTipCardProps>(
  ({ header, imageUrl, items }, ref) => (
    <div
      ref={ref}
      style={{
        width: WIDTH,
        background: "#FAF7F0",
        display: "flex",
        flexDirection: "column",
        fontFamily: "Pretendard, sans-serif",
      }}
    >
      <header
        style={{
          padding: "40px 48px 28px",
          fontFamily: "Jalnan2, sans-serif",
          fontSize: 52,
          lineHeight: 1.25,
          color: "#3A2E22",
          textAlign: "center",
        }}
      >
        {header}
      </header>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 16,
          padding: "0 32px",
        }}
      >
        {items.slice(0, 9).map((item, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              flexDirection: "column",
              background: "#fff",
              borderRadius: 20,
              overflow: "hidden",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            }}
          >
            <div
              style={{
                width: "100%",
                aspectRatio: "1 / 1",
                backgroundImage: `url(${imageUrl})`,
                backgroundSize: "300% 300%",
                backgroundPosition: gridCellPosition(i),
                backgroundRepeat: "no-repeat",
              }}
            />
            <div style={{ padding: "12px 14px 16px", textAlign: "center" }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: "#3A2E22", marginBottom: 4 }}>
                {item.dishName}
              </div>
              <div
                style={{
                  fontSize: 19,
                  lineHeight: 1.35,
                  color: "#6B5B49",
                  display: "-webkit-box",
                  WebkitBoxOrient: "vertical",
                  WebkitLineClamp: 2,
                  overflow: "hidden",
                }}
              >
                {truncate(item.caption, MAX_CAPTION)}
              </div>
            </div>
          </div>
        ))}
      </div>

      <footer
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "32px 48px 40px",
        }}
      >
        <div style={{ flex: 1 }} />
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/favicon-96x96.png" alt="" style={{ width: 40, height: 40, borderRadius: "50%" }} />
          <span style={{ fontFamily: "Jalnan2, sans-serif", fontSize: 30, color: "#3A2E22" }}>레시피오</span>
        </div>
        <div
          style={{
            flex: 1,
            textAlign: "right",
            fontSize: 22,
            color: "#8A7860",
          }}
        >
          캡처해두고 사용하세요!
        </div>
      </footer>
    </div>
  ),
);

GridTipCard.displayName = "GridTipCard";
