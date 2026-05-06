"use client";

// 데스크톱에서는 sticky 하단 anchor 바가 의미 없고, 모바일 트래픽은 거의 RN
// WebView 앱이라 광고가 채워지지 않아 흰 바가 영구적으로 남는다. 모바일 웹
// 사용자도 거의 없어 컴포넌트를 비활성화 상태로 둔다. 재활성화가 필요하면
// 이전 commit에서 구현체를 복구한다.
export const BottomAnchorAdSlot = () => null;
