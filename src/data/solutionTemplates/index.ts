import type { SolutionTemplate } from "./types";
import { week1Templates } from "./week1";
import { week2Templates } from "./week2";

export const solutionTemplates: Record<string, SolutionTemplate> = {
  ...week1Templates,
  ...week2Templates,
};

export type { SolutionTemplate } from "./types";
