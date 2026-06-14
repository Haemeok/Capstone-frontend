import type { Metadata } from "next";

import { buildCategoryMetadata } from "@/entities/recipe/model/buildCategoryMetadata";

type Props = { params: Promise<{ id: string }>; children: React.ReactNode };

export const generateMetadata = ({ params }: Props): Promise<Metadata> =>
  buildCategoryMetadata(params, "ja");

export default function JaCategoryLayout({ children }: Props) {
  return <>{children}</>;
}
