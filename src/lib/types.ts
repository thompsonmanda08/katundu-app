export type APIResponse = {
  success: boolean;
  message: string;
  data: DataResponse | any;
  status: number;
  [x: string]: unknown;
};

export type ErrorState = {
  status: boolean;
  message: string;
  type?: "error" | "success" | "info" | "warning";
  [x: string]: unknown;
};

export type Slide = {
  title: string;
  description: string;
  image: string;
  [x: string]: unknown;
};

export type User = {
  firstName: string;
  lastName: string;
  phone: string;
  role: "SENDER" | "TRANSPORTER";
  email?: string;
  username?: string;
  [x: string]: unknown;
};

export type Sender = User & {
  type: "SENDER"; // Indicates this is a sender
  pickUpLocation: string; // Starting point of the shipment
  deliveryLocation: string; // Destination of the shipment
};

export type Transporter = User & {
  type: "TRANSPORTER"; // Indicates this is a transporter
};

export type Cargo = {
  description: string; // Description of the cargo
  measure: string; // Quantity (liters/Kgs/Tons)
  packaging: string; // Type of packaging (bags, drums, pellets, etc.)
  containerSize: string; // Size of the container
  deliveryStatus: string; // Status of the delivery (e.g., Delivered, Pending)
};

export type AuthFormData = User & {
  password: string;
  confirmPassword?: string;
};

export type passwordResetProps = {
  email?: string;
  otp?: string;
  currentPassword?: string;
  password: string;
  confirmPassword: string;
};

export type ResetPasswordFormProps = {
  formData: passwordResetProps;
  handleInputChange: (e: any, fields?: unknown) => void;
  updateFormData: (fields: { [key: string]: unknown }) => void;
};

export type Address = {
  lineOne: string;
  lineTwo?: string;
  street: string;
  residence: string;
  city: string;
  state: string;
  country: any;
  [x: string]: any;
};

export type OptionItem = {
  id: string | number;
  name: string;
  label?: string;
  value?: string;
  [x: string]: unknown;
};

export type ShipmentRecord = {
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

export type PaymentDetails = {
  phone: string;
  amount?: string;
  reference?: string;
};

export type Delivery = {
  cargoDetails: ShipmentRecord;
  paymentDetails: PaymentDetails;
};

export type Transaction = {
  status: "PENDING" | "SUCCESS" | "FAILED";
  message: string;
  data?: unknown;
  [x: string]: unknown;
};

export type DataResponse = {
  hasNext: boolean;
  hasPrevious: boolean;
  numberOfElements: number;
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  [x: string]: unknown;
};
