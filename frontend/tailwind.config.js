/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          900: '#0B1526',
          800: '#12213B',
          700: '#1B2E4D',
          600: '#28406A',
        },
        signal: {
          500: '#F5A623',
          600: '#DC8E10',
        },
        mist: {
          50: '#F6F8FB',
          100: '#EDF1F7',
          200: '#DCE3EE',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
};
