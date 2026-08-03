import type { Config } from "tailwindcss"
import { color, easeCss, duration, radius, space, type, z } from "./lib/tokens"

/**
 * Tailwind reads from lib/tokens.ts — never hard-code a hex here.
 * The shadcn `hsl(var(--…))` block below is legacy scaffolding kept only so the
 * remaining components/ui/* files still compile. New work uses the token scale.
 */
const config = {
  darkMode: ["class"],
  content: [
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./config/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: { "2xl": "1400px" },
    },
    extend: {
      colors: {
        /* ── the system ── */
        void: color.bg.void,
        base: color.bg.base,
        raised: color.bg.raised,
        glass: color.bg.glass,
        scrim: color.bg.scrim,

        accent: {
          DEFAULT: color.accent.core,
          hot: color.accent.hot,
          deep: color.accent.deep,
          dim: color.accent.dim,
          glow: color.accent.glow,
          /* shadcn compat */
          foreground: "hsl(var(--accent-foreground))",
        },

        ink: {
          DEFAULT: color.text.primary,
          secondary: color.text.secondary,
          muted: color.text.muted,
          faint: color.text.faint,
        },

        line: {
          subtle: color.line.subtle,
          DEFAULT: color.line.default,
          strong: color.line.strong,
        },

        /* status semantics only — never decoration */
        signal: {
          ok: color.signal.ok,
          warn: color.signal.warn,
          err: color.signal.err,
          idle: color.signal.idle,
        },

        /* ── legacy shadcn scaffolding ── */
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
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },

      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },

      fontSize: {
        "display-xl": [type.display.xl, { lineHeight: type.leading.display, letterSpacing: type.tracking.display }],
        "display-lg": [type.display.lg, { lineHeight: type.leading.display, letterSpacing: type.tracking.display }],
        "display-md": [type.display.md, { lineHeight: "1.05", letterSpacing: "-0.02em" }],
        "body-lg": [type.body.lg, { lineHeight: type.leading.body }],
        "body-md": [type.body.md, { lineHeight: type.leading.body }],
        "body-sm": [type.body.sm, { lineHeight: "1.55" }],
        "label-md": [type.label.md, { letterSpacing: type.tracking.label }],
        "label-sm": [type.label.sm, { letterSpacing: type.tracking.label }],
        "label-xs": [type.label.xs, { letterSpacing: type.tracking.label }],
      },

      spacing: { ...space },
      borderRadius: {
        ...radius,
        /* shadcn compat */
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      zIndex: Object.fromEntries(Object.entries(z).map(([k, v]) => [k, String(v)])),

      transitionTimingFunction: {
        out: easeCss.out,
        "in-out": easeCss.inOut,
        dolly: easeCss.dolly,
        snap: easeCss.snap,
      },
      transitionDuration: Object.fromEntries(
        Object.entries(duration).map(([k, v]) => [k, `${v}ms`]),
      ),

      boxShadow: {
        glow: `0 0 40px ${color.accent.dim}`,
        "glow-strong": `0 0 60px ${color.accent.glow}`,
        panel: "0 24px 60px rgba(0,0,0,0.55)",
      },

      backdropBlur: { glass: "14px" },

      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "pulse-dot": {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.45", transform: "scale(0.82)" },
        },
        "caret-blink": {
          "0%, 45%": { opacity: "1" },
          "50%, 95%": { opacity: "0" },
        },
        "scan-line": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "pulse-dot": "pulse-dot 2s ease-in-out infinite",
        "caret-blink": "caret-blink 1.1s step-end infinite",
        "scan-line": "scan-line 7s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
