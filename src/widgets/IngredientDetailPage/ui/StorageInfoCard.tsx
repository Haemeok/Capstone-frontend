import type { StorageInfo } from "@/entities/ingredient";

type StorageInfoCardProps = {
  storage: StorageInfo;
};

const StorageInfoCard = ({ storage }: StorageInfoCardProps) => {
  return (
    <section className="px-5 py-6 border-t border-gray-100">
      <h2 className="text-lg font-bold text-gray-800 mb-3">보관방법</h2>

      <div className="flex gap-3">
        <div className="flex-1 rounded-xl border border-gray-200 p-4 flex flex-col gap-1">
          <span className="text-xs text-gray-500 flex items-center gap-1">
            <span>🌡️</span>
            <span>온도</span>
          </span>
          <span className="text-lg font-bold text-gray-900">
            {storage.temperatureLabel}
          </span>
        </div>

        <div className="flex-1 rounded-xl border border-gray-200 p-4 flex flex-col gap-1">
          <span className="text-xs text-gray-500 flex items-center gap-1">
            <span>📅</span>
            <span>기간</span>
          </span>
          <span className="text-lg font-bold text-gray-900">
            {storage.durationLabel}
          </span>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 p-4 text-sm text-gray-700 leading-relaxed mt-3">
        <span className="text-xs text-gray-500 flex items-center gap-1 mb-1">
          <span>📝</span>
          <span>보관 팁</span>
        </span>
        <p>{storage.tip}</p>
      </div>
    </section>
  );
};

export default StorageInfoCard;
