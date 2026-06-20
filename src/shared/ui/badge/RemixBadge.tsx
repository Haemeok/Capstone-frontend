type RemixBadgeProps = {
  label: string;
};

const RemixBadge = ({ label }: RemixBadgeProps) => (
  <span className="rounded-full bg-black/60 px-2 py-0.5 text-xs font-semibold text-white">
    {label}
  </span>
);

export default RemixBadge;
