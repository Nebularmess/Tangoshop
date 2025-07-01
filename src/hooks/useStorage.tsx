import { create } from 'zustand';

type Storage = Record<string, any>;

interface StoreState {
  storage: Storage;
  currentUser: any | null;
  authToken: string | null;

  save: (data: Storage) => void;
  get: () => Storage;
  remove: (key: string) => void;
  clear: () => void;
  setCurrentUser: (user: any) => void;
  setAuthToken: (token: string) => void;
  getCurrentUser: () => any | null;
  getAuthToken: () => string | null;
}

const useStore = create<StoreState>((set, get) => ({
  storage: {},
  currentUser: null,
  authToken: null,

  save: (data) => {
    set((state) => {
      const newStorage = { ...state.storage, ...data };
      
      // También actualizar campos específicos si existen en data
      const updates: any = { storage: newStorage };
      
      if (data.currentUser !== undefined) {
        updates.currentUser = data.currentUser;
      }
      
      if (data.authToken !== undefined) {
        updates.authToken = data.authToken;
      }
      
      return updates;
    });
  },

  get: () => get().storage,

  remove: (key) => {
    set((state) => {
      const { [key]: _, ...rest } = state.storage;
      const updates: any = { storage: rest };
      
      // También limpiar campos específicos si coinciden con la key
      if (key === 'currentUser') {
        updates.currentUser = null;
      }
      
      if (key === 'authToken') {
        updates.authToken = null;
      }
      
      return updates;
    });
  },

  clear: () => {
    set({
      storage: {},
      currentUser: null,
      authToken: null,
    });
  },

  setCurrentUser: (user) => {
    set((state) => ({
      currentUser: user,
      storage: { ...state.storage, currentUser: user },
    }));
  },

  setAuthToken: (token) => {
    set((state) => ({
      authToken: token,
      storage: { ...state.storage, authToken: token },
    }));
  },

  getCurrentUser: () => get().currentUser,

  getAuthToken: () => get().authToken,
}));

export default useStore;