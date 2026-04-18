import { ADSENSE_CLIENT_ID } from "../config";

export const isAdsEnabled = (): boolean => Boolean(ADSENSE_CLIENT_ID);
