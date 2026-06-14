import type { ReferralDict } from "../../types";

export const referral: ReferralDict = {
  giftAria: "친구 초대 이벤트",
  adFreeLabel: "광고 없이 이용 중",
  adFreeUntil: "{date}까지",
  daysLeft: { one: "{n}일 남음", other: "{n}일 남음" },
  endsToday: "오늘까지",
  sheetTitle: "친구 초대 이벤트",
  sheetTitleWithMonth: "{month}월 친구 초대 이벤트",
  description:
    "친구를 초대하면 두 분 모두 한 달 동안 광고 없이 레시피오를 즐길 수 있어요. 여러 친구를 초대할수록 혜택이 쌓여요.",
  myCodeLabel: "내 초대코드",
  copyAria: "초대코드 복사",
  copyAction: "복사",
  copiedToast: "초대코드를 복사했어요.",
  inputLabel: "친구 초대코드 입력",
  inputPlaceholder: "초대코드",
  inputAria: "친구 초대코드",
  applyAction: "적용",
  loadError: "정보를 불러오지 못했어요.",
  retry: "다시 시도",
  referredBy: "{nickname}님의 추천으로 가입했어요.",
  rewardLimit:
    "이번 이벤트 내 추가 보상은 모두 받았지만, 친구는 여전히 혜택을 받을 수 있어요.",
  redeemSuccessToast: "광고 제거가 {date}까지 적용됐어요.",
  status: {
    ALREADY_REDEEMED: "이미 추천인을 입력했어요.",
    NOT_ELIGIBLE_OLD_USER: "이벤트 시작 이후 가입한 분만 입력할 수 있어요.",
    REDEEM_WINDOW_EXPIRED: "추천인 입력 가능 기간이 지났어요.",
    NO_ACTIVE_CAMPAIGN: "현재 진행 중인 추천 이벤트가 없어요.",
  },
  redeemErrors: {
    "1301": "추천 코드를 찾을 수 없어요.",
    "1302": "본인의 추천 코드는 입력할 수 없어요.",
    "1303": "이미 추천인을 입력했어요.",
    "1304": "이벤트 시작 이후 가입한 분만 추천인을 입력할 수 있어요.",
    "1305": "추천인 입력 가능 기간이 지났어요.",
    "1306": "현재 진행 중인 추천 이벤트가 없어요.",
    default: "추천인 입력에 실패했어요. 잠시 후 다시 시도해 주세요.",
  },
};
