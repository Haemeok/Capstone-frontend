import "./watermark-fonts.css";

type Props = { logoPx: number; opacity: number };

/** favicon 로고 + "레시피오" 워드마크. 크기는 logoPx 기준 파생, 흰색+그림자 고정 */
export const WatermarkBadge = ({ logoPx, opacity }: Props) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: logoPx * 0.33,
      opacity,
    }}
  >
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img
      src="/favicon-96x96.png"
      alt=""
      crossOrigin="anonymous"
      style={{ width: logoPx, height: logoPx, borderRadius: "50%" }}
    />
    <span
      style={{
        fontFamily: "Jalnan2, sans-serif",
        fontSize: logoPx * 0.78,
        lineHeight: 1,
        color: "#fff",
        textShadow: "0 1px 4px rgba(0,0,0,0.5)",
        whiteSpace: "nowrap",
      }}
    >
      레시피오
    </span>
  </div>
);
