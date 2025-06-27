import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './styles/**/*.{scss,css}',
    './app/directions/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {}
  },
  plugins: [],
}

export default config 