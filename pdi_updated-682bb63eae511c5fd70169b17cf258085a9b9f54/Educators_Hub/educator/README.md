# Ekya Educator Monorepo

Monorepo for the Ekya Schools Educator Platform and Teacher-facing Educator Site.

## Packages
- `apps/web` — React + Vite frontend for Teacher, HoS, Admin, Management, Super Admin, and Educator Site.
- `apps/api` — Express API with Prisma, SQLite, JWT auth, RBAC guards.
- `packages/ui` — shared UI components for cards, nav, tables.
- `packages/config` — RBAC configuration, nav visibility, permission map.

## Getting started
1. Install dependencies: `npm install`
2. Generate Prisma client: `npm run prisma:generate`
3. Seed database: `npm run seed`
4. Start frontend + backend: `npm run dev`

## Sample credentials
- Teacher: `teacher@ekya.test` / `Teacher123!`
- HoS: `hos@ekya.test` / `HoS123!`
- Admin: `admin@ekya.test` / `Admin123!`
- Management: `management@ekya.test` / `Mgmt123!`
- Super Admin: `superadmin@ekya.test` / `Super123!`

## RBAC and navigation
RBAC rules are defined in `packages/config/src/rbac.ts` and nav visibility in `packages/config/src/nav.ts`.
Frontend route protection uses React Router guards and a centralized permission utility. Backend endpoints enforce RBAC with guard middleware reading the same config.
