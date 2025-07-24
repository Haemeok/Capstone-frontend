import { create } from "zustand";

import type { AIRecommendedRecipe, AIRecommendedRecipeRequest } from "./types";

export type AIRecipeGenerationState =
  | "idle"
  | "generating"
  | "completed"
  | "error";

export type AIModel = {
  id: string;
  name: string;
  description: string;
  image: string;
};

type AIRecipeStore = {
  generationState: AIRecipeGenerationState;
  selectedAI: AIModel | null;
  generatedRecipeData: AIRecommendedRecipe | null;
  formData: AIRecommendedRecipeRequest | null;
  error: string | null;

  setGenerationState: (state: AIRecipeGenerationState) => void;
  setSelectedAI: (ai: AIModel) => void;
  setGeneratedRecipe: (recipe: AIRecommendedRecipe) => void;
  setFormData: (data: AIRecommendedRecipeRequest) => void;
  setError: (error: string) => void;
  resetStore: () => void;

  startGeneration: (ai: AIModel, formData: AIRecommendedRecipeRequest) => void;
  completeGeneration: (recipe: AIRecommendedRecipe) => void;
  failGeneration: (error: string) => void;
};

export const useAIRecipeStore = create<AIRecipeStore>((set) => ({
  generationState: "idle",
  selectedAI: null,
  generatedRecipeData: null,
  formData: null,
  error: null,

  setGenerationState: (state) => set({ generationState: state }),
  setSelectedAI: (ai) => set({ selectedAI: ai }),
  setGeneratedRecipe: (recipe) => set({ generatedRecipeData: recipe }),
  setFormData: (data) => set({ formData: data }),
  setError: (error) => set({ error }),

  resetStore: () =>
    set({
      generationState: "idle",
      selectedAI: null,
      generatedRecipeData: null,
      formData: null,
      error: null,
    }),

  startGeneration: (ai, formData) =>
    set({
      generationState: "generating",
      selectedAI: ai,
      formData,
      error: null,
    }),

  completeGeneration: (recipe) =>
    set({
      generationState: "completed",
      generatedRecipeData: recipe,
      error: null,
    }),

  failGeneration: (error) =>
    set({
      generationState: "error",
      error,
    }),
}));
