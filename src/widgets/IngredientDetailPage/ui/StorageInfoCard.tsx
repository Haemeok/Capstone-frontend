import {
  Calendar,
  type LucideIcon,
  MapPin,
  StickyNote,
  Thermometer,
} from "lucide-react";

import { getDictionary, type Locale } from "@/shared/i18n";

import type { IngredientStorageView } from "@/entities/ingredient";

type StorageInfoCardProps = {
  storage: IngredientStorageView;
  locale?: Locale;
};

type StorageStatProps = {
  Icon: LucideIcon;
  label: string;
  value: string;
};

const StorageStat = ({ Icon, label, value }: StorageStatProps) => (
  <div className="flex flex-1 flex-col gap-1 rounded-xl bg-gray-50 p-4">
    <span className="text-ink-muted flex items-center gap-1.5 text-xs">
      <Icon size={13} className="text-gray-400" />
      <span>{label}</span>
    </span>
    <span className="text-ink text-base leading-snug font-bold">{value}</span>
  </div>
);

const StorageInfoCard = ({ storage, locale = "ko" }: StorageInfoCardProps) => {
  const t = getDictionary(locale).ingredientDetail;
  const stats: StorageStatProps[] = [];

  if (storage.location) {
    stats.push({
      Icon: MapPin,
      label: t.storageLocation,
      value: storage.location,
    });
  }
  if (storage.temperature) {
    stats.push({
      Icon: Thermometer,
      label: t.storageTemperature,
      value: storage.temperature,
    });
  }
  if (storage.duration) {
    stats.push({
      Icon: Calendar,
      label: t.storageDuration,
      value: storage.duration,
    });
  }

  const hasStats = stats.length > 0;
  const hasNotes = Boolean(storage.notes);

  if (!hasStats && !hasNotes) {
    return null;
  }

  return (
    <section className="border-t border-gray-100 px-5 py-6">
      <h2 className="text-ink mb-3 text-lg font-bold">{t.storageHeader}</h2>

      {hasStats && (
        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat) => (
            <StorageStat key={stat.label} {...stat} />
          ))}
        </div>
      )}

      {hasNotes && (
        <div
          className={`text-ink-sub rounded-xl bg-gray-50 p-4 text-sm leading-relaxed ${
            hasStats ? "mt-3" : ""
          }`}
        >
          <span className="text-ink-muted mb-1 flex items-center gap-1.5 text-xs">
            <StickyNote size={13} className="text-gray-400" />
            <span>{t.storageNotes}</span>
          </span>
          <p>{storage.notes}</p>
        </div>
      )}
    </section>
  );
};

export default StorageInfoCard;
