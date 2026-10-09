# Gym Next — Improvement Roadmap (October 2026)

Priorities: P0 — security/revenue, P1 — bugs, P2 — hygiene and tooling, P3 — architecture, P4 — new features.
Estimates are rough, for a single developer. The "why" behind each item is in [PROJECT_STATUS.md](./PROJECT_STATUS.md).

## Stage 0 — Security & monetization (P0, ~3–4 days)
- [ ] 0.1 Add `firestore.rules` + `storage.rules` to the repo and wire them into `firebase.json`; owners read/write only `users/{uid}/**`; `subscribed` is read-only for the client; `exercises` is read-only.
- [ ] 0.2 Firebase Emulator + rules tests (`@firebase/rules-unit-testing`): foreign uid, changing `subscribed`, writing to `exercises`.
- [ ] 0.3 Create the user document with `subscribed` on the server (Cloud Function `beforeUserCreated`/`onCreate` or a server action with the Admin SDK). Remove `subscribed` from `ensureUserDoc`.
- [ ] 0.4 Single source of truth for subscriptions: `subscribed: { plan, status, expiresAt, freeAiTries }`; `isActive` is computed on the server; the guard and the UI read the same thing.
- [ ] 0.5 Gemini server actions read data only via `adminDb` (separate `lib/server/*` modules with `import "server-only"`).
- [ ] 0.6 AI limits: charge a try only after a successful response (or refund on failure); rate limit premium users too (e.g. N/day); cap message and history length; validate client-sent history with zod.
- [ ] 0.7 Validate Gemini responses with zod `safeParse`; generate Gemini schemas with `z.toJSONSchema()`.
- [ ] 0.8 Validate the `locale` cookie against `i18n/locales.ts`, fall back to `uk`.
- [ ] 0.9 Verify `.env.local` was never committed (`git log --all -- .env.local`); App Hosting secrets via Secret Manager in `apphosting.yaml`.

## Stage 1 — Bugs (P1, ~0.5 day)
- [ ] 1.1 `hooks/useAuth.tsx`: remove `import { subscribe } from "diagnostics_channel"`.
- [ ] 1.2 `Plans/index.tsx`: move `useTranslations` out of `.map()` to the top level.
- [ ] 1.3 `layout.tsx`: `lang={locale}` from `getLocale()`; `Inter({ subsets: ["latin", "cyrillic"] })`; remove `maximumScale: 1`.
- [ ] 1.4 `tsconfig.json`: remove `"data/navManu.еs"` and `"lib/schemas/schedule.schema/ts"` from `include`.
- [ ] 1.5 `pnpm-workspace.yaml`: `'@google/genai': false` (or true).
- [ ] 1.6 On logout: `queryClient.clear()` + `del("REACT_QUERY_OFFLINE_CACHE")`.
- [ ] 1.7 `themeColor` as an array for light/dark.

## Stage 2 — Packages & tooling (P2, ~1–2 days)
- [ ] 2.1 Remove `@headlessui/react`, `@tailwindplus/elements`, `@tanstack/query-sync-storage-persister`, `@vercel/speed-insights`, `package-lock.json`. Add `"packageManager": "pnpm@…"`.
- [ ] 2.2 `@types/node` → 22+.
- [ ] 2.3 Prettier (+ `prettier-plugin-tailwindcss`), Husky + lint-staged.
- [ ] 2.4 ESLint: `no-console` (warn, allow error), `@typescript-eslint/no-explicit-any`, `react-hooks/rules-of-hooks` (error). Clean up ~51 `console.log` / `any` / `@ts-ignore`.
- [ ] 2.5 Scripts: `typecheck`, `test`, `test:e2e`, `format`.
- [ ] 2.6 Vitest + Testing Library: records, volume, weekly periods, guard, zod schemas.
- [ ] 2.7 GitHub Actions: lint + typecheck + test + build on every PR.
- [ ] 2.8 Sentry (or Crashlytics) for the client and server actions.

## Stage 3 — Architecture & cleanup (P3, ~1–2 weeks, incremental)
- [ ] 3.1 `lib/actions` (client-side writes) → `lib/mutations`; real server actions → `lib/server/actions`.
- [ ] 3.2 Move critical writes to the server: account deletion, records, subscription.
- [ ] 3.3 Return error codes (`NO_FREE_TRIES`, `AI_RATE_LIMIT`) and translate them via next-intl.
- [ ] 3.4 Naming: `shedule.ts`→`schedule.ts`, `navManu.tsx`→`navMenu.tsx`, `TypewritterText`→`TypewriterText`; one `_components` convention and one file-casing convention.
- [ ] 3.5 `useAuth.tsx` (a provider) → `providers/auth-provider.tsx`, hook separately.
- [ ] 3.6 Query key factory (`lib/queryKeys.ts`).
- [ ] 3.7 Server components for the layout and static parts.
- [ ] 3.8 `MuscleSchema`: move SVG paths into data + one render component.
- [ ] 3.9 PWA: `@ducanh2912/next-pwa` → Serwist (`@serwist/next`), verify offline mode.
- [ ] 3.10 Tie the persister `buster` to the data schema version.
- [ ] 3.11 Feature-based structure ("FSD-lite"), one feature per PR, after Stages 0–2. See [Target structure](#target-structure-fsd-lite).
  - [ ] Create `shared/` (ui, lib, config) and `server/` (Admin SDK, server actions, AI guard, `import "server-only"`).
  - [ ] Migrate features one by one, smallest first: `progress` → `history` → `exercises` → `routines` → `schedule` → `workouts` → `ai` → `subscription` → `auth`.
  - [ ] Each feature exposes a public API via `index.ts`; no deep imports into another feature's internals.
  - [ ] Enforce boundaries with ESLint (`eslint-plugin-boundaries` or `import/no-restricted-paths`): `shared` never imports from `features`/`server`; features import each other only through `index.ts`; client code never imports `server/`.
  - [ ] `app/` stays routing-only (thin `page.tsx`/`layout.tsx` composing features).

## Stage 4 — Product (P4, after stabilization)
- [ ] 4.1 Payments: Stripe/LemonSqueezy + webhook → server-side `subscribed` update (depends on 0.3–0.4).
- [ ] 4.2 Reliable offline workout logging with a sync queue.
- [ ] 4.3 Rest timer (vibration, sound).
- [ ] 4.4 Scheduled push reminders (FCM).
- [ ] 4.5 1RM estimate (Epley), history export to CSV.
- [ ] 4.6 Analytics (Firebase Analytics / PostHog): subscription funnel.
- [ ] 4.7 Playwright e2e: login → workout → history → stats.

## Target structure (FSD-lite)

Why not full FSD: the project is ~14k lines with a single developer, FSD's `app`/`pages` layers clash with Next.js App Router folders, and `entities`/`features`/`widgets` boundaries would be fuzzy here. FSD-lite keeps the useful parts — grouping by domain, a public API per feature, one-way dependencies — without the extra layers. Revisit full FSD if the team grows to 3+ developers or code must be shared with another app (admin panel, React Native).

```
app/                      # Next.js routing only (thin page.tsx / layout.tsx)
features/
  routines/
    api/                  # reads (services) + writes (mutations)
    model/                # types, zod schemas, query keys
    hooks/                # useRoutines, useCreateRoutine
    components/           # RoutineCard, routine modals
    index.ts              # public API of the feature
  workouts/
  exercises/
  schedule/
  progress/
  history/
  ai/
  auth/
  subscription/
shared/
  ui/                     # Button, Tabs, Loader, form controls
  lib/                    # firebase client, utils, result type, i18n helpers
  config/
server/                   # Admin SDK, server actions, AI guard ("server-only")
```

Dependency rules: `app` → `features` → `shared`; `server` → `shared`; features talk to each other only via `index.ts`.

Decided against (for now): **fp-ts** (in maintenance, superseded by Effect) and **Effect** (no complex async orchestration in the app; TanStack Query + zod + a small `Result<T, E>` type cover the needs). Reconsider Effect only for a dedicated backend (payment webhooks, queues, background sync).

## Order
Stage 1 can be done first in half a day, alongside the start of Stage 0. Stage 0 must be done before launching payments (4.1). Stage 2 should come before the big Stage 3 refactors (especially 3.11) so tests and CI act as a safety net.
