/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#151515",
        "ink-soft": "#3a3a3a",
        sand: "#f6f1e8",
        "sand-2": "#efe6d8",
        sunrise: "#ff6b35",
        mint: "#2ec4b6",
        sun: "#ffd166",
        sky: "#5b7cfa",
      },
      boxShadow: {
        card: "0 18px 40px rgba(25, 22, 18, 0.12)",
      },
      borderRadius: {
        xl: "24px",
      },
      fontFamily: {
        title: ["var(--font-title)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
