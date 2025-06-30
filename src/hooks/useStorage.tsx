import { create } from 'zustand';

type Storage = Record<string, any>;

interface StoreState {
  storage: Storage;
  save: (data: Storage) => void;
  get: () => Storage;
  remove: (key: string) => void;
}

const useStore = create<StoreState>((set, get) => ({
  storage: {},

  save: (data) => {
    set((state) => ({
      storage: { ...state.storage, ...data },
    }));
  },

  get: () => get().storage,

  remove: (key) => {
    const { [key]: _, ...rest } = get().storage;
    set({ storage: rest });
  },
}));

export default useStore;
