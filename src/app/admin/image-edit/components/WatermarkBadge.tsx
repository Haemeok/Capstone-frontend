import "./watermark-fonts.css";

type Props = { logoPx: number; opacity: number };

/** favicon 로고 + "레시피오" 워드마크. 크기는 logoPx 기준 파생, 반투명 다크 pill 백킹으로 가독성 확보 */
export const WatermarkBadge = ({ logoPx, opacity }: Props) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: logoPx * 0.33,
      padding: `${logoPx * 0.4}px ${logoPx * 0.62}px`,
      borderRadius: logoPx * 2,
      backgroundColor: "rgba(0, 0, 0, 0.42)",
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
