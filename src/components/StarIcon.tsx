import React from "react";

type StarIconProps = {
  filled: boolean;
  halfFilled: boolean;
  hovered: boolean;
  onClick?: (event: React.MouseEvent<SVGSVGElement>) => void;
  onMouseEnter?: (event: React.MouseEvent<SVGSVGElement>) => void;
  onMouseLeave?: (event: React.MouseEvent<SVGSVGElement>) => void;
};

const StarIcon = ({
  filled,
  halfFilled,
  hovered,
  onClick,
  onMouseEnter,
  onMouseLeave,
}: StarIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 36 36"
      stroke="gold"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`cursor-pointer w-9 h-9 transition-all duration-300 hover:scale-110`}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <polygon
        points="18 3 22.6 12.4 33 13.9 25.5 21.2 27.3 31.5 18 26.7 8.7 31.5 10.5 21.2 3 13.9 13.4 12.4 18 3"
        fill="none"
      />

      <polygon
        points="18 3 22.6 12.4 33 13.9 25.5 21.2 27.3 31.5 18 26.7 8.7 31.5 10.5 21.2 3 13.9 13.4 12.4 18 3"
        fill="gold"
        style={{
          opacity: filled ? 1 : 0,
          transition: "opacity 0.4s ease",
        }}
      />

      {halfFilled && (
        <polygon
          points="18 3 22.6 12.4 33 13.9 25.5 21.2 27.3 31.5 18 26.7 8.7 31.5 10.5 21.2 3 13.9 13.4 12.4 18 3"
          fill="url(#halfFill)"
          style={{
            opacity: halfFilled ? 1 : 0,
            transition: "opacity 0.4s ease",
          }}
        />
      )}

      <defs>
        <linearGradient id="halfFill" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="50%" stopColor="gold" />
          <stop offset="50%" stopColor="transparent" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default StarIcon;
