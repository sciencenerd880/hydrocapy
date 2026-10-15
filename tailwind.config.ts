import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        pool: {
          light: "#E0F7FA",
          surface: "#38BDF8",
          water: "#0284C7",
          deep: "#0369A1",
        },
        capy: {
          fur: "#C2884A",
          dark: "#8B572A",
          snout: "#6B3E11",
          belly: "#E5B887",
        },
        donut: {
          pink: "#FB7185",
          frosting: "#F43F5E",
          sprinkle: "#FBBF24",
        },
        cream: {
          50: "#FAF8F5",
          100: "#F5F2EB",
          200: "#EBE5D8",
        },
      },
      animation: {
        "float-gentle": "float 3s ease-in-out infinite",
        "ripple-spread": "ripple 1.5s cubic-bezier(0, 0.2, 0.8, 1) infinite",
        "wave-pulse": "wave 4s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "50%": { transform: "translateY(-6px) rotate(1.5deg)" },
        },
        ripple: {
          "0%": { transform: "scale(0.8)", opacity: "0.8" },
          "100%": { transform: "scale(2.2)", opacity: "0" },
        },
        wave: {
          "0%, 100%": { transform: "translateX(0)" },
          "50%": { transform: "translateX(-25px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
