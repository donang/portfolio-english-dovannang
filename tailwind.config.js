/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#05050A",
        surface: "#0A0A10",
        surfaceLight: "#12121A",
        primary: "#ff2a85",
        secondary: "#7000FF",
        accent: "#FF5E00",
        textMain: "#ffffff",
        textMuted: "#a0a0ab",
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Inter', 'sans-serif'],
        script: ['"SVN-Janelotus"', '"Platinum Signature"', 'cursive'],
      },
      boxShadow: {
        '3d': '0 10px 30px -10px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.1)',
        'glow': '0 0 20px rgba(255,42,133,0.3)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-glow': 'radial-gradient(circle at 50% 50%, rgba(255, 42, 133, 0.15) 0%, rgba(10, 11, 16, 0) 50%)',
      }
    },
  },
  plugins: [],
}
