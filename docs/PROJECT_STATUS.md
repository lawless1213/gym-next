# Gym Next — Project Status

_Updated: 2026-10-09. Detailed checklist plan — [ROADMAP.md](./ROADMAP.md)._

## ✅ Done

| Module   | Status                                                                                                                  |
| -------- | ----------------------------------------------------------------------------------------------------------------------- |
| Auth     | Email/password, Google, GitHub, email verification, password/email change, re-authentication, account deletion          |
| Schedule | Weekly calendar, assigning routines to days, one-tap workout start                                                      |
| Workouts | Active mode (sets, reps, weight), quick workout, session persistence (`useWorkoutSessionPersistence`)                   |
| Library  | 260+ standard exercises, search and muscle-group filter, muscle map (male/female), custom exercises (Premium), routines |
| History  | Past workouts, volume, exercise frequency                                                                               |
| Stats    | Personal records, weekly trends, body measurements with charts (Recharts, Premium)                                      |
| AI       | Exercise, routine and schedule generation (Gemini, structured output), AI chat, free tries for non-subscribers          |
| PWA      | Installable, install banner, image caching, React Query offline cache in IndexedDB                                      |
| UI/UX    | Dark/light theme with theme-aware favicon, uk/en localization, animations (motion), toasts (sonner), skeleton loaders   |
| Other    | Subscription page (plans UI), cookie banner, subscription banner                                                        |

## 👍 What's good and worth keeping

- **Modern stack:** Next 16, React 19, Tailwind 4, zod 4, TanStack Query 5. No outdated libraries.
- **Clear layers:** `types` → `lib/schemas` → `lib/services` (reads) → `lib/mutations` (client writes; server actions in `lib/server/actions`) → `hooks/useServices` → components. New code is easy to add by following the pattern.
- **Forms on react-hook-form + zod** with i18n keys in validation messages.
- **Offline-first React Query** (`networkMode: "offlineFirst"`, IndexedDB persister, `resumePausedMutations`). A solid PWA foundation.
- **AI guard via the Admin SDK:** ID-token verification and transactional try deduction.
- **Gemini structured output** (JSON schema) mapped onto existing exercises and routines.
- **Centralized modals** (`ModalProvider` with a Promise-based `confirm()`).
- **TypeScript strict**; `tsc --noEmit` passes cleanly.
- **Both locales in sync** (uk/en, ~640 lines each).

## ⚠️ What needs rework and why

### Critical (security & revenue)

| What                                                                                                       | Why                                                                                                            | How                                                                                                                                          |
| ---------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| ✅ ~~No Firestore/Storage rules in the repo~~                                                              | Fixed in roadmap 0.1, covered by emulator tests (0.2, `pnpm test:rules`)                                       | `firestore.rules` + `storage.rules` in the repo, deployed via `firebase.json`                                                                |
| ✅ ~~`subscribed` is created from the client (`ensureUserDoc`)~~                                           | Fixed in roadmap 0.3 (client code); fully closed once Firestore rules (0.1) deny client writes to `subscribed` | User doc is created by the `initUserDoc` server action (Admin SDK); the client only reads `subscribed`                                       |
| ✅ ~~UI checks `subscribed.isActive`, the guard checks `subscribed.type`~~                                 | Fixed in roadmap 0.4                                                                                           | One model `{ plan, status, expiresAt, freeAiTries }`; `isSubscriptionActive()` in `lib/subscription.ts` is used by both the guard and the UI |
| ✅ ~~AI server actions read data with the client SDK (`getUserRoutines`, `getCommonExercises`)~~           | Fixed in roadmap 0.5                                                                                           | Server-side readers in `lib/server/data/*` (Admin SDK, `server-only`)                                                                        |
| ✅ ~~A try is charged before the Gemini call; premium has no limits; message/history length is unbounded~~ | Fixed in roadmap 0.6                                                                                           | `withAiTry`: reserve + refund on failure, premium daily limit, zod input validation                                                          |
| ✅ ~~`JSON.parse(...) as T` for AI responses~~                                                             | Fixed in roadmap 0.7                                                                                           | `generateStructured` validates with zod `safeParse`; Gemini schema generated via `z.toJSONSchema`                                            |
| ✅ ~~`locale` cookie goes into `import()` unchecked~~                                                      | Fixed in roadmap 0.8                                                                                           | `isLocale()` check, fallback to `DEFAULT_LOCALE` (`uk`)                                                                                      |

### Bugs

| What                                                                                           | Why                      |
| ---------------------------------------------------------------------------------------------- | ------------------------ |
| ✅ ~~`import { subscribe } from "diagnostics_channel"` in `hooks/useAuth.tsx`~~                | Fixed in roadmap 1.1     |
| ✅ ~~`useTranslations` inside `.map()` in `settings/subscribe/Plans`~~                         | Fixed in roadmap 1.2     |
| `handleSubscribe` only does `console.log`                                                      | Payments not implemented |
| ✅ ~~Hardcoded `<html lang="en">`~~                                                            | Fixed in roadmap 1.3     |
| ✅ ~~`Inter({ subsets: ["latin"] })`~~                                                         | Fixed in roadmap 1.3     |
| ✅ ~~`maximumScale: 1`~~                                                                       | Fixed in roadmap 1.3     |
| ✅ ~~Junk in `tsconfig.json` `include` (`data/navManu.еs`, `lib/schemas/schedule.schema/ts`)~~ | Fixed in roadmap 1.4     |
| ✅ ~~`pnpm-workspace.yaml`: `'@google/genai': set this to true or false`~~                     | Fixed in roadmap 1.5     |
| ✅ ~~IndexedDB cache isn't cleared on logout~~                                                 | Fixed in roadmap 1.6     |

### Packages

| What                                                                                    | Why                                                                   |
| --------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| `@headlessui/react`, `@tailwindplus/elements`, `@tanstack/query-sync-storage-persister` | Unused (0 imports) — remove                                           |
| `@vercel/speed-insights`                                                                | Hosted on Firebase App Hosting, so no data is collected               |
| `package-lock.json` alongside `pnpm-lock.yaml`                                          | Two lock files cause dependency drift; keep pnpm only                 |
| `@ducanh2912/next-pwa`                                                                  | Webpack plugin, poor fit with Next 16/Turbopack; replace with Serwist |
| `@types/node ^20`                                                                       | Upgrade to 22+                                                        |

### Code quality & structure

| What                                                                                                                | Why                                                                                                                  |
| ------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| ✅ ~~`lib/actions/*` are client functions but named like server actions~~                                           | Fixed in roadmap 3.1                                                                                                 |
| ✅ ~~Ukrainian error strings in server code~~                                                                       | Fixed in roadmap 3.3                                                                                                 |
| Hand-written JSON schemas for Gemini duplicate zod                                                                  | Two sources of truth                                                                                                 |
| ✅ ~~Naming: `shedule.ts`, `navManu.tsx`, `TypewritterText`, `__components` vs `_components`~~                      | Fixed in roadmap 3.4                                                                                                 |
| `useAuth.tsx` (a provider) lives in `hooks/`                                                                        | Move to `providers/`                                                                                                 |
| ~51 occurrences of `console.log` / `any` / `@ts-ignore`                                                             | Console noise, holes in typing                                                                                       |
| Query keys are inline strings across components                                                                     | Easy to get invalidation wrong; needs a key factory                                                                  |
| Every page is `"use client"`                                                                                        | No server-rendering benefits; layout and static parts can be server components                                       |
| `MuscleSchema` — ~1800 lines of inline SVG                                                                          | Hard to maintain; move paths into data                                                                               |
| Code is grouped by technical type (`types/`, `lib/schemas`, `lib/services`, `lib/actions`, `hooks/`, `components/`) | One change to a domain (e.g. routines) touches 6 folders; move to a feature-based structure (FSD-lite, roadmap 3.11) |

## 📋 Still to do

**Tooling & process**

- Prettier + `prettier-plugin-tailwindcss`, Husky + lint-staged
- ESLint rules: `no-console`, `no-explicit-any`, `rules-of-hooks: error`
- Scripts `typecheck`, `test`, `test:e2e`, `format`
- Vitest + Testing Library (records, volume, periods, guard, schemas)
- Firestore rules tests on the emulator
- GitHub Actions: lint + typecheck + test + build
- Sentry or Crashlytics

**Product**

- Payments (Stripe / LemonSqueezy) + webhook → server-side subscription update
- Reliable offline workout logging with a sync queue
- Rest timer (vibration, sound)
- Scheduled push reminders (FCM)
- 1RM estimate (Epley), history export to CSV
- Analytics (subscription funnel)
- Playwright e2e: login → workout → history → stats

## 🧭 Order

1. **Stage 1 — bugs** (~0.5 day), alongside the start of Stage 0
2. **Stage 0 — security & monetization** (~3–4 days), required before launching payments
3. **Stage 2 — packages & tooling** (~1–2 days), to have tests and CI before refactoring
4. **Stage 3 — architecture** (~1–2 weeks, incremental), including the FSD-lite migration
5. **Stage 4 — new features**

## 🔀 Who writes what

Decided in roadmap 3.2. Rule of thumb: the server owns money, limits and accounts; the user's own training data is written by the client so it works offline (Firestore persistent cache, 1.8). Client data can't be made trustworthy by the server anyway — the user writes their own history — so `firestore.rules` only rejects malformed writes (types, list sizes), which keeps history and stats queries from breaking.

| Data                                                 | Written by                                  | Offline                                 | Guard                                                                         |
| ---------------------------------------------------- | ------------------------------------------- | --------------------------------------- | ----------------------------------------------------------------------------- |
| `users/{uid}/workoutHistory/*`                       | client (`lib/mutations/workout.ts`)         | ✅                                      | rules: shape (`startedAt` timestamp, doc id = workout id, list/number limits) |
| `users/{uid}/stats/records`                          | client (`lib/mutations/record.ts`)          | ✅ (skipped if records unknown offline) | rules: ≤ 500 entries                                                          |
| `users/{uid}/stats/progress`                         | client (`lib/mutations/progress.ts`)        | ✅                                      | rules: known fields, lists                                                    |
| routines, schedule, custom exercises, profile fields | client (`lib/mutations/*`)                  | ✅                                      | rules: owner only                                                             |
| `users/{uid}` create / delete                        | server (`initUserDoc`, `deleteUserData`)    | —                                       | rules: client create/delete denied                                            |
| `subscribed`, `createdAt`, `aiUsage`                 | server (Admin SDK; payments webhook in 4.1) | —                                       | rules: client can't touch                                                     |
| `exercises` catalog                                  | console / server                            | —                                       | rules: read-only                                                              |

Revisit records if users start competing (leaderboards, challenges): then a server recompute from history (option B in 3.2) is worth the offline trade-off.

## 🤖 Claude skills in the repo

- `.claude/skills/gym-next-feature` — how to add a feature following the project's layers
- `.claude/skills/gym-next-ai-action` — template for a Gemini server action
