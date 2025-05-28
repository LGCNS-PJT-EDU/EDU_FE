import { create } from 'zustand';

export interface NodeData {
  id: number;
  label: string;
  subject_overview?: string;
}

export interface RoadmapStore {
  nodes: NodeData[];
  editing: boolean;
  setEditing: (flag:boolean) => void;
  selected: NodeData | null;
  modalOpen: boolean;
  toggleEditing: () => void;
  addNode: (label: string) => void;
  deleteNode: (index: number) => void;
  reorderNode: (from: number, to: number) => void;
  setInitial: (subjects: { subjectId: number; subjectName: string;}[]) => void;
  openModal: (index: number) => void;
  closeModal: () => void;
}

export const useRoadmapStore = create<RoadmapStore>((set) => ({
  nodes: [],
  editing: false,
  setEditing: (flag  => set({ editing: flag})), 
  selected: null,
  modalOpen: false,

  toggleEditing: () => set((s) => ({ editing: !s.editing })),

  addNode: (label) => set((s) => ({ nodes: [...s.nodes, { id: Date.now(), label }] })),

  deleteNode: (index) =>
    set((s) => {
      const copy = [...s.nodes];
      copy.splice(index, 1);
      return { nodes: copy };
    }),

  reorderNode: (from, to) =>
    set((s) => {
      if (from === to) return s;
      const copy = [...s.nodes];
      const [moved] = copy.splice(from, 1);
      copy.splice(to, 0, moved);
      return { nodes: copy };
    }),

  setInitial: (subjects) =>
    set(() => ({
      nodes: subjects.map((s) => ({ id: s.subjectId, label: s.subjectName })),
    })),

  openModal: (index) => set((s) => ({
    modalOpen: true, selected: s.nodes[index] ?? null
  })),

  closeModal: () => set(() => ({ modalOpen: false, selected: null })),
}));
