type ProgressBarProps = {
  current: number;
  total: number;
};

const ProgressBar = ({ current, total }: ProgressBarProps) => {
  return (
    <div className="flex gap-2">
      {Array.from({ length: total }).map((_, index) => (
        <div
          key={index}
          className={`h-1 flex-1 rounded-full transition-colors ${
            index < current ? "bg-olive-mint" : "bg-gray-300"
          }`}
        />
      ))}
    </div>
  );
};

export default ProgressBar;
