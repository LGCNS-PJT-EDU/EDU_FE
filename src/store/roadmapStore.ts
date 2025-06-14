import { create } from 'zustand';

export interface NodeData {
  id: number;
  label: string;
  subjectOrder: number;
  subjectOverview: string; // snake → camel
}

export interface RoadmapStore {
  nodes: NodeData[];
  editing: boolean;
  setEditing: (flag: boolean) => void;
  selected: NodeData | null;
  modalOpen: boolean;

  currentOrder: number | null;
  setCurrentOrder: (order: number) => void;

  toggleEditing: () => void;
  addNode: (label: string) => void;
  deleteNode: (index: number) => void;
  reorderNode: (from: number, to: number) => void;

  setInitial: (
    subjects: {
      subjectId: number;
      subjectName: string;
      subjectOrder: number;
      subject_overview?: string | null;
    }[]
  ) => void;
  openModal: (index: number) => void;
  closeModal: () => void;
}

export const useRoadmapStore = create<RoadmapStore>((set, get) => ({
  nodes: [],
  editing: false,
  setEditing: (flag) => set({ editing: flag }),
  selected: null,
  modalOpen: false,

  currentOrder: null,
  setCurrentOrder: (order) => set({ currentOrder: order }),

  toggleEditing: () => set((s) => ({ editing: !s.editing })),

  addNode: (label) =>
    set((s) => ({
      nodes: [...s.nodes, { id: Date.now(), label, subjectOrder: 0, subjectOverview: '' }],
    })),

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

  setInitial: (
    subjects: {
      subjectId: number;
      subjectName: string;
      subjectOrder: number;
      subject_overview?: string | null;
    }[]
  ) =>
    set(() => ({
      nodes: subjects.map((s) => ({
        id: s.subjectId,
        label: s.subjectName,
        subjectOrder: s.subjectOrder,
        subjectOverview: s.subject_overview ?? '',
      })),
    })),

  openModal: (index) =>
    set((s) => ({
      modalOpen: true,
      selected: s.nodes[index] ?? null,
    })),

  closeModal: () => set(() => ({ modalOpen: false, selected: null })),
}));
