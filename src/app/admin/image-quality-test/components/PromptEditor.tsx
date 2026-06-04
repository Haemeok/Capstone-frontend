"use client";

type Props = {
  value: string;
  onChange: (prompt: string) => void;
};

export const PromptEditor = ({ value, onChange }: Props) => {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-sm font-bold text-gray-900">프롬프트</h3>
        <span className="text-xs text-gray-400">{value.length} chars</span>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="focus:border-olive-light focus:ring-olive-light h-32 w-full resize-none rounded-xl border border-gray-200 p-3 text-sm text-gray-900 placeholder:text-gray-400 focus:ring-1 focus:outline-none"
        placeholder="레시피에서 자동 생성됩니다"
      />
    </div>
  );
};
