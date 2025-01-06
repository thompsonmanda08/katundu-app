import { create } from "zustand";

export type NavigationState = {
  isMobileMenuOpen: boolean;
  isSideNavCollapsed: boolean;

  // SETTERS

  setIsMobileMenuOpen: (open: boolean) => void;
  setIsSideNavCollapsed: (open: boolean) => void;
  toggleMobileMenu: () => void;
  toggleSideNav: () => void;
};

const INITIAL_STATE = {
  isMobileMenuOpen: false,
  isSideNavCollapsed: false,
};

const useNavigationStore = create<NavigationState>((set, get) => ({
  ...INITIAL_STATE,

  //  SETTERS
  setIsMobileMenuOpen: (open: boolean) => set({ isMobileMenuOpen: open }),
  setIsSideNavCollapsed: (open: boolean) => set({ isSideNavCollapsed: open }),

  toggleMobileMenu: () => {
    set((state) => ({
      isMobileMenuOpen: !state.isMobileMenuOpen,
    }));
  },

  toggleSideNav: () => {
    set((state) => ({
      isSideNavCollapsed: !state.isSideNavCollapsed,
    }));
  },

  // CLEAR
  clearContext: () =>
    set({
      ...INITIAL_STATE,
    }),
}));

export default useNavigationStore;
