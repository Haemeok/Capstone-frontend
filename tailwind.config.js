/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },

    extend: {
      colors: {
        olive: {
          DEFAULT: "#526c04",
          light: "#91c788",
          medium: "#609966",
          mint: "#43c278",
        },
        dark: {
          DEFAULT: "#2a2229",
          light: "#393a40",
        },
        beige: "#f7f4ee",
        brown: "#806f5c",
      },
      fontSize: {
        mm: "15px",
      },
      fontFamily: {
        "noto-sans-kr": ['"Noto Sans KR"', "sans-serif"],
      },
      borderColor: (theme) => ({
        ...theme("colors"),
        DEFAULT: theme("colors.gray.200", "currentColor"),
      }),
      backgroundColor: (theme) => ({
        ...theme("colors"),
      }),
      width: {
        36: "9rem",
        40: "10rem",
        50: "12.5rem",
      },
      height: {
        70: "17.5rem",
      },
      zIndex: {
        sticky: "10",
        header: "20",
        dropdown: "30",
        modal: "40",
        toast: "50",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "10%, 30%, 50%, 70%, 90%": { transform: "translateX(-3px)" },
          "20%, 40%, 60%, 80%": { transform: "translateX(3px)" },
        },
        "bounce-soft": {
          "0%, 100%": {
            transform: "translateY(0)",
            animationTimingFunction: "cubic-bezier(0.8, 0, 1, 1)",
          },
          "50%": {
            transform: "translateY(-6px)",
            animationTimingFunction: "cubic-bezier(0, 0, 0.2, 1)",
          },
        },
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        shake: "shake 0.5s ease-in-out infinite",
        "bounce-soft": "bounce-soft 1s infinite",
        shimmer: "shimmer 2.5s infinite",
      },
    },
  },
};
