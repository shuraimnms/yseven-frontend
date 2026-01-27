import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        // Y7 Custom Colors
        gold: {
          DEFAULT: "hsl(var(--gold))",
          light: "hsl(var(--gold-light))",
          dark: "hsl(var(--gold-dark))",
        },
        "deep-red": {
          DEFAULT: "hsl(var(--deep-red))",
          light: "hsl(var(--deep-red-light))",
        },
        burgundy: "hsl(var(--burgundy))",
        charcoal: "hsl(var(--charcoal))",
        obsidian: "hsl(var(--obsidian))",
        cream: {
          DEFAULT: "hsl(var(--cream))",
          muted: "hsl(var(--cream-muted))",
        },
      },
      fontFamily: {
        display: ["Playfair Display", "Georgia", "Times New Roman", "serif"],
        body: ["Montserrat", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        sans: ["Montserrat", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        serif: ["Playfair Display", "Georgia", "Times New Roman", "serif"],
      },
      fontSize: {
        'hero': ['clamp(2.25rem, 8vw, 6rem)', { lineHeight: '1.1', letterSpacing: '0.04em' }],
        'hero-sub': ['clamp(1.125rem, 2.5vw, 1.25rem)', { lineHeight: '1.6', letterSpacing: '0.01em' }],
        'section-title': ['clamp(1.75rem, 5vw, 3.5rem)', { lineHeight: '1.2', letterSpacing: '0.03em' }],
        'product-title': ['clamp(1.5rem, 4vw, 2.25rem)', { lineHeight: '1.25', letterSpacing: '0.02em' }],
        'body-large': ['clamp(1.125rem, 2.5vw, 1.25rem)', { lineHeight: '1.7', letterSpacing: '0.005em' }],
        'body-premium': ['clamp(1rem, 2vw, 1.125rem)', { lineHeight: '1.7', letterSpacing: '0.005em' }],
        'caption': ['0.75rem', { lineHeight: '1.4', letterSpacing: '0.02em' }],
        'cta': ['0.875rem', { lineHeight: '1.2', letterSpacing: '0.02em' }],
        'nav': ['0.875rem', { lineHeight: '1.4', letterSpacing: '0.01em' }],
      },
      fontWeight: {
        'ultra-bold': '900',
        'extra-bold': '800',
        'display-bold': '700',
        'display-medium': '600',
        'body-bold': '700',
        'body-semibold': '600',
        'body-medium': '500',
      },
      letterSpacing: {
        'cinematic': '0.04em',
        'elegant': '0.02em',
        'refined': '0.01em',
        'luxury': '0.2em',
        'wide-luxury': '0.3em',
      },
      lineHeight: {
        'cinematic': '1.1',
        'display': '1.2',
        'title': '1.25',
        'body-premium': '1.7',
        'body-comfortable': '1.8',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slide-down": {
          from: { opacity: "0", transform: "translateY(-20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.6s ease-out",
        "slide-up": "slide-up 0.6s ease-out",
        "slide-down": "slide-down 0.6s ease-out",
        shimmer: "shimmer 2s infinite linear",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "shimmer-gold": "linear-gradient(90deg, transparent, hsl(43 74% 49% / 0.1), transparent)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
