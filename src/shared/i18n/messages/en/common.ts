import type { CommonDict } from "../../types";

export const common: CommonDict = {
  readMore: "Read more",
  collapse: "Show less",
  readMoreAria: "Show full text",
  collapseAria: "Collapse text",
  loginRequired: "Please log in first.",
  actions: {
    save: "Save",
    unsave: "Unsave",
    like: "Like",
    unlike: "Unlike",
    share: "Share",
    shareLabel: "Share",
    close: "Close",
    back: "Back",
    edit: "Edit",
    remix: "Remix",
    editRecipeAria: "Edit recipe",
    remixRecipeAria: "Remix recipe",
    recipeOptions: "Recipe options",
  },
  modal: {
    delete: {
      description: "This can't be undone.",
      cancel: "Cancel",
      confirm: "Delete",
    },
    unsavedChanges: {
      title: "Leave without saving?",
      description: "Your changes won't be saved.",
      cancel: "Cancel",
      leave: "Leave",
    },
  },
  sort: { title: "Sort by", reset: "Reset", apply: "Done" },
  toast: {
    logout: {
      pending: "Logging out...",
      error: "Logout failed: {message}",
    },
    deleteAccount: {
      pending: "Deleting account...",
      success: "Your account has been deleted.",
      error: "Couldn't delete account: {message}",
    },
  },
  errors: { unknown: "An unknown error occurred." },
};
