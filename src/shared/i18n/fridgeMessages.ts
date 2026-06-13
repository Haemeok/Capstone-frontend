import { fridge as en } from "./messages/en/fridge";
import { fridge as ja } from "./messages/ja/fridge";
import { fridge as ko } from "./messages/ko/fridge";
import type { FridgeDict, Locale } from "./types";

export const fridgeMessages: Record<Locale, FridgeDict> = { ko, ja, en };
