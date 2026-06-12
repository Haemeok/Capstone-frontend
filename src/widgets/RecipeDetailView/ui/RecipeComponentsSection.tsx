import type { RecipeComponent } from "@/entities/recipe/model/types";

type RecipeComponentsSectionProps = {
  components: RecipeComponent[];
  className?: string;
};

const ROLE_EMOJI_MAP: Record<RecipeComponent["role"], string> = {
  Main: "🍽️",
  Sauce: "🥣",
  Garnish: "🌿",
  Accent: "⭐",
  Crunch: "🥜",
  "Pickle/Gel": "🥒",
};

export default function RecipeComponentsSection({
  components,
  className = "",
}: RecipeComponentsSectionProps) {
  if (!components || components.length === 0) return null;

  return (
    <section
      className={`border-olive-light/30 bg-beige-light rounded-card my-6 border p-4 ${className}`}
    >
      <h2 className="text-ink mb-3 font-bold">디쉬 구성 요소</h2>
      <div className="flex flex-col gap-3">
        {components.map((component, index) => (
          <div key={index} className="flex items-start gap-3">
            <span className="flex-shrink-0 text-2xl">
              {ROLE_EMOJI_MAP[component.role]}
            </span>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="bg-olive/10 text-olive rounded-md px-2 py-0.5 text-xs font-semibold">
                  {component.role}
                </span>
                {component.name && (
                  <span className="text-ink text-sm font-bold">
                    {component.name}
                  </span>
                )}
              </div>
              {component.description && (
                <p className="text-ink-sub text-sm leading-relaxed">
                  {component.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
