import { notFound } from "next/navigation";
import { ARCHETYPE_RESULTS } from "@/features/archetype/model/archeTypeResult";
import ArchetypeResult from "@/features/archetype/ui/ArchetypeResult";
import { Container } from "@/shared/ui/Container";

export async function generateStaticParams() {
  const items = Object.values(ARCHETYPE_RESULTS);

  return items.map((item) => ({
    code: item.code,
  }));
}

export const dynamicParams = false;

interface PageProps {
  params: Promise<{ code: string }>;
}

export default async function ArchetypePage({ params }: PageProps) {
  const { code } = await params;

  const entry = Object.entries(ARCHETYPE_RESULTS).find(
    ([_, value]) => value.code === code
  );

  if (!entry) {
    return notFound();
  }

  const [archetypeKey] = entry;

  return (
    <Container padding={false}>
      <ArchetypeResult result={archetypeKey} />
    </Container>
  );
}
