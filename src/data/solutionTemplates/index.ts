import type { SolutionTemplate } from "./types";
import { week1Templates } from "./week1";
import { week2Templates } from "./week2";
import { week3Templates } from "./week3";
import { week4Templates } from "./week4";
import { week5Templates } from "./week5";
import { week6Templates } from "./week6";
import { week7Templates } from "./week7";
import { week8Templates } from "./week8";
import { week9Templates } from "./week9";
import { week10Templates } from "./week10";
import { week11Templates } from "./week11";
import { week12Templates } from "./week12";
import { week13Templates } from "./week13";

export const solutionTemplates: Record<string, SolutionTemplate> = {
  ...week1Templates,
  ...week2Templates,
  ...week3Templates,
  ...week4Templates,
  ...week5Templates,
  ...week6Templates,
  ...week7Templates,
  ...week8Templates,
  ...week9Templates,
  ...week10Templates,
  ...week11Templates,
  ...week12Templates,
  ...week13Templates,
};

export type { SolutionTemplate } from "./types";
