import { OptionItem } from "./types";

export const AUTH_SESSION = "__com.karundu__";

export const PASSWORD_PATTERN =
  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;

// REGEX
export const MTN_NO =
  /^(?:(?:\+?26|0?26)?096|\d{5})(\d{7})|(?:(?:\+?26|0?26)?076|\d{5})(\d{7})$/;

export const AIRTEL_NO =
  /^(?:(?:\+?26|0?26)?097|\d{5})(\d{7})|(?:(?:\+?26|0?26)?077|\d{5})(\d{7})$/;

export const ZAMTEL_NO =
  /^(?:(?:\+?26|0?26)?095|\d{5})(\d{7})|(?:(?:\+?26|0?26)?075|\d{5})(\d{7})$/;

export const PROVINCES: OptionItem[] = [
  { id: "Lusaka_Province", name: "Lusaka Province" },
  { id: "Central_Province", name: "Central Province" },
  { id: "Copperbelt_Province", name: "Copperbelt Province" },
  { id: "Eastern_Province", name: "Eastern Province" },
  { id: "Luapula_Province", name: "Luapula Province" },
  { id: "Muchinga_Province", name: "Muchinga Province" },
  { id: "Northern_Province", name: "Northern Province" },
  { id: "North-Western", name: "North-Western Province" },
  { id: "Southern_Province", name: "Southern Province" },
  { id: "Western_Province", name: "Western Province" },
];

export const ALLOWED_FILE_TYPES = ["image/png", "image/jpeg"];

export const MAX_FILE_SIZE = 5000000; // 5MB

export const QUERY_KEYS = {
  CARGO_LISTINGS: "cargo-list",
};

export const whileTabInView = {
  opacity: [0, 1],
  scaleX: [0.8, 1],
  transition: {
    type: "spring",
    stiffness: 300,
    ease: "easeInOut",
    duration: 0.2,
  },
};

export const containerVariants = {
  initial: { opacity: 0, scaleX: 0.8 },
  animate: {
    opacity: 1,
    scaleX: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      ease: "easeInOut",
      duration: 0.2,
    },
  },
  exit: { opacity: 0, x: 0 },
};

export const slideDownInView = {
  hidden: {
    opacity: 0,
    height: 0,
    transition: {
      duration: 0.3,
      ease: "easeInOut",
    },
  },
  visible: {
    height: "auto",
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: "easeInOut",
    },
  },
};
