export const NotTranslatedBanner = ({ message }: { message: string }) => (
  <div
    role="status"
    className="rounded-card bg-beige text-ink-sub mb-3 px-4 py-3 text-sm"
  >
    {message}
  </div>
);
