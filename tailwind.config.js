module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'terminal-green': 'rgb(51, 255, 102)',
        'terminal-bg': 'rgb(13, 17, 23)',
        'terminal-dimText': 'rgb(99, 110, 123)',
      },
    },
  },
  plugins: [],
}