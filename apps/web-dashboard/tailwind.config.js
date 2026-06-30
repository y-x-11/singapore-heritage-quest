/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        merlion: '#E63946',
        teal: '#2A9D8F',
        sunshine: '#FFD166',
        gold: '#F4A261',
        navy: '#1D3557',
        cream: '#FFF8F0',
      },
      fontFamily: {
        heading: ['Nunito', 'sans-serif'],
        body: ['Quicksand', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
