import { useT } from "@/shared/i18n";

type UsageLimitBannerProps = {
  message?: string;
  subMessage?: string;
};

const UsageLimitBanner = ({ message, subMessage }: UsageLimitBannerProps) => {
  const t = useT();
  const displayMessage = message ?? t.aiRecipe.form.usageLimitBanner.message;
  const displaySubMessage =
    subMessage ?? t.aiRecipe.form.usageLimitBanner.subMessage;
  return (
    <div className="bg-brown/80 mx-auto w-[95%] rounded-t-2xl px-4 py-3 shadow-sm">
      <p className="text-beige text-sm text-pretty break-keep">
        {displayMessage}
      </p>
      <p className="text-beige text-sm text-pretty break-keep">
        {displaySubMessage}
      </p>
    </div>
  );
};

export default UsageLimitBanner;
