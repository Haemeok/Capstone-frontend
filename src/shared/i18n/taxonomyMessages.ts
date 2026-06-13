import { taxonomy as en } from "./messages/en/taxonomy";
import { taxonomy as ja } from "./messages/ja/taxonomy";
import { taxonomy as ko } from "./messages/ko/taxonomy";
import type { Locale, TaxonomyDict } from "./types";

export const taxonomyMessages: Record<Locale, TaxonomyDict> = { ko, ja, en };
