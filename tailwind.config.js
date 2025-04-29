/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        olive: {
          DEFAULT: '#526c04',
          light: '#609966',
        },
        'olive-light-bg': '#91c788',
        dark: {
          DEFAULT: '#2a2229',
          light: '#393a40',
        },
        beige: '#f7f4ee',
        brown: '#806f5c',
      },
      fontSize: {
        mm: '15px',
      },
      fontFamily: {
        'noto-sans-kr': ['"Noto Sans KR"', 'sans-serif'],
      },
      borderColor: (theme) => ({
        ...theme('colors'),
        DEFAULT: theme('colors.gray.200', 'currentColor'),
      }),
      backgroundColor: (theme) => ({
        ...theme('colors'),
      }),
    },
  },
};
