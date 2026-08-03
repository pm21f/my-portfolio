/**
 * DESIGN TOKENS — single source of truth.
 *
 * Consumed by three places:
 *   1. tailwind.config.ts  → utility classes (bg-base, text-accent, …)
 *   2. app/globals.css     → CSS custom properties (mirrored below in `cssVars`)
 *   3. three.js materials  → via `three.*` helpers, which return numeric hex
 *
 * Rule of the system: CYAN is the only decorative accent. The signal colours
 * (ok / warn / err) carry meaning only — a healthy pod, a failing build. Never
 * reach for them because a card "needs some colour".
 */

/* ────────────────────────────────────────────────────────────── colour ── */

export const color = {
  bg: {
    void: '#05070A', // page base, deepest
    base: '#0A0E14', // section base
    raised: '#111823', // cards, panels
    glass: 'rgba(16, 24, 36, 0.55)', // frosted surfaces over 3D
    scrim: 'rgba(5, 7, 10, 0.72)', // overlay behind modals
  },

  accent: {
    core: '#22D3EE', // the accent
    hot: '#67E8F9', // hover / emphasis
    deep: '#0E7490', // shadowed side, inactive
    dim: 'rgba(34, 211, 238, 0.14)',
    glow: 'rgba(34, 211, 238, 0.45)',
  },

  text: {
    primary: '#E6EDF3',
    secondary: '#93A4B8',
    muted: '#4A5A6E',
    faint: '#2A3542', // decorative numerals, watermarks
  },

  line: {
    subtle: 'rgba(148, 163, 184, 0.08)',
    default: 'rgba(34, 211, 238, 0.14)',
    strong: 'rgba(34, 211, 238, 0.35)',
  },

  /** Status semantics ONLY — never decoration. */
  signal: {
    ok: '#34D399',
    warn: '#FBBF24',
    err: '#F87171',
    idle: '#64748B',
  },
} as const

/* ─────────────────────────────────────────────────────────── typography ── */

export const font = {
  display: 'var(--font-display)', // Space Grotesk
  mono: 'var(--font-mono)', // JetBrains Mono
} as const

/**
 * Fluid type scale. Every display size is a clamp() so the hero never needs a
 * breakpoint. `min` is the phone size, `max` the desktop size.
 */
export const type = {
  display: {
    xl: 'clamp(3.5rem, 12vw, 11rem)', // hero name
    lg: 'clamp(2.5rem, 7vw, 5.5rem)', // section headline
    md: 'clamp(1.75rem, 4vw, 3rem)', // sub-headline
  },
  body: {
    lg: '1.0625rem',
    md: '0.9375rem',
    sm: '0.8125rem',
  },
  /** Monospace HUD labels — always uppercase, always tracked out. */
  label: {
    md: '0.75rem',
    sm: '0.6875rem',
    xs: '0.625rem',
  },
  tracking: {
    display: '-0.04em', // tight display type
    label: '0.18em', // wide mono labels
  },
  leading: {
    display: '0.92',
    body: '1.65',
  },
} as const

/* ──────────────────────────────────────────────────────────────── space ── */

/** 4px base grid. */
export const space = {
  px: '1px',
  1: '0.25rem',
  2: '0.5rem',
  3: '0.75rem',
  4: '1rem',
  6: '1.5rem',
  8: '2rem',
  12: '3rem',
  16: '4rem',
  24: '6rem',
  32: '8rem',
  40: '10rem',
  /** Vertical rhythm between full sections. */
  section: 'clamp(6rem, 14vh, 12rem)',
} as const

export const radius = {
  sm: '0.25rem',
  md: '0.5rem',
  lg: '0.875rem',
  xl: '1.25rem',
  full: '9999px',
} as const

/* ─────────────────────────────────────────────────────────────── motion ── */

/**
 * Easing curves. `dolly` is reserved for camera moves so section travel always
 * feels like the same physical camera.
 */
export const ease = {
  out: [0.16, 1, 0.3, 1],
  inOut: [0.65, 0, 0.35, 1],
  dolly: [0.33, 1, 0.68, 1],
  snap: [0.2, 0.9, 0.1, 1],
} as const

/** CSS-string form of the same curves. */
export const easeCss = {
  out: 'cubic-bezier(0.16, 1, 0.3, 1)',
  inOut: 'cubic-bezier(0.65, 0, 0.35, 1)',
  dolly: 'cubic-bezier(0.33, 1, 0.68, 1)',
  snap: 'cubic-bezier(0.2, 0.9, 0.1, 1)',
} as const

/** Durations in ms. All become 0 under prefers-reduced-motion. */
export const duration = {
  instant: 120,
  fast: 220,
  base: 400,
  slow: 700,
  cine: 1200,
} as const

export const spring = {
  /** UI chrome — snappy, barely overshoots. */
  ui: { stiffness: 220, damping: 26, mass: 1 },
  /** 3D objects settling into place — visible bounce. */
  object: { stiffness: 120, damping: 18, mass: 1 },
  /** Pod spawn on scale-up — deliberately springy. */
  pop: { stiffness: 300, damping: 14, mass: 0.8 },
} as const

/* ────────────────────────────────────────────────────────────────── 3D ── */

const hex = (css: string): number => parseInt(css.replace('#', '0x'), 16)

/** Numeric hex for three.js — `new Color(three.accent)`. */
export const three = {
  accent: hex(color.accent.core),
  accentHot: hex(color.accent.hot),
  accentDeep: hex(color.accent.deep),
  bg: hex(color.bg.void),
  bgRaised: hex(color.bg.raised),
  text: hex(color.text.primary),
  ok: hex(color.signal.ok),
  warn: hex(color.signal.warn),
  err: hex(color.signal.err),
  idle: hex(color.signal.idle),
} as const

/**
 * Camera + world constants. Sections are laid out along -Z in one continuous
 * world so the camera can dolly between them instead of cutting.
 */
export const world = {
  /** Distance between section origins along the travel axis. */
  sectionGap: 120,
  camera: {
    fov: 42,
    near: 0.1,
    far: 800,
    /** Idle distance from a section's origin. */
    dolly: 26,
  },
  /** Max camera offset from mouse parallax, in world units. */
  parallax: 1.6,
} as const

/** Post-processing intensities per device tier (see lib/perf.ts). */
export const postfx = {
  high: { bloom: 0.85, chromatic: 0.0009, dof: true, samples: 4 },
  mid: { bloom: 0.6, chromatic: 0.0005, dof: false, samples: 2 },
  low: { bloom: 0, chromatic: 0, dof: false, samples: 0 },
} as const

/**
 * Per-tier budgets. Every scene reads its geometry counts from here rather than
 * hard-coding them, so dropping a tier genuinely reduces work instead of just
 * turning off effects.
 *
 * `dpr` is a [min, max] pair handed to <Canvas dpr>. The max is capped at 2 on
 * every tier — beyond that you pay 4x fill rate for pixels nobody can resolve.
 */
export const perf = {
  high: {
    dpr: [1, 2] as [number, number],
    globeNodes: 640,
    globeEdges: 900,
    clusterPods: 48,
    shadows: true,
    /** Scenes above this index stay mounted while off-screen. */
    keepAlive: true,
  },
  mid: {
    dpr: [1, 1.5] as [number, number],
    globeNodes: 320,
    globeEdges: 420,
    clusterPods: 24,
    shadows: false,
    keepAlive: false,
  },
  low: {
    dpr: [1, 1] as [number, number],
    globeNodes: 120,
    globeEdges: 140,
    clusterPods: 12,
    shadows: false,
    keepAlive: false,
  },
} as const

export type Tier = keyof typeof perf

/* ───────────────────────────────────────────────────────────── z-index ── */

export const z = {
  canvas: 0,
  content: 10,
  nav: 40,
  cursor: 60,
  preloader: 80,
} as const

/* ───────────────────────────────────────────── css custom properties ── */

/**
 * Mirrored into :root by app/globals.css. Kept here so the mapping lives beside
 * the values it comes from — if you add a token, add its var in the same commit.
 */
export const cssVars = {
  '--bg-void': color.bg.void,
  '--bg-base': color.bg.base,
  '--bg-raised': color.bg.raised,
  '--bg-glass': color.bg.glass,
  '--accent': color.accent.core,
  '--accent-hot': color.accent.hot,
  '--accent-deep': color.accent.deep,
  '--accent-glow': color.accent.glow,
  '--text-primary': color.text.primary,
  '--text-secondary': color.text.secondary,
  '--text-muted': color.text.muted,
  '--text-faint': color.text.faint,
  '--line-subtle': color.line.subtle,
  '--line-default': color.line.default,
  '--line-strong': color.line.strong,
  '--signal-ok': color.signal.ok,
  '--signal-warn': color.signal.warn,
  '--signal-err': color.signal.err,
  '--ease-out': easeCss.out,
  '--ease-dolly': easeCss.dolly,
} as const

export const tokens = {
  color,
  font,
  type,
  space,
  radius,
  ease,
  easeCss,
  duration,
  spring,
  three,
  world,
  postfx,
  perf,
  z,
} as const

export default tokens
