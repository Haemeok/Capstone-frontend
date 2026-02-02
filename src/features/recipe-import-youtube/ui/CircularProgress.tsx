"use client";

import { useId } from "react";

type CircularProgressProps = {
  value: number;
  size?: number;
  strokeWidth?: number;
};

export const CircularProgress = ({
  value,
  size = 80,
  strokeWidth = 6,
}: CircularProgressProps) => {
  const gradientId = useId();
  const glowId = useId();

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  // 진행률 끝점의 각도 계산 (SVG가 -90도 회전되어 있으므로 보정 불필요)
  const progressAngle = (value / 100) * 2 * Math.PI;
  const dotX = size / 2 + radius * Math.cos(progressAngle);
  const dotY = size / 2 + radius * Math.sin(progressAngle);

  return (
    <svg
      width={size}
      height={size}
      className="-rotate-90"
      aria-label={`${value}% 완료`}
    >
      <defs>
        {/* Gradient for progress stroke - 밝은 색상 */}
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#bef264" />
          <stop offset="100%" stopColor="#86efac" />
        </linearGradient>

        {/* Glow filter */}
        <filter id={glowId} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Background track */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="rgba(255,255,255,0.15)"
        strokeWidth={strokeWidth}
      />

      {/* Progress arc with gradient and glow */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={`url(#${gradientId})`}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        filter={`url(#${glowId})`}
        className="transition-all duration-700 ease-out"
      />

      {/* Rotating dot at progress end */}
      {value > 0 && value < 100 && (
        <circle
          cx={dotX}
          cy={dotY}
          r={strokeWidth / 2 + 2}
          fill="white"
          filter={`url(#${glowId})`}
          className="animate-pulse"
        />
      )}
    </svg>
  );
};
