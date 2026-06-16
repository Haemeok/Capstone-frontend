import type { RatingsDict } from "../../types";

export const ratings: RatingsDict = {
  empty: "아직 평가가 적어요. 평가를 남겨보세요 !",
  summary: "{count}명의 사람들이 평균 {value}점을 줬어요 !",
  starSelect: "{score}점 선택",
  form: {
    cancel: "취소",
    title: "평가하기",
    prompt: "{recipeName} 만들어 보셨나요?",
    promptCta: "평가해주세요!",
    feedbackHint:
      "커뮤니티를 위해 레시피에 대한 자세한 피드백이나 조언을 공유해주세요. 여러분의 경험이 큰 도움이 될 거예요!",
    placeholderExample:
      "예) 정말 맛있었어요! 저는 여기에 꿀을 살짝 추가했더니 풍미가 더 좋더라고요.",
    submit: "평가 남기기",
    successToast: "평가가 등록되었어요.",
    profileAlt: "프로필 이미지",
  },
};
