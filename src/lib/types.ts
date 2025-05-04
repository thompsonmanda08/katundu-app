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
  role: "SENDER" | "TRANSPORTER";
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

type Address = {
  lineOne: string;
  lineTwo?: string;
  street: string;
  residence: string;
  city: string;
  state: string;
  country: any;
  [x: string]: any;
};

type OptionItem = {
  id: string | number;
  name: string;
  label?: string;
  value?: string;
  [x: string]: unknown;
};

type ShipmentRecord = {
  // SHIPPER DETAILS

  contacts?: {
    sender?: {
      firstName?: string; // First Name of the shipper
      lastName?: string; // Last Name of the shipper
      phone?: string; // Shipper's contact number
      [x: string]: string | any;
    };

    receiver?: {
      name?: string; // Name of the receiver
      phone?: string; // Receiver's contact number
      [x: string]: string | any;
    };

    transporter?: {
      name?: string; // Name of the receiver
      phone?: string; // Receiver's contact number
      [x: string]: string | any;
    };
  };

  // CARGO DETAILS
  pickUpCity: string; // Starting point of the shipment
  pickUpLocation: string; // Starting point of the shipment
  deliveryCity: string; // Destination of the shipment
  deliveryLocation: string; // Destination of the shipment
  cargoDescription: string; // Description of the cargo
  cargoMeasure: string; // Quantity (liters/Kgs/Tons)
  packaging: string; // Type of packaging (bags, drums, pellets, etc.)
  containerSize: string; // Size of the container
  quantity: string;

  // DELIVERY DETAILS
  isPublished: boolean; // Indicates if the delivery is published for transporters to see
  transportationType?: string; // Type of transportation (e.g., Air, Sea, Land)
  transportDate?: string; // Date of transportation
  deliveryStatus: string; // Status of the delivery (e.g., READY | IN TRANSIT | DELIVERED)
  deliverId: string; // Unique identifier for the delivery
  id: string; // Unique identifier for the delivery

  // TRANSPORTER DETAILS
  transporterName?: string; // Name of the transporter
  transporterContact?: string; // Transporter's contact number

  // RECEIVER DETAILS
  receiverName: string;
  receiverAddress: string;
  receiverPhoneOne: string;
  receiverPhoneTwo: string;

  // PAYMENT DETAILS
  paymentPhone: string;
  reference: string;

  [x: string]: unknown;
};

type PaymentDetails = {
  phone: string;
  amount?: string;
  reference?: string;
};

type Delivery = {
  cargoDetails: ShipmentRecord;
  paymentDetails: PaymentDetails;
};

type Transaction = {
  status: "PENDING" | "SUCCESS" | "FAILED";
  message: string;
  data?: unknown;
  [x: string]: unknown;
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
  OptionItem,
  passwordResetProps,
  AuthFormData,
  Delivery,
  Transaction,
  PaymentDetails,
};
