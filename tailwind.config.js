/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      gradients: {
        'purple-amber': 'linear-gradient(to right, #9333ea, #a855f7, #fbbf24)',
      },
    },
  },
  plugins: [],
};
