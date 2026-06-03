import { forwardRef } from "react";

import "./card-fonts.css";

type OutroVariant = "instagram" | "youtube";

type OutroCardProps = {
  imageUrl: string;
  variant?: OutroVariant;
};

const CARD = 1080;

const HEADLINES: Record<OutroVariant, React.ReactNode> = {
  instagram: (
    <>
      📢 <span style={{ color: "#91c788" }}>레시피오</span> 인스타 팔로우하고
      <br />
      매일 최신 <span style={{ color: "#91c788" }}>요리 팁</span> 받아보세요
    </>
  ),
  youtube: (
    <>
      📢 <span style={{ color: "#91c788" }}>럭키맨</span> 유튜브 구독하고
      <br />
      매일 최신 <span style={{ color: "#91c788" }}>요리 팁</span> 받아보세요
    </>
  ),
};

const APPLE_PATH =
  "M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C73.6 141.6 24 184.5 24 273.5c0 26.3 4.8 53.5 14.4 81.5 12.8 36.9 59 127.4 107.2 125.9 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-83 102.6-120-65.2-30.7-61.7-90-61.7-91.6zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z";

const PLAY_PATH =
  "M22.018 13.298l-3.919 2.218-3.515-3.493 3.543-3.521 3.891 2.202a1.49 1.49 0 0 1 0 2.594zM1.337.924a1.486 1.486 0 0 0-.112.568v21.017c0 .217.045.419.124.6l11.155-11.087L1.337.924zm12.207 10.065l3.258-3.238L3.45.195a1.466 1.466 0 0 0-.946-.179l11.04 10.973zm0 2.067l-11 10.933c.298.036.612-.016.906-.183l13.324-7.54-3.23-3.21z";

const badgeStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 16,
  background: "#fff",
  borderRadius: 18,
  padding: "16px 30px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
};

const badgeSub: React.CSSProperties = {
  fontFamily: "Pretendard, sans-serif",
  fontSize: 17,
  color: "#666",
  lineHeight: 1,
  letterSpacing: "0.02em",
};

const badgeMain: React.CSSProperties = {
  fontFamily: "Pretendard, sans-serif",
  fontSize: 30,
  fontWeight: 700,
  color: "#111",
  lineHeight: 1.1,
  marginTop: 5,
};

export const OutroCard = forwardRef<HTMLDivElement, OutroCardProps>(
  ({ imageUrl, variant = "instagram" }, ref) => (
    <div
      ref={ref}
      style={{
        position: "relative",
        width: CARD,
        height: CARD,
        overflow: "hidden",
        fontFamily: "Pretendard, sans-serif",
        background: "#1B1712",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(3px)",
          transform: "scale(1.08)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(15,12,9,0.86) 0%, rgba(15,12,9,0.78) 45%, rgba(15,12,9,0.9) 100%)",
        }}
      />

      <div
        style={{
          position: "relative",
          height: "100%",
        }}
      >
        <header
          style={{
            position: "absolute",
            top: 184,
            left: 72,
            right: 72,
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontFamily: "Jalnan2, sans-serif",
              fontSize: 50,
              lineHeight: 1.32,
              color: "#FFFFFF",
            }}
          >
            {HEADLINES[variant]}
          </div>
        </header>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/web-app-manifest-512x512.png"
          alt="레시피오"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 200,
            height: 200,
            borderRadius: "50%",
            boxShadow: "0 18px 40px rgba(0,0,0,0.45)",
          }}
        />

        <div
          style={{
            position: "absolute",
            top: "calc(50% + 174px)",
            left: 72,
            right: 72,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 52,
          }}
        >
          <div
            style={{
              fontFamily: "Jalnan2, sans-serif",
              fontSize: 46,
              lineHeight: 1.32,
              color: "#FFFFFF",
              textAlign: "center",
            }}
          >
            <span style={{ color: "#91c788" }}>레시피오</span> 앱도 있어요{" "}
            <span style={{ color: "#E8736A" }}>♥</span>
          </div>

          <div style={{ display: "flex", gap: 24 }}>
            <div style={badgeStyle}>
              <svg width={42} height={50} viewBox="0 0 384 512" aria-hidden>
                <path fill="#111" d={APPLE_PATH} />
              </svg>
              <div>
                <div style={badgeSub}>Download on the</div>
                <div style={badgeMain}>App Store</div>
              </div>
            </div>

            <div style={badgeStyle}>
              <svg width={44} height={44} viewBox="0 0 24 24" aria-hidden>
                <path fill="#34A853" d={PLAY_PATH} />
              </svg>
              <div>
                <div style={badgeSub}>GET IT ON</div>
                <div style={badgeMain}>Google Play</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
);

OutroCard.displayName = "OutroCard";
