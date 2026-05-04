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
        brand: {
          50: "#edfcf2",
          100: "#d3f8e0",
          200: "#aaf0c6",
          300: "#73e2a3",
          400: "#3acd7c",
          500: "#16b362",
          600: "#0a914e",
          700: "#087440",
          800: "#095c35",
          900: "#084c2d",
          950: "#032b18",
        },
        nutado: {
          green: "#0a6e3a",
          "green-dark": "#064d28",
          "green-light": "#0f8c4a",
          black: "#1a1a1a",
          white: "#ffffff",
          gray: {
            50: "#f9fafb",
            100: "#f3f4f6",
            200: "#e5e7eb",
            300: "#d1d5db",
            400: "#9ca3af",
            500: "#6b7280",
            600: "#4b5563",
            700: "#374151",
            800: "#1f2937",
            900: "#111827",
          },
        },
      },
      fontFamily: {
        sans: ["var(--font-figtree)", "system-ui", "sans-serif"],
        figtree: ["var(--font-figtree)", "system-ui", "sans-serif"],
        display: ["var(--font-figtree)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "brand-gradient":
          "linear-gradient(135deg, #032b18 0%, #0a6e3a 50%, #064d28 100%)",
        "brand-gradient-light":
          "linear-gradient(135deg, #0f8c4a 0%, #0a6e3a 100%)",
      },
      boxShadow: {
        card: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)",
        "card-hover":
          "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)",
        elevated:
          "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.5s ease-out",
        "slide-in-right": "slideInRight 0.4s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInRight: {
          "0%": { opacity: "0", transform: "translateX(20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
