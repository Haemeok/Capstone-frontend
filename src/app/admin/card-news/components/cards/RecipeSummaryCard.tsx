import { forwardRef } from "react";
import { QRCodeSVG } from "qrcode.react";

type RecipeSummaryCardProps = {
  recipeId: number;
  imageUrl: string;
  title: string;
  description: string;
  tags: string[];
  ingredients: string[];
};

export const RecipeSummaryCard = forwardRef<
  HTMLDivElement,
  RecipeSummaryCardProps
>(({ recipeId, imageUrl, title, description, tags, ingredients }, ref) => {
  const formatDateTime = () => {
    const now = new Date();
    const date = `${String(now.getMonth() + 1).padStart(2, "0")}/${String(now.getDate()).padStart(2, "0")} ${now.getFullYear()}`;
    const time = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    return `${date} ${time}`;
  };

  return (
    <div
      ref={ref}
      style={{
        width: 1080,
        height: 1080,
        backgroundColor: "#F4F1EA",
        padding: "50px 70px 50px",
        display: "flex",
        flexDirection: "column",
        fontFamily: "Alegreya, serif",
        position: "relative",
        overflow: "hidden",
        boxSizing: "border-box",
      }}
    >
      {/* ORDER TICKET 헤더 — ShareCard L37-44 */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontFamily: "Alegreya, monospace",
          fontSize: 32,
          fontWeight: 500,
          letterSpacing: "0.05em",
          color: "#1f2937",
          marginBottom: 40,
        }}
      >
        <span>ORDER TICKET</span>
        <span>No. {String(recipeId).padStart(3, "0")}</span>
      </div>

      {/* RECIPIO 로고 — ShareCard L46-53, Fine Dining 제거 */}
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <div
          style={{
            fontFamily: "Alegreya, serif",
            fontSize: 130,
            letterSpacing: "-0.025em",
            color: "#111827",
            lineHeight: 1,
          }}
        >
          RECIPIO
        </div>

        {/* 제목 + 설명 — ShareCard L60-73 */}
        <div style={{ marginTop: 16 }}>
          <h2
            style={{
              fontFamily: "Noto Serif KR, serif",
              fontSize: 52,
              fontWeight: 700,
              color: "#111827",
              letterSpacing: "0.05em",
              lineHeight: 1.3,
              margin: 0,
              padding: "0 40px",
            }}
          >
            {title}
          </h2>
          <p
            style={{
              fontFamily: "Alegreya, serif",
              fontSize: 36,
              fontWeight: 500,
              color: "#374151",
              margin: "8px 0 0",
              lineHeight: 1.4,
            }}
          >
            {description}
          </p>
        </div>
      </div>

      {/* 날짜 — ShareCard L76-83 */}
      <div
        style={{
          borderTop: "1px solid #1f2937",
          paddingTop: 16,
          textAlign: "center",
          marginBottom: 20,
        }}
      >
        <span
          style={{
            fontFamily: "Alegreya, serif",
            fontWeight: 500,
            letterSpacing: "0.05em",
            color: "#1f2937",
            fontSize: 30,
          }}
        >
          DATE: {formatDateTime()}
        </span>
      </div>

      {/* 팔각형 이미지 — ShareCard L85-127 */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: 20,
        }}
      >
        <div style={{ position: "relative", padding: 3 }}>
          {/* 외곽 테두리 */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              border: "1px solid #9ca3af",
              margin: "-11px",
              borderRadius: 4,
              clipPath:
                "polygon(0 33px, 33px 0, calc(100% - 33px) 0, 100% 33px, 100% calc(100% - 33px), calc(100% - 33px) 100%, 33px 100%, 0 calc(100% - 33px))",
              pointerEvents: "none",
            }}
          />
          {/* 내곽 테두리 */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              border: "1px solid #1f2937",
              clipPath:
                "polygon(0 28px, 28px 0, calc(100% - 28px) 0, 100% 28px, 100% calc(100% - 28px), calc(100% - 28px) 100%, 28px 100%, 0 calc(100% - 28px))",
              pointerEvents: "none",
            }}
          />
          {/* 이미지 */}
          <div
            style={{
              width: 440,
              height: 440,
              overflow: "hidden",
              clipPath:
                "polygon(0 28px, 28px 0, calc(100% - 28px) 0, 100% 28px, 100% calc(100% - 28px), calc(100% - 28px) 100%, 28px 100%, 0 calc(100% - 28px))",
            }}
          >
            <img
              src={imageUrl}
              alt={title}
              crossOrigin="anonymous"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                filter: "contrast(1.05) sepia(0.1)",
              }}
            />
          </div>
        </div>
      </div>

      {/* 태그 — ShareCard L129-135 */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 50,
          fontFamily: "Alegreya, serif",
          fontWeight: 500,
          fontSize: 32,
          marginBottom: 16,
        }}
      >
        {tags.slice(0, 2).map((tag, i) => (
          <span key={i}>{`#${tag}`}</span>
        ))}
      </div>

      {/* 구분선 */}
      <div style={{ borderTop: "1px solid #1f2937", marginBottom: 16 }} />

      {/* 재료 목록 — ArchetypeResult L159-175 description 스타일 */}
      <div
        style={{
          padding: "0 16px",
          fontFamily: "Pretendard, sans-serif",
          marginBottom: 16,
        }}
      >
        {ingredients.map((item, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              alignItems: "flex-start",
              fontSize: 30,
              lineHeight: 1.6,
            }}
          >
            <span
              style={{
                width: 40,
                flexShrink: 0,
                fontWeight: 500,
              }}
            >
              {String(index + 1)}.
            </span>
            <span style={{ color: "#1f2937" }}>{item}</span>
          </div>
        ))}
      </div>

      {/* 구분선 */}
      <div style={{ borderTop: "1px solid #1f2937", marginBottom: 16 }} />

      {/* 푸터: RECIPIO + QR — ShareCard L216-233 */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 20px",
        }}
      >
        <div
          style={{
            fontFamily: "Alegreya, serif",
            fontSize: 80,
            color: "#111827",
          }}
        >
          RECIPIO
        </div>
        <QRCodeSVG
          value={`https://recipio.kr/recipe/${recipeId}`}
          size={120}
          level="L"
          fgColor="#1F2937"
          bgColor="transparent"
        />
      </div>
    </div>
  );
});

RecipeSummaryCard.displayName = "RecipeSummaryCard";
