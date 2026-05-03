/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          brand: {
            darkBlue: "#1277C5",
            lightBlue: "#C4DFEA",
            bgLight: "#FAFBFD",
            bgSoft: "#E8EFF4",
            /** סרגל כלים תחתון — תואם מוקאפ (#0070C0) */
            toolbarBar: "#0070C0",
            toolbarBlue: "#1579C8",
            toolbarBlueDeep: "#0F62A8",
            toolbarToggleTrack: "rgba(12, 74, 128, 0.45)",
            toolbarToggleOn: "#0A4A7C",
          },
        },
        boxShadow: {
          toolbarBar: "0 4px 18px rgba(15, 80, 130, 0.28), inset 0 1px 0 rgba(255, 255, 255, 0.12)",
          toolbarField: "0 2px 8px rgba(15, 23, 42, 0.08), 0 1px 2px rgba(15, 23, 42, 0.06)",
          toolbarToggleOn: "inset 0 1px 0 rgba(255, 255, 255, 0.18), 0 1px 3px rgba(0, 0, 0, 0.12)",
        },
      },
    },
    plugins: [],
  }