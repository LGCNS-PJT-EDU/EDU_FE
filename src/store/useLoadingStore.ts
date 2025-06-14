import { create } from "zustand";

interface LoadingState {
  isLoading: boolean;
  message: string;
  imgSrc?: string;
  startLoading: (msg?: string, imgSrc?: string) => void;
  stopLoading: () => void;
}

export const useLoadingStore = create<LoadingState>((set) => ({
  isLoading: false,
  message: "로딩 중...",
  imgSrc: undefined,
  startLoading: (msg, imgSrc) =>
    set({ isLoading: true, message: msg ?? "로딩 중...", imgSrc }),
  stopLoading: () => set({ isLoading: false, imgSrc: undefined }),
}));
