import { GRID_COUNT } from "./gridLayout";
import {
  type ItemsGen,
  type ItemsResult,
  itemsSchema,
  MAX_CAPTION,
  MAX_CONCEPT,
  MAX_DISH_NAME,
  MAX_HEADER,
  MAX_IMAGE_PROMPT,
  TOPIC_COUNT,
  type TopicsGen,
  type TopicsResult,
  topicsSchema,
  truncate,
} from "./schema";

export const normalizeTopics = (raw: TopicsGen): TopicsResult => {
  const topics = raw.topics
    .map((t) => ({
      title: truncate(t.title.trim(), MAX_HEADER),
      concept: truncate(t.concept.trim(), MAX_CONCEPT),
    }))
    .filter((t) => t.title.length > 0 && t.concept.length > 0)
    .slice(0, TOPIC_COUNT);
  return topicsSchema.parse({ topics });
};

export const normalizeItems = (raw: ItemsGen): ItemsResult => {
  const items = raw.items
    .map((it) => ({
      dishName: truncate(it.dishName.trim(), MAX_DISH_NAME),
      caption: truncate(it.caption.trim(), MAX_CAPTION),
      imagePrompt: truncate(it.imagePrompt.trim(), MAX_IMAGE_PROMPT),
    }))
    .filter((it) => it.dishName && it.caption && it.imagePrompt)
    .slice(0, GRID_COUNT);

  if (items.length < GRID_COUNT) {
    throw new Error(
      `항목이 ${GRID_COUNT}개 필요한데 ${items.length}개만 생성됐어요. 다시 시도해 주세요.`
    );
  }

  return itemsSchema.parse({
    header: truncate(raw.header.trim(), MAX_HEADER),
    items,
  });
};
