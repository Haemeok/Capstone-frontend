import { Lightbulb } from "lucide-react";

type RecipeCookingTipsSectionProps = {
  tips: string | undefined;
};

export default function RecipeCookingTipsSection({
  tips,
}: RecipeCookingTipsSectionProps) {
  if (!tips) return null;

  return (
    <section className="my-6 rounded-xl border border-amber-100 bg-amber-50 p-4">
      <div className="flex items-start gap-3">
        <Lightbulb className="h-6 w-6 flex-shrink-0 text-amber-500" />
        <div className="flex flex-col gap-1">
          <span className="text-sm font-bold text-amber-800">Chef's Tips</span>
          <p className="text-sm leading-relaxed whitespace-pre-wrap text-gray-700">
            {tips}
          </p>
        </div>
      </div>
    </section>
  );
}
