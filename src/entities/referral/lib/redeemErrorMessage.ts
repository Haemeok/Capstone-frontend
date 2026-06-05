const REFERRAL_ERROR_MESSAGES: Record<string, string> = {
  "1301": "추천 코드를 찾을 수 없어요.",
  "1302": "본인의 추천 코드는 입력할 수 없어요.",
  "1303": "이미 추천인을 입력했어요.",
  "1304": "이벤트 시작 이후 가입한 분만 추천인을 입력할 수 있어요.",
  "1305": "추천인 입력 가능 기간이 지났어요.",
  "1306": "현재 진행 중인 추천 이벤트가 없어요.",
};

const FALLBACK = "추천인 입력에 실패했어요. 잠시 후 다시 시도해 주세요.";

export const redeemErrorMessage = (code: string | undefined): string => {
  if (code && REFERRAL_ERROR_MESSAGES[code])
    return REFERRAL_ERROR_MESSAGES[code];
  return FALLBACK;
};
