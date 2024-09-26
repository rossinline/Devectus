/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx}"],
  darkMode: "class",
  theme: {
    borderRadius: {
      'default': '4px 4px 4px 4px'
    },
    extend: {
      colors: {
        // Light mode
        'lm-background': '#D9D9D9',
        'lm-foreground': '#CBC8C8',
        'lm-text': '#000000',
        'lm-accent': '#25964C',
        // Dark mode
        'dm-background': '#313131',
        'dm-foreground': '#222222',
        'dm-text': '#FFFFFF',
        'dm-accent': '#25964C'
      },
      animation: {
        wiggle: 'wiggle 1s ease-in-out infinite',
        spinSlow: 'spin 3s linear infinite',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-5deg)' },
          '50%': { transform: 'rotate(5deg)' },
        },
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
}

