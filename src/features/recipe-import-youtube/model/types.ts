export type YoutubeMeta = {
  url: string;
  title: string;
  channelName: string;
  thumbnailUrl: string;
  videoId: string;
};

export type YoutubeImportResponse =
  | { recipeId: string }
  | { code: number; message: string };

export type ExtractionStatus = {
  status: "pending" | "success" | "failed";
  recipeId?: string;
  error?: {
    code: number;
    message: string;
  };
};

export type YoutubeDuplicateCheckResponse = {
  recipeId?: string;
};
