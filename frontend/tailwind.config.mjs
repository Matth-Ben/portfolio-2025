/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
    './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'
  ],
  safelist: [
    'bg-primary',
    'bg-secondary', 
    'text-primary',
    'text-secondary',
    'border-primary',
    'border-secondary',
    'ts-title',
    'ts-body',
    'ts-little',
    'ts-big',
    'font-ibm-plex-mono'
  ],
  theme: {
    extend: {
      fontFamily: {
        'ibm-plex-mono': ['IBM Plex Mono', 'Courier New', 'monospace'],
      },
      colors: {
        primary: '#232323',
        secondary: '#EAE8DE',
      },
      fontSize: {
        title: ['8rem', { lineHeight: '6rem' }],
        body: ['1.4rem', { lineHeight: '1.4rem' }],
        little: ['1.2rem', { lineHeight: '1' }],
        big: ['20rem', { lineHeight: '16rem' }],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
} 