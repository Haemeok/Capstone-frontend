export type ArchetypeAnswer = {
  type: string;
  label: string;
  description: string;
};

export type ArchetypeQuestion = {
  id: number;
  category: string;
  question: string;
  answers: [ArchetypeAnswer, ArchetypeAnswer];
};

export type ArchetypeResult = string[];
