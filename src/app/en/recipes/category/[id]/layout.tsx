import type { Metadata } from "next";

import { buildCategoryMetadata } from "@/entities/recipe/model/buildCategoryMetadata";

type Props = { params: Promise<{ id: string }>; children: React.ReactNode };

export const generateMetadata = ({ params }: Props): Promise<Metadata> =>
  buildCategoryMetadata(params, "en");

export default function EnCategoryLayout({ children }: Props) {
  return <>{children}</>;
}
