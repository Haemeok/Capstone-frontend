import { events as en } from "./messages/en/events";
import { events as ja } from "./messages/ja/events";
import { events as ko } from "./messages/ko/events";
import type { EventsDict, Locale } from "./types";

export const eventsMessages: Record<Locale, EventsDict> = { ko, ja, en };
