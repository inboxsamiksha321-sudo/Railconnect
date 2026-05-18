export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        dept: {
          blue:   "#1a3a6b",
          mid:    "#2563b0",
          accent: "#f97316",
          light:  "#e8f0fc",
          green:  "#16a34a",
          yellow: "#d97706",
          red:    "#dc2626",
          gray:   "#64748b",
          bg:     "#f0f4fb",
        }
      },
      fontFamily: {
        syne: ["Syne", "sans-serif"],
        dm:   ["DM Sans", "sans-serif"]
      }
    },
  },
  plugins: [],
}