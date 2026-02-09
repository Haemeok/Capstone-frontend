type ProgressPoint = { time: number; progress: number };

// AI 레시피 생성은 2~3분 소요
const PROGRESS_CURVE: ProgressPoint[] = [
  { time: 0, progress: 0 },
  { time: 30, progress: 20 }, // 0~30초: 0→20%
  { time: 60, progress: 40 }, // 30~60초: 20→40%
  { time: 120, progress: 70 }, // 60~120초: 40→70%
  { time: 150, progress: 85 }, // 120~150초: 70→85%
  { time: 180, progress: 95 }, // 150~180초: 85→95%
];

export const calculateFakeProgress = (startTime: number): number => {
  const elapsedSeconds = (Date.now() - startTime) / 1000;

  const lastPoint = PROGRESS_CURVE[PROGRESS_CURVE.length - 1];
  if (elapsedSeconds >= lastPoint.time) return lastPoint.progress;

  for (let i = 1; i < PROGRESS_CURVE.length; i++) {
    const prev = PROGRESS_CURVE[i - 1];
    const curr = PROGRESS_CURVE[i];

    if (elapsedSeconds <= curr.time) {
      const ratio = (elapsedSeconds - prev.time) / (curr.time - prev.time);
      return Math.round(prev.progress + ratio * (curr.progress - prev.progress));
    }
  }

  return 0;
};
