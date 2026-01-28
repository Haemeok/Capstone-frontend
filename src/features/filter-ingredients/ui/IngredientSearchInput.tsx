import { Search } from "lucide-react";

type Props = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
};

export const IngredientSearchInput = ({ value, onChange, onSubmit }: Props) => {
  return (
    <form onSubmit={onSubmit} className="relative">
      <input
        type="text"
        placeholder="재료 이름을 검색하세요"
        className="w-full rounded-xl border border-gray-200 py-3 pr-4 pl-11 text-gray-900 placeholder:text-gray-400 transition-colors focus:border-olive-light focus:outline-none focus:ring-1 focus:ring-olive-light"
        value={value}
        onChange={onChange}
      />
      <button type="submit" className="cursor-pointer">
        <Search
          size={20}
          className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400"
        />
      </button>
    </form>
  );
};
