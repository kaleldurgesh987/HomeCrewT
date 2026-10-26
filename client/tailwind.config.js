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
          green: {
            DEFAULT: '#0B5D43',
            50: '#F0F9F5',
            100: '#D6ECE3',
            200: '#ADDAC9',
            300: '#7AC1A8',
            400: '#3D9F80',
            500: '#0B5D43',
            600: '#094E38',
            700: '#073F2E',
            800: '#053123',
            900: '#032117',
          },
          gold: {
            DEFAULT: '#F9B000',
            50: '#FFF9E6',
            100: '#FFF0B8',
            200: '#FFE68A',
            300: '#FFD94D',
            400: '#F9B000',
            500: '#E09E00',
            600: '#B88200',
            700: '#8F6500',
            800: '#664800',
          },
          cream: '#FAFBF8',
          slate: '#1E293B',
          card: '#FFFFFF',
          border: '#E2E8F0',
        }
      },
      fontFamily: {
        heading: ['Poppins', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(11, 93, 67, 0.08), 0 2px 6px -1px rgba(0, 0, 0, 0.04)',
        'card': '0 10px 30px -4px rgba(11, 93, 67, 0.1), 0 4px 8px -2px rgba(0, 0, 0, 0.05)',
        'glow-gold': '0 0 20px rgba(249, 176, 0, 0.35)',
        'glow-green': '0 0 25px rgba(11, 93, 67, 0.25)',
      }
    },
  },
  plugins: [],
}
