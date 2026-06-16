import type { RatingsDict } from "../../types";

export const ratings: RatingsDict = {
  empty: "Not many ratings yet. Be the first to rate!",
  summary: "{count} people rated this {value} on average!",
  starSelect: "Select {score} stars",
  form: {
    cancel: "Cancel",
    title: "Rate this recipe",
    prompt: "Did you make {recipeName}?",
    promptCta: "Share your rating!",
    feedbackHint:
      "Share your feedback or tips with the community — your experience really helps others.",
    placeholderExample:
      "e.g. Loved it! A little honey made the flavor even better.",
    submit: "Submit rating",
    successToast: "Your rating has been posted.",
    profileAlt: "Profile photo",
  },
};
