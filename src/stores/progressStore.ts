import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ProblemStatus, ProblemNotes } from "../types";

interface ProgressState {
  // Map of problemId -> status
  statusMap: Record<string, ProblemStatus>;
  // Map of problemId -> notes
  notesMap: Record<string, ProblemNotes>;
  // Map of weekId-index -> checked
  checklistMap: Record<string, boolean>;

  // Actions
  updateStatus: (problemId: string, status: ProblemStatus) => void;
  updateNotes: (problemId: string, notes: Partial<ProblemNotes>) => void;
  toggleChecklist: (weekId: string, index: number) => void;
  getStatus: (problemId: string) => ProblemStatus;
  getNotes: (problemId: string) => ProblemNotes;
  getChecklistStatus: (weekId: string, index: number) => boolean;

  // Stats
  getCompletedCount: () => number;
  getTotalCount: () => number;
}

const defaultNotes: ProblemNotes = {
  summary: "",
  approach: "",
  keyPoints: "",
  mistakes: "",
  code: "",
  codeLanguage: "tsx",
  retrospective: "",
  retryCriteria: "",
};

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      statusMap: {},
      notesMap: {},
      checklistMap: {},

      updateStatus: (problemId, status) =>
        set((state) => ({
          statusMap: {
            ...state.statusMap,
            [problemId]: status,
          },
        })),

      updateNotes: (problemId, notes) =>
        set((state) => ({
          notesMap: {
            ...state.notesMap,
            [problemId]: {
              ...(state.notesMap[problemId] || defaultNotes),
              ...notes,
            },
          },
        })),

      toggleChecklist: (weekId, index) =>
        set((state) => {
          const key = `${weekId}-${index}`;
          return {
            checklistMap: {
              ...state.checklistMap,
              [key]: !state.checklistMap[key],
            },
          };
        }),

      getStatus: (problemId) => {
        return get().statusMap[problemId] || "TODO";
      },

      getNotes: (problemId) => {
        return {
          ...defaultNotes,
          ...(get().notesMap[problemId] || {}),
        };
      },

      getChecklistStatus: (weekId, index) => {
        const key = `${weekId}-${index}`;
        return !!get().checklistMap[key];
      },

      getCompletedCount: () => {
        const { statusMap } = get();
        return Object.values(statusMap).filter((status) => status === "DONE")
          .length;
      },

      getTotalCount: () => {
        const { statusMap } = get();
        return Object.keys(statusMap).length;
      },
    }),
    {
      name: "ps-learning-progress",
    }
  )
);
