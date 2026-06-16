import type { LandingDict } from "../../types";

export const landing: LandingDict = {
  recipeCount: {
    label: "50,000+",
    phrase: "50,000+ recipes",
  },
  hero: {
    badge: "{count} recipes · YouTube link import · AI picks",
    titleLine1: "Everyday cooking,",
    titleHighlight: "simpler and more fun",
    subjectHighlight: "Save any recipe from a YouTube link",
    subjectRest: ", and let AI recommend from {count} recipes",
    cta: "Start free",
    checklist: ["No sign-up", "All features free", "Ready in a minute"],
  },
  problems: {
    eyebrow: "Sound familiar?",
    title: "Why is cooking so hard?",
    subtitle: "The cooking struggles many people share — you're not alone",
    items: [
      {
        title: "Rising dining-out and delivery costs",
        description:
          "With prices climbing, cooking at home is the smarter choice",
      },
      {
        title: "Recipe videos are hard to follow",
        description: "No more pausing videos to jot down every ingredient",
      },
      {
        title: "Stuck with leftover ingredients?",
        description: "Not sure what to do with what's left after cooking?",
      },
      {
        title: "Cooking takes too long",
        description:
          "You need recipes that are quick and easy on a busy schedule",
      },
    ],
  },
  stats: {
    title: "Real results from real users",
    subtitle: "See the change people experienced after starting with recipio",
    items: [
      {
        metric: "50,000+",
        label: "Curated recipes",
        description: "From YouTube, popular recipes, to AI",
      },
      {
        metric: "45%",
        label: "Avg. monthly food savings",
        description: "Versus delivery and dining out",
      },
      {
        metric: "48 min",
        label: "Less daily decision time",
        description: 'The "what\'s for dinner?" question',
      },
      {
        metric: "98%",
        label: "Fridge ingredients used",
        description: "Minimal food waste",
      },
    ],
  },
  tagChips: {
    eyebrow: "Recipes by situation",
    title: "For any day, any moment",
    subtitle: "Find the right recipe for the moment",
    groupLabels: {
      occasion: "Occasions & celebrations",
      situation: "Everyday & by situation",
      speed: "Quick to make",
    },
    chipNames: {
      HOME_PARTY: "Home party",
      HOLIDAY: "Anniversary",
      BRUNCH: "Brunch",
      PICNIC: "Picnic",
      SOLO: "Solo meal",
      LUNCHBOX: "Lunchbox",
      HEALTHY: "Diet",
      LATE_NIGHT: "Late night",
      DRINK: "Bar snacks",
      HANGOVER: "Hangover cure",
      CAMPING: "Camping",
      KIDS: "Kids' meals",
      QUICK: "Super quick",
      AIR_FRYER: "Air fryer",
    },
  },
  features: {
    eyebrow: "Key features",
    title: "How we make cooking easier",
    subtitle: "Simpler cooking, a smarter kitchen",
    items: [
      {
        badge: "YouTube import",
        title: "A full recipe from one YouTube link",
        description:
          "No pausing to take notes. Paste a link and we extract ingredients, steps, and portions automatically.",
        benefits: [
          "Auto-organized ingredients",
          "Step-by-step instructions",
          "Saved with the video",
          "Your favorite creators' recipes",
        ],
      },
      {
        badge: "{count} recipes",
        title: "One of the largest curated recipe libraries",
        description:
          "Explore {phrase} in one place — from YouTube to AI-generated and popular home cooking.",
        benefits: [
          "Popular new recipes",
          "A large YouTube-sourced library",
          "Tagged by situation and occasion",
        ],
      },
      {
        badge: "AI recommendations",
        title: "Recipes tailored to you",
        description:
          "Generate recipes from many inputs — an AI recipe generation platform",
        benefits: [
          "Budget-friendly recipes",
          "Nutrition-balanced recipes",
          "Fine-dining recipes",
          "Recipes from fridge leftovers",
        ],
      },
      {
        badge: "Smart management",
        title: "Auto recommendations from your fridge",
        description:
          "Register what you have and AI finds recipes you can make — efficiently, with no waste.",
        benefits: ["Recipes that use up leftovers"],
      },
    ],
  },
  testimonials: {
    eyebrow: "What users say",
    title: "Already loved by many",
    subtitle: "Hear honest stories from real users",
    items: [
      {
        name: "Daniel Carter",
        role: "Cooking on my own, 3 yrs · Seattle",
        content:
          "Leftover veggies were always a headache. I type in what I have and stir-fry and soup recipes show up instantly. Barely threw anything out this month.",
        avatar: "🏠",
        rating: 5,
        highlight: "Used up the whole fridge",
      },
      {
        name: "Emily Brooks",
        role: "Pilates instructor · Austin",
        content:
          "I track calories and protein closely. This is the first app where I can follow video recipes and see the nutrition too.",
        avatar: "🧘‍♀️",
        rating: 5,
        highlight: "Nutrition at a glance",
      },
      {
        name: "Marcus Lee",
        role: "Software engineer · San Jose",
        content:
          "Pausing YouTube videos with wet hands drove me nuts. Everything's laid out as clean text here, so I cook much faster.",
        avatar: "👨‍💻",
        rating: 5,
        highlight: "Cooked 20 min faster",
      },
      {
        name: "Sophie Turner",
        role: "Budget-minded home cook · Portland",
        content:
          "Knowing the rough cost per recipe is a game changer. Seeing that tonight's dinner beat delivery makes cooking worth it.",
        avatar: "📝",
        rating: 5,
        highlight: "Cheaper than delivery",
      },
      {
        name: "Ethan Walker",
        role: "New to cooking · Denver",
        content:
          "I couldn't even measure water for instant noodles. The portions are exact, so even I don't fail.",
        avatar: "🍳",
        rating: 5,
        highlight: "Foolproof measurements",
      },
      {
        name: "Olivia Reed",
        role: "Working mom · Chicago",
        content:
          "No time to shop after work — I checked just eggs and tofu in my fridge and got a solid dish. Way less dinner stress.",
        avatar: "👩‍👧‍👦",
        rating: 5,
        highlight: "No more dinner stress",
      },
    ],
  },
  finalCta: {
    titleLine1: "Start today —",
    titleHighlight: "an easier cooking life",
    subtitle:
      "{count} recipes, AI picks, and YouTube import — start free right now",
    primaryCta: "Start free",
    secondaryCta: "Browse popular recipes",
  },
};
