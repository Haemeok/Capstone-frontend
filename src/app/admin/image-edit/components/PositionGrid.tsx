import { WATERMARK_POSITIONS, type WatermarkPosition } from "../lib/watermark";

const LABELS: Record<WatermarkPosition, string> = {
  "top-left": "좌상단",
  "top-center": "상단 중앙",
  "top-right": "우상단",
  "middle-left": "좌중앙",
  "middle-center": "정중앙",
  "middle-right": "우중앙",
  "bottom-left": "좌하단",
  "bottom-center": "하단 중앙",
  "bottom-right": "우하단",
};

type Props = {
  value: WatermarkPosition;
  onChange: (position: WatermarkPosition) => void;
};

export const PositionGrid = ({ value, onChange }: Props) => (
  <div className="grid grid-cols-3 gap-1.5">
    {WATERMARK_POSITIONS.map((position) => {
      const active = position === value;
      return (
        <button
          key={position}
          type="button"
          aria-label={LABELS[position]}
          aria-pressed={active}
          onClick={() => onChange(position)}
          className={`flex aspect-square cursor-pointer items-center justify-center rounded-lg border text-[10px] font-medium transition ${
            active
              ? "border-olive-light bg-olive-light text-white"
              : "border-gray-200 bg-white text-gray-400 hover:bg-gray-50"
          }`}
        >
          {LABELS[position]}
        </button>
      );
    })}
  </div>
);
