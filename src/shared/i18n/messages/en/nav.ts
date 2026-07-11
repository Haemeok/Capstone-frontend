import type { NavDict } from "../../types";

export const nav: NavDict = {
  home: "Home",
  search: "Search",
  fridge: "Fridge",
  aiRecipe: "AI Recipe",
  cart: "Cart",
  my: "My",
  recipeSearch: "Recipe Search",
  youtubeRecipe: "YouTube Recipe",
  login: "Login",
  install: "Install App",
  installAria: "Install the app",
  shareAria: "Share",
  notificationsAria: "Go to notifications",
  notificationsUnreadAria: {
    one: "Go to notifications ({count} unread)",
    other: "Go to notifications ({count} unread)",
  },
  unreadBadgeAria: {
    one: "{count} unread notification",
    other: "{count} unread notifications",
  },
  savedBooksAria: "Saved recipe books",
  savedBooksToast: "Check out your saved recipe books!",
  profile: "Profile",
  footer: {
    sectionService: "Service",
    sectionSupport: "Support",
    tagline:
      "Make delicious meals with just what's in your fridge, powered by AI recipe recommendations.",
    businessInfoToggleAria: "Expand business info",
    terms: "Terms of Service",
    privacy: "Privacy Policy",
    reportError: "Report an error",
    adInquiry: "Advertising & partnerships",
    copyrightReport: "Copyright / takedown request",
    ceoLabel: "CEO",
    csLabel: "Customer service",
    adLabel: "Advertising",
  },
};
