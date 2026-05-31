"use client";

type Props = {
  imageUrls: string[];
  selectedUrl: string | null;
  onSelect: (url: string) => void;
};

export const ImageGrid = ({ imageUrls, selectedUrl, onSelect }: Props) => {
  if (imageUrls.length === 0) return null;
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4">
      <div className="mb-2 text-xs text-gray-500">
        생성된 이미지 — 영상 입력으로 사용할 이미지를 선택하세요
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {imageUrls.map((url) => {
          const isSelected = url === selectedUrl;
          return (
            <button
              key={url}
              type="button"
              onClick={() => onSelect(url)}
              className={`relative overflow-hidden rounded-card border-2 ${
                isSelected ? "border-olive-light" : "border-transparent"
              }`}
            >
              <img
                src={url}
                alt="generated"
                className="aspect-square w-full object-cover"
              />
              {isSelected && (
                <span className="absolute right-2 top-2 rounded-full bg-olive-light px-2 py-0.5 text-[10px] font-bold text-white">
                  선택됨
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
