import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        /* Semantic tokens from globals.css @theme – respond to .dark */
        surface: 'rgb(var(--color-surface) / <alpha-value>)',
        'surface-elevated': 'rgb(var(--color-surface-elevated) / <alpha-value>)',
        'surface-muted': 'rgb(var(--color-surface-muted) / <alpha-value>)',
        background: 'rgb(var(--color-background) / <alpha-value>)',
        'border-subtle': 'rgb(var(--color-border-subtle) / <alpha-value>)',
        'text-primary': 'rgb(var(--color-text-primary) / <alpha-value>)',
        'text-secondary': 'rgb(var(--color-text-secondary) / <alpha-value>)',
        'text-muted': 'rgb(var(--color-text-muted) / <alpha-value>)',
        'accent-primary': 'rgb(var(--color-accent-primary) / <alpha-value>)',

        // Brand colors from the design
        cream: '#FAF8F5',
        gold: {
          DEFAULT: '#B39D7D',
          dark: '#8A7760',
          light: '#D4C5B0',
        },
        'dark-brown': '#5B4233',
        'medium-brown': '#8B7355',
        'light-brown': '#A89B8C',
        'brown-text': '#5B4233',

        // Existing project colors
        primary: {
          DEFAULT: '#c0841a',
          light: '#d4a84f',
          dark: '#9a6814',
        },
        secondary: '#d4a84f',
        'text-dark': '#171717',
        'safe-green': '#10B981',
        'warning-amber': '#F59E0B',
        'danger-red': '#EF4444',
        destructive: '#EF4444',
        border: 'rgb(var(--color-border-subtle) / <alpha-value>)',
        muted: 'rgb(var(--color-surface-muted) / <alpha-value>)',
        'cream-bg': '#FAF8F5',
        'cream-card': '#FFFFFF',
        'google-blue': '#4285F4',
        'google-green': '#34A853',
        'google-yellow': '#FBBC05',
        'google-red': '#EA4335',
        'brand-brown-dark': '#291d12',
        'beige-light': '#EBE1DD',
        'pink-light': '#EEDDD8',
      },
      
      boxShadow: {
        'soft': '0 4px 20px rgba(179, 157, 125, 0.1)',
        'medium': '0 8px 30px rgba(179, 157, 125, 0.2)',
        'strong': '0 12px 40px rgba(179, 157, 125, 0.3)',
        'elevation-1': '0 2px 8px rgba(91, 66, 51, 0.08)',
        'elevation-2': '0 8px 32px rgba(0,0,0,0.12)',
        'elevation-3': '0 8px 24px rgba(91, 66, 51, 0.16)',
        'black/30': '0 4px 20px rgba(0,0,0,0.3)',
        'amber-500/30': '0 0 20px rgba(245,158,11,0.3)',
        'button': '0 2px 8px rgba(192, 132, 26, 0.2)',
        'card': '0 4px 16px rgba(91, 66, 51, 0.12)',
        'luxury': '0 20px 40px rgba(0,0,0,0.08)',
        'radar': '0 0 40px rgba(16,185,129,0.3)',
        'glow': '0 0 20px rgba(192, 132, 26, 0.25)',
        'glow-xl': '0 0 28px rgba(192, 132, 26, 0.3)',
        'glow-2xl': '0 0 36px rgba(192, 132, 26, 0.35)',
      },
      
      borderRadius: {
        'card': '16px',
        'button': '12px',
        'input': '12px',
      },
      
      minHeight: {
        'touch': '44px',
      },
      minWidth: {
        'touch': '44px',
      },

      fontFamily: {
        arabic: ['var(--font-arabic)', 'Tahoma', 'Arial', 'sans-serif'],
        sans: ['var(--font-arabic)', 'Tahoma', 'Arial', 'sans-serif'],
        manrope: ['var(--font-manrope)', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Cormorant Garamond', 'serif'],
        logo: ['var(--font-logo)', 'Cormorant Garamond', 'Georgia', 'serif'],
        tajawal: ['Tajawal', 'sans-serif'],
      },

      backgroundImage: {
        'gradient-radial': 'radial-gradient(circle, var(--tw-gradient-stops))',
      },

      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'ring-pulse': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
      animation: {
        'pulse-slow': 'pulse 4s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'ring-pulse': 'ring-pulse 1.5s ease-in-out infinite',
      },

      backdropBlur: {
        xs: '2px',
      },

      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1.5', letterSpacing: '0.05em' }],
        'sm': ['0.875rem', { lineHeight: '1.5', letterSpacing: '0.025em' }],
        'base': ['1rem', { lineHeight: '1.6', letterSpacing: '0' }],
        'lg': ['1.125rem', { lineHeight: '1.6', letterSpacing: '0' }],
        'xl': ['1.25rem', { lineHeight: '1.5', letterSpacing: '0' }],
        '2xl': ['1.5rem', { lineHeight: '1.4', letterSpacing: '-0.01em' }],
        '3xl': ['1.875rem', { lineHeight: '1.3', letterSpacing: '-0.02em' }],
        '4xl': ['2.25rem', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
        '5xl': ['3rem', { lineHeight: '1.1', letterSpacing: '-0.03em' }],
        '6xl': ['3.75rem', { lineHeight: '1.1', letterSpacing: '-0.03em' }],
        '7xl': ['4.5rem', { lineHeight: '1', letterSpacing: '-0.04em' }],
        '8xl': ['6rem', { lineHeight: '1', letterSpacing: '-0.04em' }],
        '9xl': ['8rem', { lineHeight: '1', letterSpacing: '-0.04em' }],
      },
    },
  },
  plugins: [],
};
export default config;
