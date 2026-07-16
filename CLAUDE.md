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