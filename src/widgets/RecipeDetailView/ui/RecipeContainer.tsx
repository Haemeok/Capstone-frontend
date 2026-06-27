import { ReactNode } from "react";

import { Container } from "@/shared/ui/Container";

export function RecipeContainer({ children }: { children: ReactNode }) {
  return (
    <Container>
      <div className="relative flex flex-col pb-10 md:pb-20">{children}</div>
    </Container>
  );
}
