module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        instrument: ['"Instrument Sans"', 'sans-serif'],
      },
      colors: {
        primary: '#264FD6',
        secondary: '#585858',
        gray: '#B2B2B2'
      },
      maxWidth: {
        '3xl': '860px',
        '8xl': '1440px',
      },
      width: {
        '70': '270px',
        '3xl': '860px',
      },
      height: {
        '70': '270px'
      }
    },
  },
  plugins: [],
};
