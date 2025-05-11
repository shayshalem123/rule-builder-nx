import type { Config } from 'tailwindcss';
import animatePlugin from 'tailwindcss-animate';

export default {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        background: {
          primary: 'rgb(var(--background-primary))',
          secondary: {
            DEFAULT: 'rgb(var(--background-secondary))',
            foreground: 'rgb(var(--background-secondary-foreground))',
          },
          dark: {
            DEFAULT: 'rgb(var(--background-dark))',
            foreground: 'rgb(var(--background-dark-foreground))',
          },
        },
        button: {
          primary: {
            DEFAULT: 'rgb(var(--button-primary))',
            foreground: 'rgb(var(--button-primary-foreground))',
            hover: 'rgb(var(--button-primary-hover))',
          },
          secondary: {
            DEFAULT: 'rgb(var(--button-secondary))',
            foreground: 'rgb(var(--button-secondary-foreground))',
            hover: 'rgb(var(--button-secondary-hover))',
          },
          destructive: {
            DEFAULT: 'rgb(var(--button-destructive))',
            foreground: 'rgb(var(--button-destructive-foreground))',
            hover: 'rgb(var(--button-destructive-hover))',
            'hover-bg': 'rgb(var(--button-destructive-hover-bg))',
          },
        },
        text: {
          primary: 'rgb(var(--text-primary))',
          secondary: 'rgb(var(--text-secondary))',
          muted: 'rgb(var(--text-muted))',
        },
        border: {
          DEFAULT: 'rgb(var(--border))',
          primary: 'rgb(var(--border-primary))',
        },
        user: {
          icon: { background: 'rgb(var(--user-icon-background))' },
        },
        card: {
          DEFAULT: 'rgb(var(--card))',
          foreground: 'rgb(var(--card-foreground))',
          border: 'rgb(var(--card-border))',
        },
        muted: {
          DEFAULT: 'rgb(var(--muted))',
          foreground: 'rgb(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'rgb(var(--accent))',
          foreground: 'rgb(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'rgb(var(--popover))',
          foreground: 'rgb(var(--popover-foreground))',
        },
        destructive: {
          DEFAULT: 'rgb(var(--destructive))',
          foreground: 'rgb(var(--destructive-foreground))',
        },
        success: {
          DEFAULT: 'rgb(var(--success))',
          foreground: 'rgb(var(--success-foreground))',
        },
        info: {
          DEFAULT: 'rgb(var(--info))',
          foreground: 'rgb(var(--info-foreground))',
        },
        warning: {
          DEFAULT: 'rgb(var(--warning))',
          foreground: 'rgb(var(--warning-foreground))',
        },
        sidebar: {
          DEFAULT: 'rgb(var(--sidebar-background))',
          foreground: 'rgb(var(--sidebar-foreground))',
          primary: 'rgb(var(--sidebar-primary))',
          'primary-foreground': 'rgb(var(--sidebar-primary-foreground))',
          accent: 'rgb(var(--sidebar-accent))',
          'accent-foreground': 'rgb(var(--sidebar-accent-foreground))',
          border: 'rgb(var(--sidebar-border))',
          ring: 'rgb(var(--sidebar-ring))',
        },
        rule: {
          and: '#3b82f6', // blue-500
          or: '#8b5cf6', // violet-500
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'fade-out': {
          from: { opacity: '1' },
          to: { opacity: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.2s ease-out',
        'fade-out': 'fade-out 0.2s ease-out',
      },
    },
  },
  plugins: [
    animatePlugin,
    function ({ addUtilities }) {
      addUtilities({
        '.scrollbar-hide': {
          /* Firefox */
          'scrollbar-width': 'none',
          /* Safari and Chrome */
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
      });
    },
  ],
} satisfies Config;
