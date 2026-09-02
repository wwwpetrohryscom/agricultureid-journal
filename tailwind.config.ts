import type { Config } from 'tailwindcss';

/**
 * AgricultureID design tokens — shared verbatim with the main platform.
 *
 * The Journal is a separate application on the same public hostname. A visitor
 * moving from a crop entry to a Journal feature crosses a deployment boundary
 * and must not be able to tell: the palette, the type stacks and the spacing
 * scale are the same file. Divergence here would read as two websites wearing
 * the same logo.
 *
 * Copied rather than imported, because importing would couple the two builds —
 * which is the one thing this architecture exists to prevent.
 *
 * Palette rationale:
 *  - forest    → deep agricultural green (primary brand + actions)
 *  - olive     → muted olive (secondary accents, data emphasis)
 *  - clay      → warm earth (tertiary accent, provenance/source signals)
 *  - parchment → grain / neutral warm backgrounds and surfaces
 *  - ink       → charcoal text scale (warm neutral, not pure grey)
 *
 * Typography uses network-independent system stacks (see docs/architecture.md)
 * so builds are deterministic and there is zero runtime font request.
 */
const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#f1f6f2',
          100: '#dceadf',
          200: '#b9d4c0',
          300: '#8db69a',
          400: '#5d9270',
          500: '#3c7351',
          600: '#2c5b3f',
          700: '#234a34',
          800: '#1d3c2b',
          900: '#183123',
          950: '#0d1f16',
        },
        olive: {
          50: '#f7f7ee',
          100: '#ececd3',
          200: '#d9d8a9',
          300: '#c2bf78',
          400: '#aca552',
          500: '#8f8a3e',
          600: '#6f6a2f',
          700: '#565227',
          800: '#474424',
          900: '#3d3a22',
          950: '#201f10',
        },
        clay: {
          50: '#faf5f0',
          100: '#f2e6d8',
          200: '#e3c9b0',
          300: '#d2a781',
          400: '#c08659',
          500: '#b06e42',
          600: '#8a5a34',
          700: '#6f4a2e',
          800: '#5c3e2a',
          900: '#4e3626',
          950: '#2a1c13',
        },
        parchment: {
          50: '#fdfcf8',
          100: '#f7f3e8',
          200: '#efe8d5',
          300: '#e2d7ba',
          400: '#cfc096',
          500: '#bda876',
          600: '#a68d5c',
          700: '#8a7249',
          800: '#6f5c3e',
          900: '#5b4c36',
          950: '#31281c',
        },
        ink: {
          50: '#f6f6f4',
          100: '#e8e8e3',
          200: '#d1d1c8',
          300: '#b0b0a3',
          400: '#86867a',
          500: '#6a6a5e',
          600: '#53534a',
          700: '#43433c',
          800: '#2c2c27',
          900: '#23231f',
          950: '#16160f',
        },
      },
      fontFamily: {
        sans: [
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
        serif: [
          'ui-serif',
          'Georgia',
          'Cambria',
          'Times New Roman',
          'Times',
          'serif',
        ],
        mono: [
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'Consolas',
          'monospace',
        ],
      },
      maxWidth: {
        prose: '68ch',
        content: '78rem',
      },
      borderRadius: {
        card: '0.5rem',
      },
      boxShadow: {
        card: '0 1px 2px rgba(35, 35, 31, 0.04), 0 4px 16px rgba(35, 35, 31, 0.05)',
        'card-hover':
          '0 2px 4px rgba(35, 35, 31, 0.06), 0 10px 28px rgba(35, 35, 31, 0.08)',
      },
    },
  },
  plugins: [],
};

export default config;
