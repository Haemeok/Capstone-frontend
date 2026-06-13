import type { AiRecipeDict } from "../../types";

export const aiRecipe: AiRecipeDict = {
  modelSelectHeading: "Which AI would you like to cook with?",
  loginDrawerMessage: "Create recipes together with AI!",
  backToModelSelect: "Choose a different AI",
  generateRecipe: "Generate Recipe",
  errorFallback: "Something went wrong while generating your AI recipe",
  loading: {
    titleSuffix: "is crafting your recipe",
    progressLabel: "Progress",
    tipHeading: "💡 Quick tip!",
    tipBody: [
      "Feel free to do other things!",
      "Browse other pages or check your fridge.",
      "We'll let you know when your recipe is ready.",
    ],
    eta: "Usually takes about 2–3 minutes",
  },
  error: {
    defaultMessage: "An error occurred while generating the recipe.",
    failureHeading: "Recipe Generation Failed",
    failureBody: "Something went wrong while generating your recipe.",
    retryButton: "Try Again",
    persistentTip: "If the problem persists, please try again in a moment.",
  },
  models: {
    INGREDIENT_FOCUS: {
      name: "What's in the Fridge",
      description: "Make the most of what you already have",
    },
    COST_EFFECTIVE: {
      name: "Budget-Friendly",
      description: "Delicious meals that won't break the bank",
    },
    NUTRITION_BALANCE: {
      name: "Nutrition Balance",
      description: "Macros, ratios, and calories — all accounted for",
    },
    FINE_DINING: {
      name: "Fine Dining",
      description: "Restaurant-quality meals at your own table",
    },
  },
  steps: [
    "Analyzing your ingredients",
    "Finding the best flavor combinations",
    "Arranging the cooking steps",
    "Adding the finishing touches",
    "Wrapping up your recipe",
  ],
  diningTiers: {
    BLACK: {
      label: "Black",
      description: "Modern, innovative cuisine",
      features: [
        "Everyday ingredients",
        "Fine dining techniques",
        "Intermediate difficulty",
        "Standard kitchen tools",
      ],
    },
    WHITE: {
      label: "White",
      description: "Classic fine dining elegance",
      features: [
        "Premium ingredients included",
        "Refined techniques",
        "Advanced difficulty",
        "Specialty kitchen tools required",
      ],
    },
  },
  price: {
    pageTitle: "Budget Recipe Generator | Recipio",
    pageDescription:
      "Let AI generate wallet-friendly recipes tailored to your budget. Eat well for less than the average lunch out.",
    headerTitle: "Budget Recipe Generator",
    headerDescription:
      "Pick a budget and your preferred dish type — we'll generate a recipe that fits perfectly",
    budgetLabel: "Target Budget",
    foodPickHeading: "What are you in the mood for?",
    foodPickDescription: "Select your preferred dish type",
    averageMealInfo: "Average lunch-out budget ({price} won)",
    savingsMessage: "You're saving {savings} won compared to eating out!",
    monthlySavingsMessage:
      "Eat like this every day and save {months}0,000 won a month!",
    savingsBadgeLabel: "Potential savings this month",
    savingsBadgeSuffix: "saved!",
    dailyPracticeTip: "One meal a day and you'll hit your goal",
  },
  ingredient: {
    pickerInitialCategory: "All",
    pickerMineCategory: "My Ingredients",
    submitToastSuffix: "ingredients",
  },
  nutrition: {
    pageHeading: "Nutrition Balance",
    cookingStyleLabel: "Cooking Style",
    macroModeLabel: "Macro Focus",
    calorieModeLabel: "Calorie Focus",
    macroSliderSetLabel: "Set",
    macroSliderAutoLabel: "Auto",
    unlimitedValue: "No limit",
    macroCarbs: "Carbs",
    macroProtein: "Protein",
    macroFat: "Fat",
    macroCalories: "Target Calories",
    styles: {
      Asian_Style: {
        label: "Asian Style",
        description: "Korean, Chinese, Japanese",
      },
      Western_Style: { label: "Western Style", description: "Italian, French" },
      Light_Fresh: {
        label: "Light & Fresh",
        description: "Salads, health bowls",
      },
    },
    guidance: {
      calories: {
        low: "⚡ Diet mode on!",
        mid: "🍽️ Just right",
        high: "💪 Power up!",
        max: "🔥 Bulk up!",
      },
      protein: {
        low: "🥗 Light protein day",
        mid: "💪 Balanced muscle fuel",
        high: "🏋️ Gains time!",
      },
      carbs: {
        low: "🔥 Low-carb mode!",
        mid: "⚖️ Steady energy",
        high: "⚡ Carb explosion!",
      },
      fat: {
        low: "🥗 Clean eating!",
        mid: "👍 Just enough to feel full",
        high: "🧈 Healthy fats on point",
      },
    },
  },
  fineDining: {
    pageTitle: "Fine Dining Recipe Generator | Recipio",
    pageDescription:
      "Restaurant-quality meals at your own table. Discover fine dining recipes crafted by AI.",
    ingredientSectionHeading: "Select Ingredients",
    ingredientSectionDescription:
      "Choose the ingredients you'd like to use (at least 3)",
    ingredientSearchPlaceholder: "Search ingredients...",
    ingredientSearchAriaLabel: "Search for an ingredient",
    ingredientCountSuffix: "ingredients added",
    selectedIngredientsHeading: "Selected Ingredients",
    removeAllLabel: "Remove All",
    removeAllAriaLabel: "Remove all ingredients",
    removeIngredientAriaLabel: "Remove {name}",
    tierSectionHeading: "Choose a Style",
    tierSectionDescription: "Select your preferred fine dining style",
  },
  form: {
    dishType: {
      sectionTitle: "Dish Type",
      options: [
        "🍽️ All",
        "🍳 Stir-fry",
        "🍲 Soups & Stews",
        "🥩 Grilled",
        "🥗 Salads",
        "🍤 Fried & Pan-fried",
        "🥘 Braised & Steamed",
        "🍕 Oven-baked",
        "🍣 Raw / Sashimi",
        "🥒 Pickled & Fermented",
        "🍝 Rice, Noodles & Pasta",
        "🍰 Desserts & Snacks",
      ],
    },
    servings: {
      sectionTitle: "Servings",
      decreaseLabel: "Decrease servings",
      increaseLabel: "Increase servings",
      unit: "servings",
    },
    cookingTime: { sectionTitle: "Cooking Time" },
    aiCharacter: {
      withSuffix: "Cooking with",
      subtitle: "Generate a recipe tailored just for you",
    },
    progressButton: { label: "Generate Recipe" },
    usageLimitBanner: {
      message: "You've used all your AI recipe generations for today.",
      subMessage: "Come back tomorrow!",
    },
    ingredientManager: {
      addButtonLabel: "Add Ingredients",
      addButtonAriaLabel: "Add ingredients",
      ingredientsAddedCount: "ingredients added",
      addPrompt: "Add ingredients to generate your recipe",
      selectedHeading: "Selected Ingredients",
      removeAllLabel: "Remove All",
    },
  },
};
