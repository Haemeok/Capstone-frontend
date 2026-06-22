import { uiCommon as en } from "./messages/en/uiCommon";
import { uiCommon as ja } from "./messages/ja/uiCommon";
import { uiCommon as ko } from "./messages/ko/uiCommon";
import type { Locale, UiCommonDict } from "./types";

export const uiCommonMessages: Record<Locale, UiCommonDict> = { ko, ja, en };
