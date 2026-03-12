/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary:    '#3b82f6',
        'primary-dark': '#1d4ed8',
        'primary-light': '#60a5fa',
        dark:       '#060d1f',
        'dark-2':   '#0a1628',
        'dark-3':   '#0f1f3d',
        card:       '#0d1f3c',
        'card-2':   '#111f3a',
        border:     '#1e3a5f',
        'border-2': '#2a4a7f',
        glow:       '#3b82f620',
        textMuted:  '#64748b',
        textSub:    '#94a3b8',
      },
      boxShadow: {
        glow:    '0 0 20px #3b82f630',
        'glow-lg': '0 0 40px #3b82f625',
        card:    '0 4px 24px #00000040',
      },
      backgroundImage: {
        'card-gradient': 'linear-gradient(135deg, #0d1f3c 0%, #111f3a 100%)',
        'blue-gradient': 'linear-gradient(135deg, #1e3a5f 0%, #1e40af 100%)',
        'app-gradient':  'linear-gradient(135deg, #060d1f 0%, #0a1628 50%, #060d1f 100%)',
      }
    },
  },
  plugins: [],
}