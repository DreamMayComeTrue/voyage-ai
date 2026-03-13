/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary:         '#1e6fd9',
        'primary-dark':  '#1458b0',
        'primary-light': '#4a9fe8',
        'primary-soft':  '#d0e8ff',
        surface:         '#f0f6ff',
        'surface-2':     '#e0ecff',
        card:            '#ffffff',
        border:          '#c0d8f0',
        'border-2':      '#90c0e8',
        textMain:        '#0a1628',
        textMuted:       '#5a7a9f',
        textSub:         '#8aaac8',
      },
      boxShadow: {
        card:    '0 2px 16px #1e6fd915',
        'card-lg': '0 4px 32px #1e6fd920',
        glow:    '0 0 20px #1e6fd925',
      },
      backgroundImage: {
        'blue-gradient':  'linear-gradient(135deg, #1e6fd9 0%, #4a9fe8 100%)',
        'soft-gradient':  'linear-gradient(135deg, #f0f6ff 0%, #e0ecff 100%)',
        'card-gradient':  'linear-gradient(135deg, #ffffff 0%, #f0f6ff 100%)',
      }
    },
  },
  plugins: [],
}