/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary:         '#60a8f0',
        'primary-dark':  '#3a80d0',
        'primary-light': '#90c8ff',
        'primary-soft':  '#c8e8ff',
        dark:            '#1a2f5a',
        'dark-2':        '#1e3a6a',
        'dark-3':        '#264878',
        card:            '#1e3a6a',
        'card-2':        '#264878',
        border:          '#3a5a90',
        'border-2':      '#4a6aa0',
        glow:            '#60a8f025',
        textMuted:       '#8ab0d8',
        textSub:         '#b0d0f0',
      },
      boxShadow: {
        glow:      '0 0 20px #60a8f035',
        'glow-lg': '0 0 40px #60a8f028',
        card:      '0 4px 24px #00000030',
      },
      backgroundImage: {
        'card-gradient': 'linear-gradient(135deg, #1e3a6a 0%, #264878 100%)',
        'blue-gradient': 'linear-gradient(135deg, #3a5a90 0%, #60a8f0 100%)',
        'app-gradient':  'linear-gradient(145deg, #1a2f5a 0%, #1e3a6a 50%, #1a2f5a 100%)',
      }
    },
  },
  plugins: [],
}