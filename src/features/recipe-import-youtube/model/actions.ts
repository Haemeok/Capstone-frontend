"use server";

import { YoutubeMeta } from "./types";
import { extractVideoId } from "../lib/urlValidation";

export const getYoutubeMeta = async (
  videoUrl: string
): Promise<YoutubeMeta | null> => {
  try {
    const videoId = extractVideoId(videoUrl);
    if (!videoId) return null;

    // 유튜브 공식 oEmbed 엔드포인트
    const res = await fetch(
      `https://www.youtube.com/oembed?url=${encodeURIComponent(
        `https://www.youtube.com/watch?v=${videoId}`
      )}&format=json`,
      { next: { revalidate: 3600 } }
    );

    if (!res.ok) {
      return null;
    }

    const data = await res.json();

    return {
      url: videoUrl,
      title: data.title,
      channelName: data.author_name,
      thumbnailUrl: data.thumbnail_url,
      videoId: videoId,
    };
  } catch (e) {
    console.error("Error fetching YouTube oEmbed:", e);
    return null;
  }
};

