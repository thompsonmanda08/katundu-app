import { OptionItem } from "./types";

export const AUTH_SESSION = "__com.katundu__";

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

export const DISTRICTS: OptionItem[] = [
  { id: "chadiza", name: "Chadiza", province: "Eastern_Province" },
  { id: "chama", name: "Chama", province: "Muchinga_Province" },
  { id: "chambishi", name: "Chambishi", province: "Copperbelt_Province" },
  { id: "chibombo", name: "Chibombo", province: "Central_Province" },
  {
    id: "chililabombwe",
    name: "Chililabombwe",
    province: "Copperbelt_Province",
  },
  { id: "chingola", name: "Chingola", province: "Copperbelt_Province" },
  { id: "chinsali", name: "Chinsali", province: "Muchinga_Province" },
  { id: "chipata", name: "Chipata", province: "Eastern_Province" },
  { id: "choma", name: "Choma", province: "Southern_Province" },
  { id: "chongwe", name: "Chongwe", province: "Lusaka_Province" },
  { id: "gwembe", name: "Gwembe", province: "Southern_Province" },
  { id: "isoka", name: "Isoka", province: "Muchinga_Province" },
  { id: "itezhi-tezhi", name: "Itezhi-Tezhi", province: "Central_Province" },
  { id: "kabompo", name: "Kabompo", province: "North-Western_Province" },
  { id: "kabwe", name: "Kabwe", province: "Central_Province" },
  { id: "kafue", name: "Kafue", province: "Lusaka_Province" },
  { id: "kalabo", name: "Kalabo", province: "Western_Province" },
  { id: "kalengwa", name: "Kalengwa", province: "North-Western_Province" },
  { id: "kalulushi", name: "Kalulushi", province: "Copperbelt_Province" },
  { id: "kaoma", name: "Kaoma", province: "Western_Province" },
  { id: "kapiri-mposhi", name: "Kapiri Mposhi", province: "Central_Province" },
  { id: "kaputa", name: "Kaputa", province: "Northern_Province" },
  { id: "kasama", name: "Kasama", province: "Northern_Province" },
  { id: "kasempa", name: "Kasempa", province: "North-Western_Province" },
  { id: "kawambwa", name: "Kawambwa", province: "Luapula_Province" },
  { id: "kitwe", name: "Kitwe", province: "Copperbelt_Province" },
  { id: "limulunga", name: "Limulunga", province: "Western_Province" },
  { id: "livingstone", name: "Livingstone", province: "Southern_Province" },
  { id: "luangwa", name: "Luangwa", province: "Lusaka_Province" },
  { id: "luanshya", name: "Luanshya", province: "Copperbelt_Province" },
  { id: "lukulu", name: "Lukulu", province: "Western_Province" },
  { id: "lundazi", name: "Lundazi", province: "Eastern_Province" },
  { id: "lusaka", name: "Lusaka", province: "Lusaka_Province" },
  { id: "luwingu", name: "Luwingu", province: "Northern_Province" },
  { id: "maamba", name: "Maamba", province: "Southern_Province" },
  { id: "mansa", name: "Mansa", province: "Luapula_Province" },
  { id: "mazabuka", name: "Mazabuka", province: "Southern_Province" },
  { id: "mbala", name: "Mbala", province: "Northern_Province" },
  { id: "mkushi", name: "Mkushi", province: "Central_Province" },
  { id: "mongu", name: "Mongu", province: "Western_Province" },
  { id: "monze", name: "Monze", province: "Southern_Province" },
  { id: "mpika", name: "Mpika", province: "Muchinga_Province" },
  { id: "mpongwe", name: "Mpongwe", province: "Copperbelt_Province" },
  { id: "mporokoso", name: "Mporokoso", province: "Northern_Province" },
  { id: "mpulungu", name: "Mpulungu", province: "Northern_Province" },
  { id: "mufulira", name: "Mufulira", province: "Copperbelt_Province" },
  { id: "mufumbwe", name: "Mufumbwe", province: "North-Western_Province" },
  { id: "mumbwa", name: "Mumbwa", province: "Central_Province" },
  { id: "mungwi", name: "Mungwi", province: "Northern_Province" },
  { id: "mwense", name: "Mwense", province: "Luapula_Province" },
  { id: "mwinilunga", name: "Mwinilunga", province: "North-Western_Province" },
  { id: "nakonde", name: "Nakonde", province: "Muchinga_Province" },
  { id: "namwala", name: "Namwala", province: "Southern_Province" },
  { id: "nchelenge", name: "Nchelenge", province: "Luapula_Province" },
  { id: "ndola", name: "Ndola", province: "Copperbelt_Province" },
  { id: "nyimba", name: "Nyimba", province: "Eastern_Province" },
  { id: "petauke", name: "Petauke", province: "Eastern_Province" },
  { id: "samfya", name: "Samfya", province: "Luapula_Province" },
  { id: "senanga", name: "Senanga", province: "Western_Province" },
  { id: "serenje", name: "Serenje", province: "Central_Province" },
  { id: "sesheke", name: "Sesheke", province: "Western_Province" },
  { id: "siavonga", name: "Siavonga", province: "Southern_Province" },
  { id: "sinazongwe", name: "Sinazongwe", province: "Southern_Province" },
  { id: "solwezi", name: "Solwezi", province: "North-Western_Province" },
  { id: "zambezi", name: "Zambezi", province: "North-Western_Province" },
];

export const ALLOWED_FILE_TYPES = ["image/png", "image/jpeg"];

export const MAX_FILE_SIZE = 5000000; // 5MB

export const QUERY_KEYS = {
  CARGO_LISTINGS: "cargo-list",
  CITIES: "cities-list",
  PROFILE: "user-profile",
  POSTS: "deliveries-list",
  USER_POSTS: "user-deliveries-list",
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
