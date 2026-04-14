import { forwardRef } from "react";

import "./card-fonts.css";

type ThumbnailCardProps = {
  imageUrl: string;
  hooking: string;
  subject: string;
};

export const ThumbnailCard = forwardRef<HTMLDivElement, ThumbnailCardProps>(
  ({ imageUrl, hooking, subject }, ref) => {
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
        {/* 배경 이미지 */}
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

        {/* 하단 그라데이션 */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "60%",
            background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 100%)",
          }}
        />

        {/* 텍스트 영역 */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            padding: "0 60px 120px",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          <p
            style={{
              fontFamily: "Jalnan2, sans-serif",
              fontSize: 64,
              color: "#fff",
              lineHeight: 1.3,
              textShadow: "0 2px 12px rgba(0,0,0,0.5)",
              margin: 0,
              wordBreak: "keep-all",
            }}
          >
            {hooking}
          </p>
          <p
            style={{
              fontFamily: "Jalnan2, sans-serif",
              fontSize: 52,
              color: "#fff",
              lineHeight: 1.3,
              textShadow: "0 2px 12px rgba(0,0,0,0.5)",
              margin: "16px 0 0",
              opacity: 0.95,
              wordBreak: "keep-all",
            }}
          >
            {subject}
          </p>
        </div>

        {/* 브랜드 로고 */}
        <div
          style={{
            position: "absolute",
            bottom: 40,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              backgroundColor: "#58C16A",
            }}
          />
          <span
            style={{
              fontFamily: "Jalnan2, sans-serif",
              fontSize: 28,
              color: "#fff",
              textShadow: "0 1px 4px rgba(0,0,0,0.4)",
            }}
          >
            레시피오
          </span>
        </div>
      </div>
    );
  }
);

ThumbnailCard.displayName = "ThumbnailCard";
