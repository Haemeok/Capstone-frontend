type ProgressPoint = { time: number; progress: number };

const MAX_FAKE_PROGRESS = 95;

const PROGRESS_CURVE: ProgressPoint[] = [
  { time: 0, progress: 0 },
  { time: 5, progress: 10 }, // 0~5초: 즉각 피드백
  { time: 15, progress: 25 }, // 5~15초: 초반 빠른 상승
  { time: 40, progress: 45 }, // 15~40초: 첫 폴링 응답 전까지 상승
  { time: 90, progress: 65 }, // 40~90초: 서버 인계 구간
  { time: 150, progress: 85 }, // 90~150초: 완만한 상승
  { time: 210, progress: 95 }, // 150~210초: 긴 꼬리
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
      const interpolated = Math.round(
        prev.progress + ratio * (curr.progress - prev.progress)
      );
      return Math.min(interpolated, MAX_FAKE_PROGRESS);
    }
  }

  return 0;
};
