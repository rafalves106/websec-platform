/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Paleta cockpit — preto/carbono como base, verde neon como destaque
        carbon: {
          950: '#0a0a0b',
          900: '#121214',
          800: '#1c1c1f',
          700: '#2a2a2e',
        },
        neon: {
          green: '#39ff88',
          red: '#ff3b3b',
        },
      },
      fontFamily: {
        // troque pela fonte técnica que preferir (ex: 'Rajdhani', 'Orbitron')
        display: ['var(--font-display)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
    },
  },
  plugins: [],
};
