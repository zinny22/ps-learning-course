export type ProblemPlatform = "BOJ" | "Programmers";
export type ProblemStatus = "TODO" | "DONE" | "RETRY";

export type CodeLanguage = "js" | "jsx" | "ts" | "tsx" | "py";

export interface ProblemNotes {
  summary: string;
  approach: string;
  keyPoints: string;
  mistakes: string;
  code: string;
  codeLanguage: CodeLanguage;
  retrospective: string;
  retryCriteria: string;
}

export interface Week {
  id: string;
  weekNumber: number;
  title: string;
  goal: string[];
  thinkingPattern: string;
  learningPoints: string[];
  checklist: string[];
  difficulty: 1 | 2 | 3 | 4;
}

export interface Problem {
  id: string;
  platform: ProblemPlatform;
  number: number;
  title: string;
  week: number;
  tags: string[];
  // status is managed in the store, but useful for UI representation
}
