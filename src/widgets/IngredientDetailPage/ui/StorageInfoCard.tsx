import type { IngredientStorageView } from "@/entities/ingredient";

type StorageInfoCardProps = {
  storage: IngredientStorageView;
};

type StorageStatProps = {
  emoji: string;
  label: string;
  value: string;
  borderClass: string;
  bgClass: string;
  valueColorClass: string;
};

type LocationTone = {
  borderClass: string;
  bgClass: string;
  valueColorClass: string;
};

const DEFAULT_TONE: LocationTone = {
  borderClass: "border-gray-200",
  bgClass: "bg-white",
  valueColorClass: "text-gray-900",
};

const getLocationTone = (location: string | null): LocationTone => {
  if (!location) return DEFAULT_TONE;
  const lower = location.toLowerCase();
  // 우선순위: 가장 한정적인 키워드 먼저
  if (lower.includes("냉동")) {
    return {
      borderClass: "border-sky-200",
      bgClass: "bg-sky-50",
      valueColorClass: "text-sky-700",
    };
  }
  if (lower.includes("냉장")) {
    return {
      borderClass: "border-blue-200",
      bgClass: "bg-blue-50",
      valueColorClass: "text-blue-700",
    };
  }
  if (lower.includes("실온") || lower.includes("상온")) {
    return {
      borderClass: "border-amber-200",
      bgClass: "bg-amber-50",
      valueColorClass: "text-amber-700",
    };
  }
  return DEFAULT_TONE;
};

const StorageStat = ({
  emoji,
  label,
  value,
  borderClass,
  bgClass,
  valueColorClass,
}: StorageStatProps) => (
  <div
    className={`flex-1 rounded-xl border ${borderClass} ${bgClass} p-4 flex flex-col gap-1`}
  >
    <span className="text-xs text-gray-500 flex items-center gap-1">
      <span>{emoji}</span>
      <span>{label}</span>
    </span>
    <span className={`text-base font-bold ${valueColorClass} leading-snug`}>
      {value}
    </span>
  </div>
);

const StorageInfoCard = ({ storage }: StorageInfoCardProps) => {
  const tone = getLocationTone(storage.location);

  const stats: StorageStatProps[] = [];

  if (storage.location) {
    stats.push({
      emoji: "📍",
      label: "위치",
      value: storage.location,
      ...tone,
    });
  }
  if (storage.temperature) {
    stats.push({
      emoji: "🌡️",
      label: "온도",
      value: storage.temperature,
      ...tone,
    });
  }
  if (storage.duration) {
    stats.push({
      emoji: "📅",
      label: "기간",
      value: storage.duration,
      ...tone,
    });
  }

  const hasStats = stats.length > 0;
  const hasNotes = Boolean(storage.notes);

  if (!hasStats && !hasNotes) {
    return null;
  }

  return (
    <section className="px-5 py-6 border-t border-gray-100">
      <h2 className="text-lg font-bold text-gray-800 mb-3">보관방법</h2>

      {hasStats && (
        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat) => (
            <StorageStat key={stat.label} {...stat} />
          ))}
        </div>
      )}

      {hasNotes && (
        <div
          className={`rounded-xl border border-gray-200 p-4 text-sm text-gray-700 leading-relaxed ${
            hasStats ? "mt-3" : ""
          }`}
        >
          <span className="text-xs text-gray-500 flex items-center gap-1 mb-1">
            <span>📝</span>
            <span>보관 참고사항</span>
          </span>
          <p>{storage.notes}</p>
        </div>
      )}
    </section>
  );
};

export default StorageInfoCard;
