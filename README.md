# Piyush Modgil — portfolio

A single-scroll, 3D DevOps portfolio. Next.js App Router, TypeScript, Tailwind,
react-three-fiber, GSAP ScrollTrigger and Lenis.

The organising rule of this codebase: **3D is never the only place information
lives.** Every word renders as server HTML; the canvases are a second view of
the same content. Turn JavaScript off and you still get a complete résumé.

```bash
pnpm install
pnpm dev          # http://localhost:3000
pnpm build        # production build, fails on type errors
```

---

## Where things are

```
app/
  layout.tsx          fonts, metadata, providers, skip link
  page.tsx            section order + JSON-LD structured data
  globals.css         CSS custom properties mirrored from lib/tokens.ts
  api/send-email/     Resend handler used by the contact terminal's `mail`

config/               ← ALL CONTENT. Start here.
  site.ts             name, role, links, résumé path, bio, stats, credentials
  projects.ts         case studies: problem → architecture graph → outcomes
  experience.ts       roles
  skills.ts           the stack, and which projects each skill is tagged to
  pipeline.ts         the five CI/CD stages
  cluster.ts          the demo cluster's worker nodes
  metrics.ts          simulated telemetry (see the honesty note in the file)

lib/
  tokens.ts           colour, type, spacing, easing, springs, per-tier budgets
  perf.ts             device tiering + runtime downgrade
  scroll.ts           Lenis ↔ ScrollTrigger ↔ GSAP ticker wiring
  motion.ts           reduced-motion, pointer parallax, typewriter, count-up
  audio.ts            synthesised UI sound (off by default)
  cursor.ts           custom-cursor state
  filter.ts           skill → project filter shared across sections
  boot.ts             real preloader progress

components/
  three/              Scene, SceneGate, Node, GlassPanel, Effects, CameraRig
  shell/              Preloader, Cursor, Nav, SoundToggle, SectionHeader
  sections/<name>/    one folder per section
  ui/                 leftover shadcn scaffolding, unused by the new design
```

### Anatomy of a section

Each section folder follows the same four-file shape:

| File | Role | Runs where |
|---|---|---|
| `index.tsx` | Headings and prose | Server (or a client component that renders all text unconditionally) |
| `*Viewer.tsx` | Interaction state, DOM overlay | Client |
| `*Canvas.tsx` | `<Scene>` + the 3D scene, the dynamic-import target | Client, lazy |
| `Fallback.tsx` | The no-WebGL / low-power version | Client |

The split exists so `SceneGate` can choose between `Fallback` and `Canvas`
*before* the three.js chunk is requested. A phone that gets the fallback never
downloads three.js at all.

---

## Swapping in your own content

**Almost everything is in `config/`.** No component hard-codes a name, URL,
metric or job title.

1. **`config/site.ts`** — name, role, location, email, socials, bio, stats.
   Also `site.url`, which drives canonical URLs and Open Graph tags.
2. **`config/projects.ts`** — the case studies. Each project needs a `problem`,
   an `architecture` graph, and `outcome` metrics. The architecture diagram is
   generated from data:

   ```ts
   architecture: {
     nodes: [
       { id: 'gh',      label: 'GitHub',  kind: 'source',  column: 0 },
       { id: 'jenkins', label: 'Jenkins', kind: 'compute', column: 1 },
     ],
     edges: [['gh', 'jenkins']],
     note: 'One sentence on the interesting decision.',
   }
   ```

   `column` is the only positioning you control — rows are laid out and centred
   automatically. `kind` picks the node's colour (`source`, `compute`, `data`,
   `observe`, `edge`).

3. **`config/skills.ts`** — each skill lists the project slugs it's tagged to.
   That list is what the skills sphere filters by. A skill with an empty
   `projects` array still renders but isn't clickable — don't pad it.

4. **Your résumé** → drop a PDF at `public/resume.pdf`. The terminal's
   `resume --download` and the contact link both point at `site.resume`.
   **This file is not in the repo yet — add it, or both links 404.**

5. **Draft flags gate publication.** While a project has `needsReview: true`,
   its card renders only your own material — summary, stack, outcome metrics —
   and the deep case study (problem, architecture diagram, and the button that
   opens them) does not render at all. Drafted prose is never published.

   Rewrite `problem` and `architecture` in your own words, delete the flag, and
   the case study appears by itself. In `pnpm dev` a project still carrying the
   flag shows an amber "case study hidden — draft" marker; that marker is
   development-only and never reaches visitors.

---

## Design tokens

`lib/tokens.ts` is the single source of truth, consumed in three places:

- `tailwind.config.ts` imports it for utility classes (`text-accent`, `bg-void`)
- `app/globals.css` mirrors it as CSS custom properties
- three.js materials read `three.*`, which are numeric hex

Change a colour there and it propagates to all three. The mirrored block in
`globals.css` must be updated in the same commit — that duplication is
deliberate (CSS can't import TS) and it's the one place to stay disciplined.

**The colour rule:** cyan is the only decorative accent. `signal.ok` / `warn` /
`err` carry *meaning only* — a healthy pod, a failing build, a breached SLO.
Never reach for green because a card "needs some colour". The previous version
of this site used five accent colours decoratively and it read as a template.

Typography is two families: Space Grotesk for display, JetBrains Mono for
everything else. Display sizes are `clamp()`-fluid, so the hero never needs a
breakpoint.

---

## Adding a 3D model

There are currently **no GLTF models** — every scene is procedural geometry
(icosahedra, instanced boxes, line segments), which is why nothing blocks the
first frame and there's no model budget to blow.

If you add one, compress it first:

```bash
npx gltfpack -i model.glb -o public/models/model.glb -cc
# or
npx gltf-pipeline -i model.glb -o public/models/model.glb -d
```

Then load it inside a scene component with a Draco loader:

```tsx
import { useGLTF } from '@react-three/drei'
useGLTF.preload('/models/model.glb')

function Model() {
  const { scene } = useGLTF('/models/model.glb', '/draco/')
  return <primitive object={scene} />
}
```

Copy Draco's decoder into `public/draco/` from
`node_modules/three/examples/jsm/libs/draco/`. Keep the model under the
`<Suspense>` boundary that `<Scene>` already provides.

---

## Performance

The budget is 60fps on a mid-range laptop and sub-3s LCP. What enforces it:

- **Tiering** (`lib/perf.ts`). GPU string, core count, device memory and
  save-data pick `high` / `mid` / `low` before the first frame. Node counts,
  DPR, shadows and post-processing all read from `perf[tier]` in tokens.
- **Runtime downgrade.** `useFpsGuard` watches real frame timing and drops a
  tier after three consecutive bad seconds. Tiers only move down — oscillating
  between quality levels is worse than sitting at the lower one.
- **DPR capped at 2**, always.
- **Manual override:** append `?tier=high`, `?tier=mid` or `?tier=low` to any
  URL to pin a tier. An explicit override also disables the automatic
  downgrade, so you can inspect the full-quality scenes on a machine that would
  otherwise be demoted. This is how to check the low-power path without owning
  a low-power device.
- **Lazy canvases.** Each scene is a `dynamic()` chunk mounted by
  IntersectionObserver and unmounted when far off-screen. This also keeps the
  page under the browser's ~16 live WebGL context limit.
- **`frameloop="never"` off-screen** — a canvas you can't see renders nothing.
- **Instancing.** Repeated geometry is one draw call: the globe's 640 nodes, the
  cluster's pods, the metrics wall's 240 bars. Edges are a single `LineSegments`
  buffer.

Current bundle: **~177 kB First Load JS**, with three.js entirely in lazy chunks.

If you add a scene, verify the split held:

```bash
pnpm build   # page "Size" column should stay small; 3D lives in async chunks
```

---

## Accessibility

- `prefers-reduced-motion` is honoured in CSS *and* in JS. Camera parallax,
  auto-rotation, scroll dollies, typewriters and count-ups all check
  `useReducedMotion()` — a media query alone can't reach a `useFrame` loop.
- Every canvas wrapper is `aria-hidden`, and nothing focusable goes inside one.
  Controls that drive 3D (scale up, skill filter) are real DOM buttons.
- Actions whose only visible result is inside a canvas announce via
  `aria-live` — the pod count, the active skill filter.
- One `h1`, then one `h2` per section. Skip link is the first tab stop.
- Focus rings are visible and on-brand; pinch-zoom is not blocked.

## SEO

- All text server-rendered — including collapsed case studies, which stay
  mounted with the `hidden` attribute rather than being conditionally rendered.
- JSON-LD `Person` schema in `app/page.tsx`, generated from the same config the
  page renders.
- Metadata and Open Graph tags derive from `config/site.ts`.

## Deployment

Vercel, zero config. One environment variable for the contact form:

```
RESEND_API_KEY=re_...
```

Without it the `mail` command returns a clear error and the direct email link
still works.

---

## Known gaps

- `public/resume.pdf` is missing — add it.
- Project `problem` and `architecture` prose is drafted, not authored; anything
  still flagged `needsReview: true` needs your review.
- `components/ui/*` is unused shadcn scaffolding, safe to delete wholesale.
