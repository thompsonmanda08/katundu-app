import { Sender, Transporter, User } from "@/lib/types";
import { create } from "zustand";

export type MainStateStore = {
  user: Partial<User>;
  sender: Partial<Sender>;
  transporter: Partial<Transporter>;

  // SETTERS
  setUser: (userDetails: Partial<User>) => void; // user from session
  resetStore: () => void;
};

const INITIAL_STATE = {
  user: {
    firstName: "",
    lastName: "",
    mobile: "",
    email: "",
    username: "",
  },
  sender: {
    pickUpLocation: "",
    deliveryLocation: "",
  },
  transporter: {
    transporterName: "",
    transporterContact: "",
  },
};

const useMainStore = create<MainStateStore>((set, get) => ({
  ...INITIAL_STATE,

  setUser: (userDetails: Partial<User>) => set({ user: userDetails }),

  // CLEAR
  resetStore: () =>
    set({
      ...INITIAL_STATE,
    }),
}));

export default useMainStore;
