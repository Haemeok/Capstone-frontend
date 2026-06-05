type ResolveAdsEnabledArgs = {
  adsEnabled: boolean;
  isTestUser: boolean;
  showAds: boolean | undefined;
};

export const resolveAdsEnabled = ({
  adsEnabled,
  isTestUser,
  showAds,
}: ResolveAdsEnabledArgs): boolean =>
  adsEnabled && !isTestUser && showAds !== false;
