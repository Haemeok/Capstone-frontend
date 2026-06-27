import {
  TOTAL_RECIPE_COUNT_LABEL,
  TOTAL_RECIPE_COUNT_PHRASE,
} from "@/shared/config/constants/siteStats";

import type { LandingDict } from "../../types";

export const landing: LandingDict = {
  recipeCount: {
    label: TOTAL_RECIPE_COUNT_LABEL.en,
    phrase: TOTAL_RECIPE_COUNT_PHRASE.en,
  },
  hero: {
    badge: "{count} recipes · YouTube import · Local recipes · AI picks",
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
        title: "So many recipe videos, so hard to follow",
        description:
          "Too many to choose from, and pausing to jot down ingredients is a pain",
      },
      {
        title: "Curious what locals abroad actually cook",
        description:
          "You want real home cooking, but foreign videos and comments are hard to follow",
      },
      {
        title: "Stuck with leftover ingredients?",
        description: "Not sure what to do with what's left after cooking?",
      },
      {
        title: "Want to see tips from real chefs",
        description:
          "Real know-how from trusted chefs and popular creators — scattered across videos and hard to find",
      },
    ],
  },
  stats: {
    title: "Real results from real users",
    subtitle: "See the change people experienced after starting with recipio",
    items: [
      {
        metric: TOTAL_RECIPE_COUNT_LABEL.en,
        label: "Curated recipes",
        description: "From YouTube, popular recipes, to AI",
      },
      {
        metric: "20,000+",
        label: "Local recipes per country",
        description: "20,000+ each from Korea & Japan",
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
        badge: "Local recipes",
        title: "What locals actually cook at home",
        description:
          "Browse authentic Korean and Japanese home cooking with local ratings and translated comments — 20,000+ local recipes each.",
        benefits: [
          "20,000+ local recipes each from Korea & Japan",
          "See what's truly popular by local ratings",
          "Local comments & reviews auto-translated (free)",
          "Filter by country (Korea, Japan & more)",
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
        name: "Hannah Kim",
        role: "Korean-food curious · Los Angeles",
        content:
          "I'd always wanted to cook real Korean food. Here I can actually see what locals rate highly, with their comments translated — way more legit than the watered-down Asian recipes you find everywhere else.",
        avatar: "🍲",
        rating: 5,
        highlight: "Authentic Asian recipes",
      },
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
      "From YouTube import to local recipes and AI picks — start free with {count} recipes today",
    primaryCta: "Start free",
    secondaryCta: "Browse popular recipes",
  },
};
