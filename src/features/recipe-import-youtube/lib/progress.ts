type ProgressPoint = { time: number; progress: number };

const PROGRESS_CURVE: ProgressPoint[] = [
  { time: 0, progress: 0 },
  { time: 60, progress: 50 }, // 0~60초: 0→50%
  { time: 120, progress: 75 }, // 60~120초: 50→75%
  { time: 150, progress: 90 }, // 120~150초: 75→90%
  { time: 180, progress: 95 }, // 150~180초: 90→95%
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
