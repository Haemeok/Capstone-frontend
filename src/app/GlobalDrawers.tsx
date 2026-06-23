"use client";

import dynamic from "next/dynamic";

const GlobalLoginEncourageDrawer = dynamic(
  () => import("@/widgets/LoginEncourageDrawer/GlobalLoginEncourageDrawer"),
  { ssr: false }
);
const GlobalNotificationPermissionDrawer = dynamic(
  () => import("@/widgets/NotificationPermissionDrawer"),
  { ssr: false }
);
const GlobalReviewGateDrawer = dynamic(
  () => import("@/widgets/ReviewGateDrawer"),
  { ssr: false }
);
const GlobalAppUpdateDrawer = dynamic(
  () => import("@/widgets/AppUpdateDrawer"),
  {
    ssr: false,
  }
);

const GlobalDrawers = () => (
  <>
    <GlobalLoginEncourageDrawer />
    <GlobalNotificationPermissionDrawer />
    <GlobalReviewGateDrawer />
    <GlobalAppUpdateDrawer />
  </>
);

export default GlobalDrawers;
