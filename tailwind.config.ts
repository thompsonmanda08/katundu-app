import { nextui } from "@nextui-org/theme";
import type { Config } from "tailwindcss";
// import { nextui } from "@nextui-org/react";
import tailwindCSSAnimate from "tailwindcss-animate";

const DEFAULT_SHADES = {
  50: "#DBDEFF",
  100: "#C9CEFD",
  200: "#B2B9FD",
  300: "#8893F8",
  400: "#616FFA",
  500: "#4D5DFA",
  600: "#4051F8",
  700: "#343D9A",
  800: "#2B316E",
  900: "#252952",
};

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)"],
      },
      // colors: {
      //   background: "hsl(var(--background))",
      //   foreground: "hsl(var(--foreground))",
      //   card: {
      //     DEFAULT: "hsl(var(--card))",
      //     foreground: "hsl(var(--card-foreground))",
      //   },
      //   popover: {
      //     DEFAULT: "hsl(var(--popover))",
      //     foreground: "hsl(var(--popover-foreground))",
      //   },
      //   primary: {
      //     DEFAULT: "hsl(var(--primary))",
      //     foreground: "hsl(var(--primary-foreground))",
      //   },
      //   secondary: {
      //     DEFAULT: "hsl(var(--secondary))",
      //     foreground: "hsl(var(--secondary-foreground))",
      //   },
      //   muted: {
      //     DEFAULT: "hsl(var(--muted))",
      //     foreground: "hsl(var(--muted-foreground))",
      //   },
      //   accent: {
      //     DEFAULT: "hsl(var(--accent))",
      //     foreground: "hsl(var(--accent-foreground))",
      //   },
      //   destructive: {
      //     DEFAULT: "hsl(var(--destructive))",
      //     foreground: "hsl(var(--destructive-foreground))",
      //   },
      //   border: "hsl(var(--border))",
      //   input: "hsl(var(--input))",
      //   ring: "hsl(var(--ring))",
      //   chart: {
      //     "1": "hsl(var(--chart-1))",
      //     "2": "hsl(var(--chart-2))",
      //     "3": "hsl(var(--chart-3))",
      //     "4": "hsl(var(--chart-4))",
      //     "5": "hsl(var(--chart-5))",
      //   },
      //   skeleton: {
      //     light: "#f4f4f5",
      //     dark: "#143642",
      //   },
      // },
      // borderRadius: {
      //   lg: "var(--radius)",
      //   md: "calc(var(--radius) - 2px)",
      //   sm: "calc(var(--radius) - 4px)",
      // },
    },
  },
  plugins: [
    tailwindCSSAnimate,
    nextui({
      addCommonColors: true,
      themes: {
        light: {
          colors: {
            primary: {
              DEFAULT: "#4D5DFA",
              foreground: "#FFFFFF",
            },
            default: {
              DEFAULT: "#C9CEFD",
              foreground: "#4D5DFA",
              ...DEFAULT_SHADES,
            },
          },
        },

        dark: {
          colors: {
            primary: {
              DEFAULT: "#4D5DFA",
              foreground: "#FFFFFF",
            },
          },
        },
      },
    }),
  ],
};
export default config;
