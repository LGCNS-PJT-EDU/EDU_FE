import { create } from "zustand";

export type SnackbarType = "success" | "error" | "info";

interface SnackbarState {
  isOpen: boolean;
  message: string;
  type: SnackbarType;
  showSnackbar: (msg: string, type?: SnackbarType) => void;
  hideSnackbar: () => void;
}

export const useSnackbarStore = create<SnackbarState>((set) => ({
  isOpen: false,
  message: "",
  type: "info",
  showSnackbar: (message, type = "info") =>
    set({ isOpen: true, message, type }),
  hideSnackbar: () => set({ isOpen: false }),
}));
