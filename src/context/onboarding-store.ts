import { authenticateUser } from "@/app/_actions/auth-actions";
import { revokeAccessToken } from "@/app/_actions/config-actions";
import { APIResponse, AuthFormData, User } from "@/lib/types";
import { FormEvent } from "react";

import { create } from "zustand";

const INITIAL_STATE = {
  isLoading: false,

  user: {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  },

  loginDetails: {
    phone: "",
    password: "",
  },
};

const useOnBoardingStore = create<OnboardingState>()(
  // persist(
  (set, get) => ({
    ...INITIAL_STATE,

    //SETTERS

    setUser: (userDetails: Partial<User>) => set({ user: userDetails }),
    setIsLoading: (isLoading: boolean) => set({ isLoading }),

    // METHODS AND ACTIONS
    updateUserFields(fields: Partial<User>) {
      set((state) => ({
        user: {
          ...state?.user,
          ...fields,
        },
      }));
    },

    updateLoginDetails(fields: Partial<AuthFormData>) {
      set((state) => ({
        loginDetails: {
          ...state?.loginDetails,
          ...fields,
        },
      }));
    },

    logUserIn: async (loginDetails: AuthFormData) => {
      set({ isLoading: true });

      const response: APIResponse = await authenticateUser(loginDetails);

      if (response?.success) {
        window.location.reload();
      }

      set({ isLoading: false });
      return response;
    },

    logUserOut: async () => {
      await revokeAccessToken();
    },

    // Clear the current context
    clearContext: () => {
      set(() => ({ ...INITIAL_STATE }));
    },
  })
);

// STATE VARIABLES
type OnboardingState = {
  // GETTER STATE
  user: Partial<User>;
  loginDetails: Partial<AuthFormData>;
  isLoading: boolean;

  // SETTERS
  setUser: (userDetails: Partial<User>) => void;
  setIsLoading: (isLoading: boolean) => void;

  // METHODS AND ACTIONS
  updateUserFields: (fields: Partial<User>) => void;
  updateLoginDetails: (fields: Partial<User>) => void;
  logUserIn: (formData: AuthFormData) => Promise<APIResponse>;

  logUserOut: () => void;
  clearContext: () => void;
};

export default useOnBoardingStore;
