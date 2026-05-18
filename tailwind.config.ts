import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
        accent: ['Instrument Serif', 'Georgia', 'serif'],
      },
      fontWeight: {
        thin: '100',
        regular: '400',
        medium: '500',
        bold: '700',
        black: '900',
      },
      lineHeight: {
        tight: '1.1',
        normal: '1.5',
        relaxed: '1.75',
        loose: '2.0',
      },
      letterSpacing: {
        tight: '-0.02em',
        normal: '0',
        wide: '0.05em',
        extra: '0.15em',
        ultra: '0.3em',
      },
      fontSize: {
        hero: ['64px', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '900' }],
        'page-title': ['40px', { lineHeight: '1.5', letterSpacing: '0', fontWeight: '700' }],
        'section-header': ['28px', { lineHeight: '1.5', letterSpacing: '0', fontWeight: '500' }],
        subsection: ['20px', { lineHeight: '1.5', letterSpacing: '0', fontWeight: '500' }],
        body: ['16px', { lineHeight: '1.75', letterSpacing: '0', fontWeight: '400' }],
        caption: ['14px', { lineHeight: '1.75', letterSpacing: '0.05em', fontWeight: '400' }],
      },
    },
  },
  plugins: [],
};

export default config;
