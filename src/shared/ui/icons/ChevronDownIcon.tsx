type ChevronDownIconProps = {
  size?: number;
  className?: string;
};

const ChevronDownIcon = ({ size = 20, className }: ChevronDownIconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
);

export default ChevronDownIcon;
