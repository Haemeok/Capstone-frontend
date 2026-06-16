import type { EventsDict } from "../../types";

export const events: EventsDict = {
  faqHeading: "FAQ",
  worldRecipes: {
    headerTitle: "Browse YouTube recipes from around the world",
    heroAlt: "Because recipes have no borders",
    intro: {
      label: "Beyond Borders",
      title: "Recipes from other countries, now wide open",
      body: "There's a new country filter. Browse recipes from Korean and Japanese channels — and creators from other countries too — by picking just the countries you want.",
    },
    howTo: {
      label: "How to use",
      title: "Here's how to pick",
      body: {
        lead: "On the search screen, open ",
        filter: "Filter",
        middle: " and choose the countries you want under ",
        country: "Creator country",
        tail: ". You'll see recipes only from channels in those countries.",
      },
      cta: "Find recipes from other countries",
    },
    faq: [
      {
        question: "Which countries are supported?",
        answer:
          'We group them into Korea, Japan, and Other. "Other" covers every channel outside Korea and Japan.',
      },
      {
        question: "Does it filter by cuisine type?",
        answer:
          'No. It\'s based on the country of the channel or creator who posted the video. A pasta video from a Korean channel still counts as "Korea."',
      },
      {
        question: "Where do I choose a country?",
        answer:
          'Tap "Filter" on the search screen and you\'ll find "Creator country." Pick Korea, Japan, or Other there.',
      },
      {
        question: "Can I view several countries at once?",
        answer:
          "Yes. Select multiple countries together — like Korea and Japan — and we'll show them all in one place.",
      },
    ],
    meta: {
      title: "Because recipes have no borders",
      description:
        "Use the country filter to browse YouTube recipes from Korea, Japan, and beyond. Pick the countries you want and discover home cooking from around the world.",
      keywords: [
        "world recipes",
        "international recipes",
        "youtube recipes",
        "recipes by country",
        "japanese recipes",
        "global recipes",
        "foreign cuisine",
      ],
      ogImageAlt:
        "Because recipes have no borders - browse YouTube recipes from around the world",
    },
  },
  adFreeJune: {
    headerTitle: "Invite a friend, turn ads off",
    heroAlt: "June ad-free campaign",
    event1: {
      label: "Event 1",
      title: "Everyone who joins gets up to 3 months ad-free",
      body: "Invite a friend and clear ads for up to three months.",
    },
    event2: {
      label: "Event 2",
      title: "You and your friend both go ad-free, 1+1",
      body: "When your friend enters your invite code, both of you get one month ad-free. Each invite code can be entered only once.",
    },
    referralCta: {
      participate: "Join the campaign",
      shareCode: "Share your invite code",
    },
    faq: [
      {
        question: "How do I turn off ads?",
        answer:
          "Invite a friend, and when they enter your invite code, both of you get one month ad-free.",
      },
      {
        question: "How many months can I clear?",
        answer:
          "You can earn rewards for up to three friends per campaign, so you can go ad-free for up to three months.",
      },
      {
        question: "Who can enter an invite code?",
        answer:
          "Anyone who signed up on or after June 1, 2026 can enter one within 30 days of signing up — once in a lifetime.",
      },
      {
        question: "Can existing members join?",
        answer:
          "Entering an invite code isn't available to them, but anyone can share their own invite code with friends.",
      },
      {
        question: "Can I enter an invite code more than once?",
        answer: "No. An invite code can be entered only once, ever.",
      },
    ],
    meta: {
      title: "Invite a friend, turn ads off",
      description:
        "Invite a friend and both of you go ad-free. For one month this June, a single invite code clears ads for up to three months.",
      keywords: [
        "ad-free",
        "ad-free recipes",
        "friend referral campaign",
        "invite code",
        "june campaign",
        "recipio campaign",
      ],
      ogImageAlt: "Invite a friend, turn ads off - June ad-free campaign",
    },
  },
};
