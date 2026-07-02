# LA RC Cafe

A full-stack website for LA RC Cafe — India's RC car racing cafe. Race on real tracks, rent RC cars, enjoy food & coffee. Race • Relax • Repeat.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server
- `pnpm --filter @workspace/rc-cafe run dev` — run the frontend
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite + Tailwind CSS + Framer Motion
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (zod/v4), drizzle-zod
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/rc-cafe/src/pages/` — all frontend pages
- `artifacts/rc-cafe/src/components/layout/` — Navbar, Footer, AppLayout
- `artifacts/api-server/src/routes/` — all API route handlers
- `lib/api-spec/openapi.yaml` — API contract (source of truth)
- `lib/db/src/schema/` — DB tables (bookings, menu, contact, products)

## Pages

- `/` — Home (hero, stats, featured services)
- `/shop` — RC products shop with category filter
- `/services` — RC track packages, rentals, events
- `/menu` — Cafe menu (coffee, snacks, pizza, RC charges, combos)
- `/gallery` — Photo gallery
- `/book` — Reservation booking form
- `/contact` — Contact form + location info
- `/admin/login` — Admin login
- `/admin` — Admin panel (bookings, messages, menu, products)

## Admin Credentials

- User ID: `9622340933`
- Password: `9931311yY@123`
- URL: `/admin/login`

## User preferences

- Dark red/black theme — exact HSL colors must be preserved
- Currency: Indian Rupees (₹)
- Sharp corners (radius: 0rem)
- Framer Motion animations throughout
- No emojis in UI

## Gotchas

- After changing OpenAPI spec, always run codegen before touching frontend
- DB schema push needed after schema changes: `pnpm --filter @workspace/db run push`
- API server must be rebuilt after route changes: `pnpm --filter @workspace/api-server run build`
