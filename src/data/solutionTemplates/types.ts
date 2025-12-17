import type { CodeLanguage, ProblemNotes } from "../../types";

export type SolutionTemplate = Partial<ProblemNotes> & {
  codeLanguage?: CodeLanguage;
};
