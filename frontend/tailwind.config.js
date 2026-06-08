/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#23231f",
        muted: "#737068",
        line: "#dad5cb",
        brand: "#d85b3f",
        action: "#3157d5",
        "action-hover": "#2547b8",
        "action-soft": "#edf1ff",
        bridge: "#3157d5",
        warning: "#a9682b",
        danger: "#b5483f",
        success: "#2f7d57",
      },
      boxShadow: {
        panel: "0 24px 70px rgba(73, 62, 46, 0.08)",
        input: "0 0 0 3px rgba(49, 87, 213, 0.12), 0 18px 40px rgba(73, 62, 46, 0.08)",
        button: "0 14px 30px rgba(49, 87, 213, 0.28)",
        workflow: "0 28px 70px rgba(35, 35, 31, 0.18)",
        card: "0 20px 45px rgba(49, 87, 213, 0.14)",
      },
    },
  },
  plugins: [],
};
