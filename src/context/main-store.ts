import { Sender, ShipmentRecord, Transporter, User } from "@/lib/types";
import { create } from "zustand";

export type MainStateStore = {
  user: Partial<User>;

  sendCargoFormData: ShipmentRecord | null;
  transportCargoFormData: ShipmentRecord | null;

  selectedShipment: Partial<ShipmentRecord> | null;

  // SETTERS
  setUser: (user: Partial<User>) => void; // user from session
  setSelectedShipment: (item: Partial<ShipmentRecord> | null) => void;

  setSendCargoFormData: (data: ShipmentRecord | null) => void;
  setTransportCargoFormData: (data: ShipmentRecord | null) => void;

  // ACTIONS
  updateSendCargoFormData: (data: Partial<ShipmentRecord>) => void;
  updateTransportCargoFormData: (data: Partial<ShipmentRecord>) => void;
  updateSelectedShipment: (data: Partial<ShipmentRecord>) => void;

  // CLEAR
  resetStore: () => void;
};

const INIT_STATE = {
  shipperName: "",
  shipperPhone: "",
  pickUpLocation: "",
  deliveryLocation: "",
  cargoDescription: "",
  cargoMeasure: "",
  packaging: "",
  containerSize: "",
  deliveryStatus: "",
  transporterName: "",
  transporterContact: "",
  pickUpCity: "",
  receiverName: "",
  receiverAddress: "",
  receiverPhoneOne: "",
  receiverPhoneTwo: "",
};

const INITIAL_STATE = {
  user: {
    firstName: "",
    lastName: "",
    mobile: "",
    email: "",
    username: "",
  },
  selectedShipment: null,
  sendCargoFormData: INIT_STATE as unknown as ShipmentRecord,
  transportCargoFormData: INIT_STATE as unknown as ShipmentRecord,
};

const useMainStore = create<MainStateStore>((set, get) => ({
  ...INITIAL_STATE,

  setUser: (userDetails: Partial<User>) => set({ user: userDetails }),
  setSendCargoFormData: (data: ShipmentRecord | null) =>
    set({ sendCargoFormData: data }),

  setTransportCargoFormData: (data: ShipmentRecord | null) =>
    set({ sendCargoFormData: data }),

  setSelectedShipment: (item: Partial<ShipmentRecord> | null) =>
    set({ selectedShipment: item }),

  // ACTIONS
  updateSelectedShipment: (data: Partial<ShipmentRecord>) =>
    set((state) => ({
      selectedShipment: {
        ...state.selectedShipment,
        ...data,
      } as unknown as ShipmentRecord,
    })),

  updateSendCargoFormData: (data: Partial<ShipmentRecord>) =>
    set((state) => ({
      sendCargoFormData: {
        ...state.sendCargoFormData,
        ...data,
      } as unknown as ShipmentRecord,
    })),

  updateTransportCargoFormData: (data: Partial<ShipmentRecord>) =>
    set((state) => ({
      transportCargoFormData: {
        ...state.transportCargoFormData,
        ...data,
      } as unknown as ShipmentRecord,
    })),

  // CLEAR
  resetStore: () =>
    set({
      ...INITIAL_STATE,
    }),
}));

export default useMainStore;
