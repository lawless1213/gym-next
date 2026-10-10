# Gym Next — Project Status

_Updated: 2026-10-09. Detailed checklist plan — [ROADMAP.md](./ROADMAP.md)._

## ✅ Done

| Module | Status |
|---|---|
| Auth | Email/password, Google, GitHub, email verification, password/email change, re-authentication, account deletion |
| Schedule | Weekly calendar, assigning routines to days, one-tap workout start |
| Workouts | Active mode (sets, reps, weight), quick workout, session persistence (`useWorkoutSessionPersistence`) |
| Library | 260+ standard exercises, search and muscle-group filter, muscle map (male/female), custom exercises (Premium), routines |
| History | Past workouts, volume, exercise frequency |
| Stats | Personal records, weekly trends, body measurements with charts (Recharts, Premium) |
| AI | Exercise, routine and schedule generation (Gemini, structured output), AI chat, free tries for non-subscribers |
| PWA | Installable, install banner, image caching, React Query offline cache in IndexedDB |
| UI/UX | Dark/light theme with theme-aware favicon, uk/en localization, animations (motion), toasts (sonner), skeleton loaders |
| Other | Subscription page (plans UI), cookie banner, subscription banner |

## 👍 What's good and worth keeping

- **Modern stack:** Next 16, React 19, Tailwind 4, zod 4, TanStack Query 5. No outdated libraries.
- **Clear layers:** `types` → `lib/schemas` → `lib/services` (reads) → `lib/actions` (writes) → `hooks/useServices` → components. New code is easy to add by following the pattern.
- **Forms on react-hook-form + zod** with i18n keys in validation messages.
- **Offline-first React Query** (`networkMode: "offlineFirst"`, IndexedDB persister, `resumePausedMutations`). A solid PWA foundation.
- **AI guard via the Admin SDK:** ID-token verification and transactional try deduction.
- **Gemini structured output** (JSON schema) mapped onto existing exercises and routines.
- **Centralized modals** (`modal-store` with a Promise-based `confirm()`).
- **TypeScript strict**; `tsc --noEmit` passes cleanly.
- **Both locales in sync** (uk/en, ~640 lines each).

## ⚠️ What needs rework and why

### Critical (security & revenue)
| What | Why | How |
|---|---|---|
| No Firestore/Storage rules in the repo | It's unclear what is protected; if rules are open, anyone can read/write other users' data | `firestore.rules` + `storage.rules` in the repo, deployed via `firebase.json`, tested on the emulator |
| `subscribed` is created from the client (`ensureUserDoc`) | A user can grant themselves premium or unlimited AI tries | Create the user document and handle all subscription logic on the server (Admin SDK / Cloud Function); the client only reads `subscribed` |
| ✅ ~~UI checks `subscribed.isActive`, the guard checks `subscribed.type`~~ | Fixed in roadmap 0.4 | One model `{ plan, status, expiresAt, freeAiTries }`; `isSubscriptionActive()` in `lib/subscription.ts` is used by both the guard and the UI |
| AI server actions read data with the client SDK (`getUserRoutines`, `getCommonExercises`) | The client SDK is unauthenticated on the server: either rules are open or the queries fail | Use only `adminDb` in server actions |
| A try is charged before the Gemini call; premium has no limits; message/history length is unbounded | Lost tries on failures, Gemini bill risk, prompt injection via forged history | Charge after success or refund, daily limit, zod input validation |
| `JSON.parse(...) as T` for AI responses | An invalid model response breaks the UI | `schema.safeParse`, generate schemas from zod (`z.toJSONSchema`) |
| `locale` cookie goes into `import()` unchecked | An arbitrary value breaks rendering | Check against `i18n/locales.ts`, fall back to `uk` |

### Bugs
| What | Why |
|---|---|
| ✅ ~~`import { subscribe } from "diagnostics_channel"` in `hooks/useAuth.tsx`~~ | Fixed in roadmap 1.1 |
| `useTranslations` inside `.map()` in `settings/subscribe/Plans` | Violates the rules of hooks |
| `handleSubscribe` only does `console.log` | Payments not implemented |
| Hardcoded `<html lang="en">` | Default locale is `uk`; bad for accessibility and SEO |
| `Inter({ subsets: ["latin"] })` | Cyrillic renders in a fallback font |
| `maximumScale: 1` | Blocks zoom, hurts accessibility |
| Junk in `tsconfig.json` `include` (`data/navManu.еs`, `lib/schemas/schedule.schema/ts`) | Non-existent paths, one with a Cyrillic "е" |
| `pnpm-workspace.yaml`: `'@google/genai': set this to true or false` | Invalid value |
| IndexedDB cache isn't cleared on logout | The next user on the device sees the previous user's cached data |

### Packages
| What | Why |
|---|---|
| `@headlessui/react`, `@tailwindplus/elements`, `@tanstack/query-sync-storage-persister` | Unused (0 imports) — remove |
| `@vercel/speed-insights` | Hosted on Firebase App Hosting, so no data is collected |
| `package-lock.json` alongside `pnpm-lock.yaml` | Two lock files cause dependency drift; keep pnpm only |
| `@ducanh2912/next-pwa` | Webpack plugin, poor fit with Next 16/Turbopack; replace with Serwist |
| `@types/node ^20` | Upgrade to 22+ |

### Code quality & structure
| What | Why |
|---|---|
| `lib/actions/*` are client functions but named like server actions | Misleading; rename to `lib/mutations`, keep real server actions separate |
| Ukrainian error strings in server code | Bypass next-intl; return error codes instead |
| Hand-written JSON schemas for Gemini duplicate zod | Two sources of truth |
| Naming: `shedule.ts`, `navManu.tsx`, `TypewritterText`, `__components` vs `_components` | Confusing, hard to search |
| `useAuth.tsx` (a provider) lives in `hooks/` | Move to `providers/` |
| ~51 occurrences of `console.log` / `any` / `@ts-ignore` | Console noise, holes in typing |
| Query keys are inline strings across components | Easy to get invalidation wrong; needs a key factory |
| Every page is `"use client"` | No server-rendering benefits; layout and static parts can be server components |
| `MuscleSchema` — ~1800 lines of inline SVG | Hard to maintain; move paths into data |
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

## 🤖 Claude skills in the repo
- `.claude/skills/gym-next-feature` — how to add a feature following the project's layers
- `.claude/skills/gym-next-ai-action` — template for a Gemini server action
