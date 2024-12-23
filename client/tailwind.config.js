module.exports = {
  plugins: [require('tailwindcss-primeui')],
  theme: {
    extend: {
      spacing: {
        '1/9': 'calc(100% / 9)',
      },
      borderRadius: {
        '1/2': '50%',
      },
    },
    animation: {
      'wrong-clicked': 'wrong-clicked 2s ease-in-out',
    },
    keyframes: {
      'wrong-clicked': {
        '0%': { backgroundColor: 'currentColor' },
        '25%': { backgroundColor: 'var(--p-red-200)' },
        '50%': { backgroundColor: 'currentColor' },
        '75%': { backgroundColor: 'var(--p-red-200)' },
        '100%': { backgroundColor: 'currentColor' },
      },
    },
  },
};
