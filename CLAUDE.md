# Leonida Link - Core Rules

## 1. AI Behavior & Execution (STRICT)
- **Stop & Ask:** If I ask you to build a page and I do not provide the exact hex colors, layout structure, or image paths needed for that specific page, you MUST pause and ask me for them before writing any code.
- **No Yapping:** Output the code immediately after any clarifications. Do not write essays or summarize the code after generating it.
- **Git Actions:** Never auto-commit or auto-stage. Show the code and wait for approval.

## 2. Technical Stack
- **Framework:** Next.js 15 (App Router `src/app/`)
- **React version:** React 19 (Server Components by default)
- **Styling:** Tailwind CSS v4 
- **Icons:** Lucide React
- **Database:** Supabase (`@supabase/supabase-js`, `@supabase/ssr`)

## 3. Database & Backend Rules
- **Manual Schema:** Supabase tables and schemas are managed manually by the user. Do NOT write SQL migrations or database creation scripts.
- **Data Fetching/Mutations:** ALWAYS use Next.js Server Actions inside `src/actions/` for database interactions. 
- **Client Components:** Never mix server-side Supabase calls inside client components.

## 4. Global UI/UX Identity
- **Global Background:** The main application background is strictly `#280242`.
- **Global Text:** Default body text is plain white (`#FFFFFF`).
- **Design Principles:** Premium, cinematic console interface. No standard SaaS dashboard visuals. Use tall, bottom-weighted cards (content aligned to the bottom) and glassmorphism (`bg-white/5`, `backdrop-blur-xl`) where applicable.

## 5. Map Architecture (`/map`, `/studio`)
- **Stack:** MapLibre GL JS (no external basemap - custom fictional map)
- **Fictional Map:** Uses `lib/leonida-crs.ts` coordinate system, renders `/map/leonida-base.jpg` as raster underlay
- **Key files:**
  - `app/map/lib/leonida-crs.ts` — MAP_WIDTH_PX (2590), MAP_HEIGHT_PX (3240), LEONIDA_BOUNDS, `getRasterCorners()` helper
  - `app/map/page.tsx` — Server component with metadata
  - `app/map/ViceMap.tsx` — Client component, inline MapLibre style (dark #0a0e14 background)
  - `app/studio/page.tsx` — Server component for tracing studio
  - `app/studio/StudioMap.tsx` — Client component with Supabase auth gate and drawing tools
- **Theming:** All colors in map components live in a single `COLORS` object at the top
- **CRS:** Custom coordinate system (0-1, 0-1.251), NOT lat/lng. Edit `leonida-crs.ts` to change bounds
- **Mobile:** Touch pan/pinch/rotate work natively via MapLibre. HUD uses `max-xs:` responsive variants to avoid nav control overlap at 380px
- **Studio Features:** Auth-gated, polygon tracing with fill-extrusion preview, localStorage persistence, GeoJSON export