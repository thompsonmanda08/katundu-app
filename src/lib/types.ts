type APIResponse = {
  success: boolean;
  message: string;
  data: any;
  status: number;
  [x: string]: unknown;
};

type ErrorState = {
  status: boolean;
  message: string;
  type?: "error" | "success" | "info" | "warning";
  [x: string]: unknown;
};

type Slide = {
  title: string;
  description: string;
  image: string;
  [x: string]: unknown;
};

type User = {
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  username?: string;
  [x: string]: unknown;
};

type Sender = User & {
  type: "SENDER"; // Indicates this is a sender
  pickUpLocation: string; // Starting point of the shipment
  deliveryLocation: string; // Destination of the shipment
};

type Transporter = User & {
  type: "TRANSPORTER"; // Indicates this is a transporter
};

type Cargo = {
  description: string; // Description of the cargo
  measure: string; // Quantity (liters/Kgs/Tons)
  packaging: string; // Type of packaging (bags, drums, pellets, etc.)
  containerSize: string; // Size of the container
  deliveryStatus: string; // Status of the delivery (e.g., Delivered, Pending)
};

type AuthFormData = User & {
  password: string;
  confirmPassword?: string;
};

type passwordResetProps = {
  email?: string;
  otp?: string;
  currentPassword?: string;
  password: string;
  confirmPassword: string;
};

type ResetPasswordFormProps = {
  formData: passwordResetProps;
  handleInputChange: (e: any, fields?: unknown) => void;
  updateFormData: (fields: { [key: string]: unknown }) => void;
};

type Coordinates = {
  latitude: number | string;
  longitude: number | string;
  [x: string]: any;
};

type Address = {
  lineOne: string;
  lineTwo?: string;
  street: string;
  residence: string;
  city: string;
  state: string;
  country: any;
  coordinates: Coordinates;
  [x: string]: any;
};

type Session = {
  user: User;
  role: string[];
  accessToken: string;
  [x: string]: any;
};

type OptionItem = {
  id: string | number;
  name: string;
  label?: string;
  value?: string;
  code?: string;
  [x: string]: any;
};

type ShipmentRecord = {
  shipperName: string; // Name of the shipper
  shipperPhone: string; // Shipper's contact number
  pickUpLocation: string; // Starting point of the shipment
  deliveryLocation: string; // Destination of the shipment
  cargoDescription: string; // Description of the cargo
  cargoMeasure: string; // Quantity (liters/Kgs/Tons)
  packaging: string; // Type of packaging (bags, drums, pellets, etc.)
  containerSize: string; // Size of the container
  deliveryStatus: string; // Status of the delivery (e.g., Delivered, Pending)
  transporterName: string; // Name of the transporter
  transporterContact: string; // Transporter's contact number
};

export type {
  Address,
  APIResponse,
  User,
  ErrorState,
  Slide,
  ResetPasswordFormProps,
  ShipmentRecord,
  Sender,
  Transporter,
  Cargo,
  Session,
  OptionItem,
  passwordResetProps,
  AuthFormData,
};
