import { create } from 'zustand';

export type EvalType = 'pre' | 'post';

interface SolutionState {
  evalType: EvalType;
  setEvalType: (t: EvalType) => void;

  // qId -> selected value
  answers: Record<string, string>;
  setAnswer: (qId: string, value: string) => void;
}

export const useSolutionStore = create<SolutionState>((set) => ({
  evalType: 'pre',
  setEvalType: (evalType) => set({ evalType }),

  answers: {},
  setAnswer: (qId, value) => set((state) => ({ answers: { ...state.answers, [qId]: value } })),
}));
