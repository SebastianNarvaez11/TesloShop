import { create } from "zustand";

interface IStore {
  isMenuOpen: boolean;
  openMenu: () => void;
  closeMenu: () => void;
}

export const useUIStore = create<IStore>()((set) => ({
  isMenuOpen: false,

  openMenu: () =>
    set({
      isMenuOpen: true,
    }),

  closeMenu: () =>
    set({
      isMenuOpen: false,
    }),
}));
