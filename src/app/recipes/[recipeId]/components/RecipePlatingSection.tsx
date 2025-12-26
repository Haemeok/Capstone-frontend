import { ChefHat, UtensilsCrossed } from "lucide-react";

type RecipePlatingSectionProps = {
  vessel: string;
  guide: string;
  className?: string;
};

export default function RecipePlatingSection({
  vessel,
  guide,
  className = "",
}: RecipePlatingSectionProps) {
  return (
    <section
      className={`border-brown-light bg-beige my-6 rounded-xl border p-4 ${className}`}
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-start gap-3">
          <UtensilsCrossed className="text-brown h-6 w-6 flex-shrink-0" />
          <div className="flex flex-col gap-1">
            <span className="text-brown text-sm font-bold">추천 그릇</span>
            <p className="text-sm text-gray-700">{vessel}</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <ChefHat className="text-brown h-6 w-6 flex-shrink-0" />
          <div className="flex flex-col gap-1">
            <span className="text-brown text-sm font-bold">
              플레이팅 가이드
            </span>
            <p className="text-sm leading-relaxed whitespace-pre-wrap text-gray-700">
              {guide}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
