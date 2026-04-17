import { Lightbulb } from "lucide-react";

type RecipeCookingTipsSectionProps = {
  tips: string | undefined;
};

export default function RecipeCookingTipsSection({
  tips,
}: RecipeCookingTipsSectionProps) {
  if (!tips) return null;

  return (
    <section className="my-6 rounded-xl border border-olive-light/20 bg-olive-light/5 p-4">
      <div className="flex items-start gap-3">
        <Lightbulb className="h-6 w-6 flex-shrink-0 text-olive-dark" />
        <div className="flex flex-col gap-1">
          <span className="text-sm font-bold text-olive-dark">Chef's Tips</span>
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-700">
            {tips}
          </p>
        </div>
      </div>
    </section>
  );
}
