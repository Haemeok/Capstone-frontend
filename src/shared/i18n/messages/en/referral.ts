import type { ReferralDict } from "../../types";

export const referral: ReferralDict = {
  giftAria: "Invite friends",
  adFreeLabel: "Ad-free active",
  adFreeUntil: "until {date}",
  daysLeft: { one: "{n} day left", other: "{n} days left" },
  endsToday: "ends today",
  sheetTitle: "Invite friends",
  sheetTitleWithMonth: "Invite friends",
  description:
    "Invite a friend and you both get a month of Recipio with no ads. The more friends you invite, the more your rewards stack up.",
  myCodeLabel: "Your invite code",
  copyAria: "Copy invite code",
  copyAction: "Copy",
  copiedToast: "Invite code copied.",
  inputLabel: "Enter a friend's code",
  inputPlaceholder: "Invite code",
  inputAria: "Friend's invite code",
  applyAction: "Apply",
  loadError: "Couldn't load your invite info.",
  retry: "Try again",
  referredBy: "You joined through {nickname}'s invite.",
  rewardLimit:
    "You've claimed all your rewards for this event, but your friends can still get theirs.",
  redeemSuccessToast: "Ads removed until {date}.",
  status: {
    ALREADY_REDEEMED: "You've already entered a referrer.",
    NOT_ELIGIBLE_OLD_USER:
      "Only accounts created after the event started can enter a code.",
    REDEEM_WINDOW_EXPIRED: "The referral entry period has ended.",
    NO_ACTIVE_CAMPAIGN: "There's no active invite event right now.",
  },
};
