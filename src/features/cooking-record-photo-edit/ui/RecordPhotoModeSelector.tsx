import type { RecordPhotoCopy } from "@/shared/i18n/recordPhotoMessages";
import { triggerHaptic } from "@/shared/lib/bridge";

type Props = {
  mode: "dish" | "sticker";
  onChange: (mode: "dish" | "sticker") => void;
  disabled?: boolean;
  copy: RecordPhotoCopy;
};

export const RecordPhotoModeSelector = ({
  mode,
  onChange,
  disabled,
  copy,
}: Props) => (
  <div
    role="group"
    aria-label={copy.style}
    className="flex gap-6 border-b border-gray-100"
  >
    {(["dish", "sticker"] as const).map((item) => (
      <button
        key={item}
        type="button"
        disabled={disabled}
        aria-pressed={mode === item}
        className="text-ink-muted aria-pressed:text-ink aria-pressed:after:bg-ink relative min-h-11 cursor-pointer text-sm font-medium after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 aria-pressed:font-semibold"
        onClick={() => {
          if (mode === item) return;
          triggerHaptic("Light");
          onChange(item);
        }}
      >
        {item === "dish" ? copy.dishMode : copy.stickerMode}
      </button>
    ))}
  </div>
);
