// src/store/guestUuidStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface GuestUuidState {
  uuid: string | null;
  setUuid: (u: string | null) => void;
}

export const useGuestUuidStore = create<GuestUuidState>()(
  persist(
    (set) => ({
      uuid: null,
      setUuid: (u) => set({ uuid: u }),
    }),
    {
      name: 'roadmapUuid',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
