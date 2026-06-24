import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        greenMain: '#3d8b65',
        greenDeep: '#1a3a24',
        greenSoft: '#e6f4ed',
        ivory: '#faf8f2',
        container: '#f2f0ea',
        input: '#f5f2eb'
      },
      fontFamily: {
        pretendard: ['Pretendard', 'sans-serif']
      }
    }
  },
  plugins: []
} satisfies Config;
