import type { RecordMaskShape } from "./recordPhoto.types";

const polygon = (sides: number) => {
  const points = Array.from({ length: sides }, (_, index) => {
    const angle = -Math.PI / 2 + (index * Math.PI * 2) / sides;
    return { x: 50 + Math.cos(angle) * 48, y: 50 + Math.sin(angle) * 48 };
  });
  return (
    points
      .map((point, index) => {
        const previous = points[(index + sides - 1) % sides];
        const next = points[(index + 1) % sides];
        const before = {
          x: point.x * 0.8 + previous.x * 0.2,
          y: point.y * 0.8 + previous.y * 0.2,
        };
        const after = {
          x: point.x * 0.8 + next.x * 0.2,
          y: point.y * 0.8 + next.y * 0.2,
        };
        return `${index === 0 ? "M" : "L"}${before.x},${before.y} Q${point.x},${point.y} ${after.x},${after.y}`;
      })
      .join(" ") + " Z"
  );
};
const wave = (lobes: number) =>
  Array.from({ length: 240 }, (_, index) => {
    const angle = (index / 240) * Math.PI * 2 - Math.PI / 2;
    const radius = 46 + 3 * Math.cos(lobes * angle);
    return `${index === 0 ? "M" : "L"}${50 + radius * Math.cos(angle)},${50 + radius * Math.sin(angle)}`;
  }).join(" ") + " Z";
export const RECORD_MASK_PATHS: Record<RecordMaskShape, string> = {
  CIRCLE: "M50,1 A49,49 0 1,1 50,99 A49,49 0 1,1 50,1 Z",
  ROUNDED_DIAMOND: polygon(4),
  ROUNDED_HEXAGON: polygon(6),
  ROUNDED_OCTAGON: polygon(8),
  WAVY_CIRCLE_5: wave(5),
  WAVY_CIRCLE_6: wave(6),
  WAVY_CIRCLE_8: wave(8),
  WAVY_CIRCLE_10: wave(10),
};
export const STICKER_MASK_PATH = "M0,0 H100 V100 H0 Z";
