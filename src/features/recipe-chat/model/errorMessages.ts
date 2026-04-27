import type { ChatErrorBehavior, ChatErrorCode } from "./types";

export const CHAT_ERROR_BEHAVIOR: Record<ChatErrorCode, ChatErrorBehavior> = {
  "703": {
    retryable: true,
    haptic: "Warning",
  },
  "704": {
    retryable: true,
    haptic: "Warning",
  },
  "705": {
    inputLock: true,
    haptic: "Warning",
  },
  "706": {
    inputLock: true,
    haptic: "Warning",
    fallbackView: {
      title: "챗봇이 일시 중지되었어요",
      description: "잠시 후 다시 이용해주세요.",
    },
  },
  "707": {
    toast: { message: "질문이 너무 길어요. 줄여서 보내주세요.", variant: "warning" },
    haptic: "Warning",
  },
  "708": {
    toast: { message: "잠시 후 다시 시도해주세요.", variant: "warning" },
    haptic: "Light",
  },
  "709": {},
  "710": {
    retryable: true,
    haptic: "Warning",
  },
  "401": {},
  "207": {
    inputLock: true,
    fallbackView: {
      title: "작성자만 사용할 수 있어요",
      description: "이 레시피는 비공개 상태입니다.",
    },
  },
  "201": {
    toast: { message: "레시피를 찾을 수 없어요.", variant: "error" },
    closeDrawer: true,
  },
};

export const getChatErrorBehavior = (code: ChatErrorCode): ChatErrorBehavior => {
  return CHAT_ERROR_BEHAVIOR[code] ?? CHAT_ERROR_BEHAVIOR["710"];
};

export const SYSTEM_BUBBLE_LABEL: Record<ChatErrorCode, string> = {
  "703": "답변을 만들지 못했어요. 다시 시도해주세요.",
  "704": "답변을 만들지 못했어요. 다시 시도해주세요.",
  "705": "오늘 한도를 모두 사용했어요. 내일 자정에 리셋돼요.",
  "706": "챗봇이 일시 중지되었어요.",
  "707": "질문이 너무 길어요.",
  "708": "잠시 후 다시 시도해주세요.",
  "709": "내용을 입력해주세요.",
  "710": "답변을 만들지 못했어요. 다시 시도해주세요.",
  "401": "로그인이 필요해요.",
  "207": "이 레시피는 작성자만 챗봇을 사용할 수 있어요.",
  "201": "레시피를 찾을 수 없어요.",
};
