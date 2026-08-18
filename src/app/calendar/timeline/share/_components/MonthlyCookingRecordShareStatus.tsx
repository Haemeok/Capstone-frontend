type MonthlyCookingRecordShareStatusProps = {
  title?: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
};

export const MonthlyCookingRecordShareStatus = ({
  title,
  description,
  actionLabel,
  onAction,
}: MonthlyCookingRecordShareStatusProps) => (
  <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
    {title ? (
      <h2 className="text-ink text-lg font-bold tracking-[-0.02em]">{title}</h2>
    ) : null}
    <p className="text-ink-muted mt-2 text-sm leading-6">{description}</p>
    {actionLabel && onAction ? (
      <button
        type="button"
        onClick={onAction}
        className="bg-ink focus-visible:outline-ink mt-5 min-h-11 rounded-xl px-5 text-sm font-bold text-white focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        {actionLabel}
      </button>
    ) : null}
  </div>
);
