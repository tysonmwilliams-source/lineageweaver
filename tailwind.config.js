/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Custom colors for house coding and legitimacy status
        legitimate: '#22c55e', // green
        bastard: '#f59e0b',    // amber/orange
        adopted: '#3b82f6',    // blue
        unknown: '#6b7280',    // gray
      },
    },
  },
  plugins: [],
}
